import { describe, test, expect } from '@jest/globals';
import { generateHash } from '../src/utils/hashUtils.js';

describe('generateHash', () => {
  test('generates all hash types', async () => {
    const result = await generateHash('Hello World!');
    expect(result).toContain('SHA-1:');
    expect(result).toContain('SHA-256:');
    expect(result).toContain('SHA-384:');
    expect(result).toContain('SHA-512:');
  });

  test('SHA-256 of known input', async () => {
    const result = await generateHash('hello');
    expect(result).toContain('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  test('generates consistent output', async () => {
    const result1 = await generateHash('test');
    const result2 = await generateHash('test');
    expect(result1).toBe(result2);
  });

  test('different input gives different hash', async () => {
    const result1 = await generateHash('abc');
    const result2 = await generateHash('def');
    expect(result1).not.toBe(result2);
  });
});
