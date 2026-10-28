import { describe, test, expect } from '@jest/globals';
import { createThemer, nextTheme, resolveTheme, THEME_KEY, themeIcon, themeTitle, THEMES } from '../src/lib/theme.js';
import { memoryStorage } from './helpers/memoryStorage.js';

const fakeDocument = () => {
  const attributes = {};
  return { attributes, documentElement: { setAttribute: (name, value) => { attributes[name] = value; } } };
};

function fakeMedia(matches) {
  const listeners = [];
  return {
    matches,
    addEventListener: (type, listener) => listeners.push(listener),
    flip(next) {
      this.matches = next;
      for (const listener of listeners) listener();
    },
  };
}

describe('theme', () => {
  test('cycles system, light, dark', () => {
    expect(THEMES.map(nextTheme)).toEqual(['light', 'dark', 'auto']);
  });

  test('every setting has an icon and a title', () => {
    for (const setting of THEMES) {
      expect(themeIcon(setting)).toBeTruthy();
      expect(themeTitle(setting)).toMatch(/^theme[A-Z]/);
    }
  });

  test('auto follows the system', () => {
    expect(resolveTheme('auto', true)).toBe('dark');
    expect(resolveTheme('auto', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  test('starts on auto, or on the stored setting', () => {
    const doc = fakeDocument();
    expect(createThemer(doc, { storage: memoryStorage(), media: fakeMedia(true) }).current()).toBe('auto');
    expect(doc.attributes['data-theme']).toBe('dark');
    expect(createThemer(fakeDocument(), { storage: memoryStorage({ [THEME_KEY]: 'light' }) }).current()).toBe('light');
  });

  test('ignores an unknown stored setting', () => {
    expect(createThemer(fakeDocument(), { storage: memoryStorage({ [THEME_KEY]: 'neon' }) }).current()).toBe('auto');
  });

  test('repaints when the system changes while on auto, and not otherwise', () => {
    const doc = fakeDocument();
    const media = fakeMedia(false);
    const themer = createThemer(doc, { storage: memoryStorage(), media });
    media.flip(true);
    expect(doc.attributes['data-theme']).toBe('dark');
    themer.toggle();
    media.flip(true);
    expect(doc.attributes['data-theme']).toBe('light');
  });

  test('toggle paints the page and stores the setting', () => {
    const doc = fakeDocument();
    const storage = memoryStorage();
    const themer = createThemer(doc, { storage, media: fakeMedia(false) });
    expect(themer.toggle()).toBe('light');
    expect(themer.toggle()).toBe('dark');
    expect(doc.attributes['data-theme']).toBe('dark');
    expect(storage.getItem(THEME_KEY)).toBe('dark');
  });

  test('works without matchMedia', () => {
    const doc = fakeDocument();
    createThemer(doc, { storage: memoryStorage(), media: undefined });
    expect(doc.attributes['data-theme']).toBe('light');
  });
});
