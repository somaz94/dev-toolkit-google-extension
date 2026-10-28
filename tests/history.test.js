import { describe, test, expect } from '@jest/globals';
import { createHistory, historyLabel, MAX_HISTORY } from '../src/lib/history.js';
import { memoryStorage } from './helpers/memoryStorage.js';

describe('createHistory', () => {
  test('keeps the newest input first, without duplicates, per tool', () => {
    const history = createHistory(memoryStorage());
    history.save('json', 'a');
    history.save('json', 'b');
    history.save('json', 'a');
    history.save('url', 'c');
    expect(history.load('json')).toEqual(['a', 'b']);
    expect(history.last('url')).toBe('c');
  });

  test('keeps at most the limit', () => {
    const history = createHistory(memoryStorage());
    for (let i = 0; i < MAX_HISTORY + 2; i++) history.save('json', String(i));
    expect(history.load('json')).toEqual(['6', '5', '4', '3', '2']);
  });

  test('ignores blank input', () => {
    const history = createHistory(memoryStorage());
    history.save('json', '  ');
    expect(history.last('json')).toBe('');
  });

  test('reads a damaged or foreign entry as empty', () => {
    const storage = memoryStorage({ history_json: '{bad', history_url: '{"a":1}' });
    const history = createHistory(storage);
    expect(history.load('json')).toEqual([]);
    expect(history.load('url')).toEqual([]);
    history.save('json', 'x');
    expect(history.load('json')).toEqual(['x']);
  });
});

describe('historyLabel', () => {
  test('puts an entry on one line', () => {
    expect(historyLabel('  {\n  "a": 1\n}  ')).toBe('{ "a": 1 }');
  });

  test('cuts a long entry with an ellipsis', () => {
    expect(historyLabel('x'.repeat(60), 10)).toBe('xxxxxxxxx…');
    expect(historyLabel('x'.repeat(10), 10)).toBe('xxxxxxxxxx');
  });
});
