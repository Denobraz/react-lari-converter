import {useEffect, useState} from 'react';
import {getThemePreference, resolveTheme, toggleTheme} from '../helpers/themeStorage.js';

export default function ThemeToggle() {
    const [theme, setThemeState] = useState(() => resolveTheme());

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const sync = () => {
            if (!getThemePreference()) {
                setThemeState(resolveTheme());
            }
        };
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    const handleToggle = () => {
        setThemeState(toggleTheme());
    };

    return (
        <button
            type='button'
            onClick={handleToggle}
            className='theme-toggle'
            aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
            {theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
        </button>
    );
}
