import { describe, test, expect } from '@jest/globals';
import { timestampToDate, dateToTimestamp } from '../src/utils/timestampUtils.js';

describe('timestampToDate', () => {
  test('converts seconds timestamp', () => {
    const result = timestampToDate('1711270800');
    expect(result).toContain('UTC:');
    expect(result).toContain('Local:');
    expect(result).toContain('Seconds:');
    expect(result).toContain('Milliseconds:');
  });

  test('converts milliseconds timestamp (13 digits)', () => {
    const result = timestampToDate('1711270800000');
    expect(result).toContain('UTC:');
    expect(result).toContain('1711270800000');
  });

  test('throws on non-numeric input', () => {
    expect(() => timestampToDate('not-a-number')).toThrow('Invalid timestamp');
  });

  test('handles NaN result from whitespace input', () => {
    // whitespace trims to empty, Number('') = 0, which is a valid timestamp (epoch)
    const result = timestampToDate('   ');
    expect(result).toContain('UTC:');
  });
});

describe('dateToTimestamp', () => {
  test('converts ISO date string', () => {
    const result = dateToTimestamp('2024-03-24T12:00:00Z');
    expect(result).toContain('Seconds:');
    expect(result).toContain('Milliseconds:');
  });

  test('converts simple date string', () => {
    const result = dateToTimestamp('2024-03-24');
    expect(result).toContain('Seconds:');
  });

  test('handles "now" keyword', () => {
    const result = dateToTimestamp('now');
    expect(result).toContain('Seconds:');
    expect(result).toContain('Milliseconds:');
  });

  test('handles "NOW" case-insensitive', () => {
    const result = dateToTimestamp('NOW');
    expect(result).toContain('Seconds:');
  });

  test('throws on invalid date', () => {
    expect(() => dateToTimestamp('not-a-date')).toThrow('Invalid date format');
  });
});
