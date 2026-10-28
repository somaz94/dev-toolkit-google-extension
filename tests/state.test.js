import { describe, test, expect } from '@jest/globals';
import { createState, normalizeState, STATE_KEY } from '../src/lib/state.js';
import { memoryStorage } from './helpers/memoryStorage.js';

const IDS = ['json', 'base64', 'timestamp'];

describe('normalizeState', () => {
  test('starts with no tool, encode mode and no options', () => {
    expect(normalizeState(null, IDS)).toEqual({ tool: null, mode: 'encode', options: {} });
    expect(normalizeState([], IDS)).toEqual({ tool: null, mode: 'encode', options: {} });
  });

  test('keeps known values and drops the rest', () => {
    const raw = { tool: 'timestamp', mode: 'decode', options: { json: { indent: '4' }, gone: { a: 1 }, base64: 'bad' }, extra: 1 };
    expect(normalizeState(raw, IDS)).toEqual({ tool: 'timestamp', mode: 'decode', options: { json: { indent: '4' } } });
  });

  test('drops an unknown tool or mode', () => {
    expect(normalizeState({ tool: 'removed', mode: 'sideways', options: [] }, IDS)).toEqual({ tool: null, mode: 'encode', options: {} });
  });
});

describe('createState', () => {
  test('saves the tool, the mode and each tool\'s options without losing the others', () => {
    const storage = memoryStorage();
    const state = createState(IDS, storage);
    state.save({ tool: 'base64' });
    state.save({ mode: 'decode' });
    state.saveOptions('json', { indent: 'tab' });
    state.saveOptions('base64', { urlSafe: true });
    expect(state.load()).toEqual({ tool: 'base64', mode: 'decode', options: { json: { indent: 'tab' }, base64: { urlSafe: true } } });
  });

  test('reads a damaged entry as the start state', () => {
    const state = createState(IDS, memoryStorage({ [STATE_KEY]: '{bad' }));
    expect(state.load()).toEqual({ tool: null, mode: 'encode', options: {} });
    state.save({ tool: 'json' });
    expect(state.load().tool).toBe('json');
  });
});
