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
});
