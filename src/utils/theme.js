import { useState, useEffect } from "react"

/**
 * Theme constants and utilities
 */

// Theme values
export const THEME_LIGHT = "light"
export const THEME_DARK = "dark"
export const THEME_SYSTEM = "system"

// Default theme value
export const DEFAULT_THEME = THEME_SYSTEM

/**
 * Theme to icons mapping
 */
export const THEME_ICONS = {
  [THEME_LIGHT]: "☀️",
  [THEME_DARK]: "🌙",
  [THEME_SYSTEM]: "💻",
}

/**
 * Theme to names mapping
 */
export const THEME_NAMES = {
  [THEME_LIGHT]: "Светлая",
  [THEME_DARK]: "Темная",
  [THEME_SYSTEM]: "Системная",
}

/**
 * Gets the actual active theme (resolves system theme to light/dark)
 * @param {string} theme - Current theme value
 * @returns {string} Active theme (light or dark)
 */
export function getActiveTheme(theme) {
  if (theme === THEME_SYSTEM) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_DARK
      : THEME_LIGHT
  }
  return theme
}

/**
 * Determines if dark theme should be applied based on current theme preference
 * @param {string} theme - Current theme value
 * @returns {boolean} Whether dark theme should be active
 */
/**
 * Gets the next theme in the toggle cycle (light <-> dark)
 * @param {string} currentTheme - Current theme value
 * @returns {string} Next theme (light or dark)
 */
export function getNextTheme(currentTheme) {
  const active = getActiveTheme(currentTheme)
  return active === THEME_LIGHT ? THEME_DARK : THEME_LIGHT
}

/**
 * Custom React hook for managing application theme
 *
 * Manages theme state, syncs with localStorage, applies theme to document,
 * and listens for system theme changes when using system theme.
 *
 * @returns {[string, function]} Tuple of [theme, setTheme]
 */
export function useTheme() {
  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState(() => {
    return localStorage.theme || DEFAULT_THEME
  })

  // Apply theme to document and sync with localStorage
  useEffect(() => {
    const root = document.documentElement
    const isDark = getActiveTheme(theme) === THEME_DARK

    // Apply theme class to root element
    root.classList.toggle(THEME_DARK, isDark)

    // Sync with localStorage
    if (theme === THEME_SYSTEM) {
      localStorage.removeItem("theme")
    } else {
      localStorage.theme = theme
    }
  }, [theme])

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (theme !== THEME_SYSTEM) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      const root = document.documentElement
      root.classList.toggle(THEME_DARK, e.matches)
    }

    // Set initial state
    handleChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  return [theme, setTheme]
}
