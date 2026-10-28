import { describe, test, expect } from '@jest/globals';
import { decodeJWT, describeTimes, inspectJWT, relativeTime } from '../src/utils/jwtDecoder.js';
import { encodeJWT } from '../src/utils/jwtEncoder.js';

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

// jwt.io's example token is signed with this secret.
const SECRET = 'your-256-bit-secret';
const NOW = Date.UTC(2026, 9, 28, 12, 0, 0);
const seconds = (ms) => Math.floor(ms / 1000);

describe('relativeTime', () => {
  test('picks the largest whole unit', () => {
    expect(relativeTime(2 * 3600)).toBe('in 2 hours');
    expect(relativeTime(-3 * 86400)).toBe('3 days ago');
    expect(relativeTime(30)).toBe('in 30 seconds');
    expect(relativeTime(0)).toBe('now');
  });
});

describe('describeTimes', () => {
  test('shows each time claim in UTC with its distance', () => {
    expect(describeTimes({ iat: seconds(NOW) - 3600 }, NOW)).toEqual(['iat  2026-10-28 11:00:00 UTC (1 hour ago)']);
  });

  test('flags an expired token and one not valid yet', () => {
    const lines = describeTimes({ nbf: seconds(NOW) + 60, exp: seconds(NOW) - 60 }, NOW);
    expect(lines).toEqual([
      'nbf  2026-10-28 12:01:00 UTC (in 1 minute, not valid yet)',
      'exp  2026-10-28 11:59:00 UTC (1 minute ago, expired)',
    ]);
  });

  test('skips claims that are not times', () => {
    expect(describeTimes({ exp: 'soon', iat: 1e20, sub: 1 }, NOW)).toEqual([]);
    expect(describeTimes(null, NOW)).toEqual([]);
  });
});

describe('inspectJWT', () => {
  test('lists the sections and asks for a secret to check the signature', async () => {
    const output = await inspectJWT(VALID_JWT, NOW);
    expect(output).toMatch(/^Header:\n[\s\S]*\n\nPayload:\n[\s\S]*\n\nTimes:\niat {2}2018-01-18 01:30:22 UTC \(\d+ years ago\)\n\nSignature:\n/);
    expect(output.endsWith('Not checked: put the secret on a second line to check an HS256 signature.')).toBe(true);
  });

  test('checks the signature against the secret on the second line', async () => {
    expect(await inspectJWT(`${VALID_JWT}\n${SECRET}`, NOW)).toContain('✓ Valid HS256 signature');
    expect(await inspectJWT(`${VALID_JWT}\nwrong`, NOW)).toContain('✗ Does not match this secret');
  });

  test('round-trips a token it signed', async () => {
    const token = await encodeJWT(`{"exp":${seconds(NOW) + 7200}}\nk`);
    const output = await inspectJWT(`${token}\nk`, NOW);
    expect(output).toContain('exp  2026-10-28 14:00:00 UTC (in 2 hours)');
    expect(output).toContain('✓ Valid');
    expect(output).not.toContain('expired');
  });

  test('does not check algorithms other than HS256', async () => {
    const header = btoa('{"alg":"RS256"}').replace(/=+$/, '');
    const token = `${header}.${VALID_JWT.split('.')[1]}.sig`;
    expect(await inspectJWT(`${token}\n${SECRET}`, NOW)).toContain('this token uses RS256');
  });

  test('passes a decode error through', async () => {
    expect(await inspectJWT('abc.def.ghi', NOW)).toEqual({ error: 'Invalid JWT token' });
  });
});
