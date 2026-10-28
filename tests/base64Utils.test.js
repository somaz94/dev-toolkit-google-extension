import { describe, test, expect } from '@jest/globals';
import { base64ToBytes, bytesToBase64, decodeBase64, encodeBase64 } from '../src/utils/base64Utils.js';

describe('encodeBase64', () => {
  test('encodes text to base64', () => {
    expect(encodeBase64('Hello World!')).toBe('SGVsbG8gV29ybGQh');
  });

  test('encodes empty string', () => {
    expect(encodeBase64('')).toBe('');
  });

  test('encodes any text as UTF-8', () => {
    expect(encodeBase64('한글')).toBe('7ZWc6riA');
    expect(encodeBase64(String.fromCodePoint(0x1F600))).toBe('8J+YgA==');
  });

  test('URL-safe swaps the alphabet and drops the padding', () => {
    expect(encodeBase64('??>', { urlSafe: true })).toBe('Pz8-');
    expect(encodeBase64(String.fromCodePoint(0x1F600), { urlSafe: true })).toBe('8J-YgA');
  });

  test('encodes input larger than one conversion chunk', () => {
    const text = 'a'.repeat(100000);
    expect(decodeBase64(encodeBase64(text))).toBe(text);
  });
});

describe('decodeBase64', () => {
  test('decodes base64 to text', () => {
    expect(decodeBase64('SGVsbG8gV29ybGQh')).toBe('Hello World!');
  });

  test('decodes UTF-8 text', () => {
    expect(decodeBase64('7ZWc6riA')).toBe('한글');
  });

  test('accepts URL-safe input, missing padding and line breaks', () => {
    expect(decodeBase64('8J-YgA')).toBe(String.fromCodePoint(0x1F600));
    expect(decodeBase64('SGVsbG8g\nV29ybGQh')).toBe('Hello World!');
  });

  test('returns bytes that are not UTF-8 one character per byte', () => {
    expect(decodeBase64('/w==')).toBe('\xff');
  });

  test('throws for invalid base64', () => {
    expect(() => decodeBase64('!!!invalid!!!')).toThrow('Invalid');
  });
});

describe('bytes', () => {
  test('round-trip', () => {
    const bytes = Uint8Array.from([0, 251, 255]);
    expect(bytesToBase64(bytes)).toBe('APv/');
    expect(bytesToBase64(bytes, { urlSafe: true })).toBe('APv_');
    expect([...base64ToBytes('APv_')]).toEqual([0, 251, 255]);
  });
});
