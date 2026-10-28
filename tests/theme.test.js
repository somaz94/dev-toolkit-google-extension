import { describe, test, expect } from '@jest/globals';
import { createThemer, nextTheme, THEME_KEY, themeIcon } from '../src/lib/theme.js';
import { memoryStorage } from './helpers/memoryStorage.js';

const fakeDocument = () => {
  const attributes = {};
  return { attributes, documentElement: { setAttribute: (name, value) => { attributes[name] = value; } } };
};

describe('theme', () => {
  test('nextTheme flips and the icon shows the theme a click switches to', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
    expect(themeIcon('light')).toBe('🌙');
    expect(themeIcon('dark')).toBe('☀️');
  });

  test('starts light, or in the stored theme', () => {
    const doc = fakeDocument();
    expect(createThemer(doc, memoryStorage()).current()).toBe('light');
    expect(doc.attributes['data-theme']).toBe('light');
    expect(createThemer(fakeDocument(), memoryStorage({ [THEME_KEY]: 'dark' })).current()).toBe('dark');
  });

  test('ignores an unknown stored theme', () => {
    expect(createThemer(fakeDocument(), memoryStorage({ [THEME_KEY]: 'neon' })).current()).toBe('light');
  });

  test('toggle paints the page and stores the choice', () => {
    const doc = fakeDocument();
    const storage = memoryStorage();
    const themer = createThemer(doc, storage);
    expect(themer.toggle()).toBe('dark');
    expect(doc.attributes['data-theme']).toBe('dark');
    expect(storage.getItem(THEME_KEY)).toBe('dark');
  });
});
