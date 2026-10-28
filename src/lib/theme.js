export const THEMES = Object.freeze(['light', 'dark']);
export const THEME_KEY = 'theme';

// The toggle shows the theme a click switches to.
const ICONS = { light: '🌙', dark: '☀️' };

export const nextTheme = (theme) => (theme === 'dark' ? 'light' : 'dark');
export const themeIcon = (theme) => ICONS[theme];

/** Keeps the page in the stored theme and switches it on `toggle()`. */
export function createThemer(doc, storage = globalThis.localStorage) {
  let theme = THEMES.includes(storage.getItem(THEME_KEY)) ? storage.getItem(THEME_KEY) : 'light';
  const paint = () => doc.documentElement.setAttribute('data-theme', theme);
  paint();
  return {
    current: () => theme,
    toggle() {
      theme = nextTheme(theme);
      storage.setItem(THEME_KEY, theme);
      paint();
      return theme;
    },
  };
}
