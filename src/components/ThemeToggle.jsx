import { useTheme, getNextTheme, getActiveTheme, THEME_ICONS, THEME_NAMES } from "../utils/theme.js"
import { Button } from "./ui/Button.jsx"

export function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  const activeTheme = getActiveTheme(theme)

  const cycleTheme = () => {
    setTheme((prev) => getNextTheme(prev))
  }

  return (
    <Button
      variant="icon"
      onClick={cycleTheme}
      title={`Тема: ${THEME_NAMES[activeTheme]}`}
      aria-label="Переключить тему"
    >
      <span className="text-xl">{THEME_ICONS[activeTheme]}</span>
    </Button>
  )
}
