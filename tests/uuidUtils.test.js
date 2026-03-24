import { describe, test, expect } from '@jest/globals';
import { generateUUID } from '../src/utils/uuidUtils.js';

describe('generateUUID', () => {
  test('generates 1 UUID by default', () => {
    const result = generateUUID('');
    const lines = result.trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  test('generates multiple UUIDs', () => {
    const result = generateUUID('5');
    const lines = result.trim().split('\n');
    expect(lines).toHaveLength(5);
  });

  test('throws on invalid count', () => {
    expect(() => generateUUID('abc')).toThrow();
    expect(() => generateUUID('0')).toThrow();
    expect(() => generateUUID('101')).toThrow();
  });
});
