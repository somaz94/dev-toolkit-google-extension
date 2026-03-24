import { describe, test, expect } from '@jest/globals';
import { encodeJWT } from '../src/utils/jwtEncoder.js';

describe('encodeJWT', () => {
  test('encodes valid JSON payload', async () => {
    const result = await encodeJWT('{"sub":"1234567890"}');
    expect(typeof result).toBe('string');
    const parts = result.split('.');
    expect(parts).toHaveLength(3);
  });

  test('header contains HS256', async () => {
    const result = await encodeJWT('{"test":true}');
    const header = JSON.parse(atob(result.split('.')[0]));
    expect(header.alg).toBe('HS256');
    expect(header.typ).toBe('JWT');
  });

  test('payload is correctly encoded', async () => {
    const result = await encodeJWT('{"name":"John"}');
    const payloadB64 = result.split('.')[1];
    // Add padding
    const padded = payloadB64 + '='.repeat((4 - payloadB64.length % 4) % 4);
    const payload = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
    expect(payload.name).toBe('John');
  });

  test('uses custom secret from second line', async () => {
    const result1 = await encodeJWT('{"a":1}\nsecret1');
    const result2 = await encodeJWT('{"a":1}\nsecret2');
    // Different secrets produce different signatures
    expect(result1.split('.')[2]).not.toBe(result2.split('.')[2]);
  });

  test('returns error for invalid JSON', async () => {
    const result = await encodeJWT('{invalid}');
    expect(result.error).toBeDefined();
  });
});
