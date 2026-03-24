import { describe, test, expect } from '@jest/globals';
import { formatJSON, minifyJSON, validateJSON } from '../src/utils/jsonFormatter.js';

describe('formatJSON', () => {
  test('formats valid JSON with 2 spaces', () => {
    const input = '{"name":"John","age":30}';
    const result = formatJSON(input, 2);
    expect(result).toContain('"name": "John"');
    expect(result).toContain('  "age": 30');
  });

  test('formats with 4 spaces', () => {
    const result = formatJSON('{"a":1}', 4);
    expect(result).toContain('    "a": 1');
  });

  test('formats with tab', () => {
    const result = formatJSON('{"a":1}', 'tab');
    expect(result).toContain('\t"a": 1');
  });

  test('returns error for invalid JSON', () => {
    const result = formatJSON('{invalid}');
    expect(result).toContain('Error');
  });

  test('returns empty for empty input', () => {
    expect(formatJSON('')).toBe('');
    expect(formatJSON('  ')).toBe('');
  });
});

describe('minifyJSON', () => {
  test('minifies formatted JSON', () => {
    const input = '{\n  "name": "John",\n  "age": 30\n}';
    expect(minifyJSON(input)).toBe('{"name":"John","age":30}');
  });

  test('returns error for invalid JSON', () => {
    expect(minifyJSON('{bad}')).toContain('Error');
  });
});

describe('validateJSON', () => {
  test('returns true for valid JSON', () => {
    expect(validateJSON('{"a":1}')).toBe(true);
    expect(validateJSON('[1,2,3]')).toBe(true);
  });

  test('returns false for invalid JSON', () => {
    expect(validateJSON('{bad}')).toBe(false);
    expect(validateJSON('')).toBe(false);
  });
});
