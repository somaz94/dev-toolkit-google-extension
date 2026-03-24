import { describe, test, expect } from '@jest/globals';
import { validateInput } from '../src/utils/validator.js';

describe('validateInput', () => {
  test('returns invalid for empty input', () => {
    expect(validateInput('', 'json').isValid).toBe(false);
    expect(validateInput('  ', 'base64').isValid).toBe(false);
    expect(validateInput(null, 'url').isValid).toBe(false);
  });

  // JSON validation
  test('validates valid JSON', () => {
    expect(validateInput('{"a":1}', 'json').isValid).toBe(true);
    expect(validateInput('[1,2,3]', 'json').isValid).toBe(true);
  });

  test('invalidates bad JSON', () => {
    const result = validateInput('{bad}', 'json');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid JSON');
  });

  // Base64 validation
  test('validates valid Base64', () => {
    expect(validateInput('SGVsbG8=', 'base64').isValid).toBe(true);
    expect(validateInput('YWJj', 'base64').isValid).toBe(true);
  });

  test('invalidates bad Base64', () => {
    expect(validateInput('not base64!@#', 'base64').isValid).toBe(false);
  });

  // JWT validation
  test('validates valid JWT token', () => {
    expect(validateInput('eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0IjoxfQ.sig', 'jwt').isValid).toBe(true);
  });

  test('invalidates bad JWT token', () => {
    expect(validateInput('bad.token.!!!', 'jwt').isValid).toBe(false);
  });

  test('validates JSON payload for JWT encode', () => {
    expect(validateInput('{"sub":"123"}', 'jwt').isValid).toBe(true);
  });

  test('invalidates bad JSON for JWT encode', () => {
    expect(validateInput('not json', 'jwt').isValid).toBe(false);
  });

  // URL validation
  test('validates valid URL', () => {
    expect(validateInput('https://example.com', 'url').isValid).toBe(true);
    expect(validateInput('http://test.com/path?q=1', 'url').isValid).toBe(true);
  });

  test('invalidates bad URL', () => {
    expect(validateInput('http://invalid url', 'url').isValid).toBe(false);
  });

  test('allows non-URL text for URL encoding', () => {
    expect(validateInput('hello world', 'url').isValid).toBe(true);
  });

  // Unknown type
  test('returns valid for unknown type', () => {
    expect(validateInput('anything', 'unknown').isValid).toBe(true);
  });
});
