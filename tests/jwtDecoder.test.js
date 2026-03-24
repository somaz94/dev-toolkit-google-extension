import { describe, test, expect } from '@jest/globals';
import { decodeJWT } from '../src/utils/jwtDecoder.js';

// Valid JWT: header={"alg":"HS256","typ":"JWT"}, payload={"sub":"1234567890","name":"John Doe","iat":1516239022}
const VALID_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJWT', () => {
  test('decodes valid JWT header', () => {
    const result = decodeJWT(VALID_JWT);
    expect(result.error).toBeUndefined();
    expect(result.header).toContain('"alg": "HS256"');
    expect(result.header).toContain('"typ": "JWT"');
  });

  test('decodes valid JWT payload', () => {
    const result = decodeJWT(VALID_JWT);
    expect(result.payload).toContain('"sub": "1234567890"');
    expect(result.payload).toContain('"name": "John Doe"');
    expect(result.payload).toContain('"iat": 1516239022');
  });

  test('returns signature', () => {
    const result = decodeJWT(VALID_JWT);
    expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  test('returns error for invalid JWT', () => {
    const result = decodeJWT('not.a.jwt');
    expect(result.error).toBeDefined();
  });

  test('returns error for completely invalid input', () => {
    const result = decodeJWT('invalid');
    expect(result.error).toBeDefined();
  });
});
