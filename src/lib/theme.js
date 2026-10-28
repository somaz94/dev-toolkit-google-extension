export const THEMES = Object.freeze(['auto', 'light', 'dark']);
// Read by src/theme-early.js too, which cannot import this module.
export const THEME_KEY = 'theme';

const ICONS = { auto: '🌓', light: '☀️', dark: '🌙' };
export const THEME_TITLES = Object.freeze({ auto: 'themeAuto', light: 'themeLight', dark: 'themeDark' });

export const nextTheme = (setting) => THEMES[(THEMES.indexOf(setting) + 1) % THEMES.length];
export const themeIcon = (setting) => ICONS[setting];
/** The message key that names `setting` on the toggle. */
export const themeTitle = (setting) => THEME_TITLES[setting];

/** 'light' or 'dark' for a setting; 'auto' follows the system. */
export function resolveTheme(setting, prefersDark) {
  if (setting === 'light' || setting === 'dark') return setting;
  return prefersDark ? 'dark' : 'light';
}

/** Keeps the page in the stored theme setting, following the system while it is 'auto'. */
export function createThemer(doc, {
  storage = globalThis.localStorage,
  media = globalThis.matchMedia?.('(prefers-color-scheme: dark)'),
} = {}) {
  let setting = THEMES.includes(storage.getItem(THEME_KEY)) ? storage.getItem(THEME_KEY) : 'auto';
  const paint = () => doc.documentElement.setAttribute('data-theme', resolveTheme(setting, media?.matches));
  media?.addEventListener('change', paint);
  paint();
  return {
    current: () => setting,
    toggle() {
      setting = nextTheme(setting);
      storage.setItem(THEME_KEY, setting);
      paint();
      return setting;
    },
  };
}
