import { describe, test, expect } from '@jest/globals';
import { encodeBase64, decodeBase64 } from '../src/utils/base64Utils.js';

describe('encodeBase64', () => {
  test('encodes text to base64', () => {
    expect(encodeBase64('Hello World!')).toBe('SGVsbG8gV29ybGQh');
  });

  test('encodes empty string', () => {
    expect(encodeBase64('')).toBe('');
  });
});

describe('decodeBase64', () => {
  test('decodes base64 to text', () => {
    expect(decodeBase64('SGVsbG8gV29ybGQh')).toBe('Hello World!');
  });

  test('returns error for invalid base64', () => {
    expect(decodeBase64('!!!invalid!!!')).toContain('Invalid');
  });
});

describe('encodeBase64 error handling', () => {
  test('handles encoding error gracefully', () => {
    // btoa fails on characters outside Latin1
    const result = encodeBase64(String.fromCodePoint(0x1F600));
    expect(result).toContain('Invalid');
  });
});
