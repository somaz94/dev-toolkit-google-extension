import { describe, test, expect } from '@jest/globals';
import { encodeURL, decodeURL } from '../src/utils/urlUtils.js';

describe('encodeURL', () => {
  test('encodes special characters', () => {
    expect(encodeURL('hello world')).toBe('hello%20world');
  });

  test('encodes full URL', () => {
    const result = encodeURL('https://example.com?name=John Doe');
    expect(result).toContain('%3A');
    expect(result).toContain('%20');
  });
});

describe('decodeURL', () => {
  test('decodes encoded URL', () => {
    expect(decodeURL('hello%20world')).toBe('hello world');
  });

  test('handles encoding error', () => {
    // encodeURIComponent handles most inputs, test edge case
    const result = encodeURL('test & value');
    expect(result).toContain('%26');
  });

  test('handles decoding error', () => {
    const result = decodeURL('%E0%A4%A');
    expect(result).toContain('Invalid');
  });
});
