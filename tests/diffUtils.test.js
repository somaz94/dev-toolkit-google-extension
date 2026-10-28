import { describe, test, expect } from '@jest/globals';
import { computeDiff, diffLines } from '../src/utils/diffUtils.js';

describe('computeDiff', () => {
  test('detects identical lines', () => {
    const result = computeDiff('hello\n---\nhello');
    expect(result).toContain('0 added');
    expect(result).toContain('0 removed');
    expect(result).toContain('1 unchanged');
  });

  test('detects added lines', () => {
    const result = computeDiff('line1\n---\nline1\nline2');
    expect(result).toContain('+1 added');
  });

  test('detects removed lines', () => {
    const result = computeDiff('line1\nline2\n---\nline1');
    expect(result).toContain('-1 removed');
  });

  test('detects changed lines', () => {
    const result = computeDiff('old text\n---\nnew text');
    expect(result).toContain('- old text');
    expect(result).toContain('+ new text');
  });

  test('throws without separator', () => {
    expect(() => computeDiff('no separator here')).toThrow('Separate two texts');
  });

  test('supports === separator', () => {
    const result = computeDiff('aaa\n===\nbbb');
    expect(result).toContain('- aaa');
    expect(result).toContain('+ bbb');
  });

  test('aligns lines instead of pairing them by position', () => {
    const result = computeDiff('a\nb\nc\n---\nnew\na\nb\nc');
    expect(result).toContain('+1 added, -0 removed, 3 unchanged');
    expect(result.split('\n').slice(2)).toEqual(['+ new', '  a', '  b', '  c']);
  });

  test('shows a replaced line as a removal then an addition', () => {
    const result = computeDiff('apple\nbanana\ncherry\n---\napple\nblueberry\ncherry\ndate');
    expect(result.split('\n').slice(2)).toEqual(['  apple', '- banana', '+ blueberry', '  cherry', '+ date']);
  });

  test('accepts Windows line endings', () => {
    expect(computeDiff('a\r\nb\n---\na\r\nb')).toContain('2 unchanged');
  });
});

// Length of the longest common subsequence, by dynamic programming.
function lcs(a, b) {
  const row = new Array(b.length + 1).fill(0);
  for (const line of a) {
    let diagonal = 0;
    for (let j = 1; j <= b.length; j += 1) {
      const above = row[j];
      row[j] = line === b[j - 1] ? diagonal + 1 : Math.max(row[j], row[j - 1]);
      diagonal = above;
    }
  }
  return row[b.length];
}

describe('diffLines', () => {
  test('is a minimal edit script that rebuilds both texts', () => {
    let seed = 7;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const lines = (count) => Array.from({ length: count }, () => 'abcd'[Math.floor(random() * 4)]);
    for (let round = 0; round < 300; round += 1) {
      const a = lines(Math.floor(random() * 12));
      const b = lines(Math.floor(random() * 12));
      const script = diffLines(a, b);
      expect(script.filter(([op]) => op !== '+').map(([, line]) => line)).toEqual(a);
      expect(script.filter(([op]) => op !== '-').map(([, line]) => line)).toEqual(b);
      expect(script.filter(([op]) => op === ' ').length).toBe(lcs(a, b));
    }
  });

  test('falls back to one removed and one added block past the edit limit', () => {
    const script = diffLines(['same', 'a1', 'a2', 'same'], ['same', 'b1', 'b2', 'same'], 1);
    expect(script).toEqual([[' ', 'same'], ['-', 'a1'], ['-', 'a2'], ['+', 'b1'], ['+', 'b2'], [' ', 'same']]);
  });

  test('handles empty sides', () => {
    expect(diffLines([], ['x'])).toEqual([['+', 'x']]);
    expect(diffLines(['x'], [])).toEqual([['-', 'x']]);
    expect(diffLines([], [])).toEqual([]);
  });
});
