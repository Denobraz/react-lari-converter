const THEME_KEY = 'theme';

export function getThemePreference() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return null;
}

export function resolveTheme(preference = getThemePreference()) {
    if (preference === 'light' || preference === 'dark') return preference;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(preference) {
    const root = document.documentElement;
    if (preference === 'light' || preference === 'dark') {
        root.dataset.theme = preference;
    } else {
        delete root.dataset.theme;
    }
}

export function setTheme(preference) {
    if (preference === 'light' || preference === 'dark') {
        localStorage.setItem(THEME_KEY, preference);
    } else {
        localStorage.removeItem(THEME_KEY);
    }
    applyTheme(preference);
}

export function initTheme() {
    applyTheme(getThemePreference());
}

export function toggleTheme() {
    const next = resolveTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}
