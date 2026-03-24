import { describe, test, expect } from '@jest/globals';
import { computeDiff } from '../src/utils/diffUtils.js';

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
});
