import { describe, test, expect } from '@jest/globals';
import { shortcutFor } from '../src/lib/shortcuts.js';

const key = (key, modifiers = {}) => ({ key, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...modifiers });

describe('shortcutFor', () => {
  test('Ctrl or Cmd with Enter runs', () => {
    expect(shortcutFor(key('Enter', { ctrlKey: true }), 9)).toEqual({ action: 'run' });
    expect(shortcutFor(key('Enter', { metaKey: true }), 9)).toEqual({ action: 'run' });
  });

  test('Ctrl+Shift+C copies', () => {
    expect(shortcutFor(key('C', { ctrlKey: true, shiftKey: true }), 9)).toEqual({ action: 'copy' });
    expect(shortcutFor(key('c', { ctrlKey: true }), 9)).toBeNull();
  });

  test('Alt with a digit picks an existing tab', () => {
    expect(shortcutFor(key('1', { altKey: true }), 9)).toEqual({ action: 'tab', index: 0 });
    expect(shortcutFor(key('9', { altKey: true }), 9)).toEqual({ action: 'tab', index: 8 });
    expect(shortcutFor(key('5', { altKey: true }), 4)).toBeNull();
    expect(shortcutFor(key('0', { altKey: true }), 9)).toBeNull();
  });

  test('anything else is not a shortcut', () => {
    expect(shortcutFor(key('Enter'), 9)).toBeNull();
    expect(shortcutFor(key('a'), 9)).toBeNull();
  });
});
