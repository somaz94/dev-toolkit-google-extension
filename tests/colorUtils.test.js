import { describe, test, expect } from '@jest/globals';
import { convertColor } from '../src/utils/colorUtils.js';

describe('convertColor', () => {
  test('converts HEX to all formats', () => {
    const result = convertColor('#ff0000');
    expect(result).toContain('HEX: #ff0000');
    expect(result).toContain('RGB: rgb(255, 0, 0)');
    expect(result).toContain('HSL: hsl(0, 100%, 50%)');
  });

  test('converts short HEX', () => {
    const result = convertColor('#fff');
    expect(result).toContain('RGB: rgb(255, 255, 255)');
  });

  test('converts RGB format', () => {
    const result = convertColor('rgb(0, 128, 255)');
    expect(result).toContain('HEX:');
    expect(result).toContain('HSL:');
  });

  test('converts comma-separated RGB', () => {
    const result = convertColor('255, 0, 0');
    expect(result).toContain('HEX: #ff0000');
  });

  test('converts HSL format', () => {
    const result = convertColor('hsl(0, 100, 50)');
    expect(result).toContain('HEX: #ff0000');
    expect(result).toContain('RGB: rgb(255, 0, 0)');
  });

  test('converts grayscale HSL (saturation 0)', () => {
    const result = convertColor('hsl(0, 0, 50)');
    expect(result).toContain('RGB: rgb(128, 128, 128)');
  });

  test('converts green color', () => {
    const result = convertColor('#00ff00');
    expect(result).toContain('RGB: rgb(0, 255, 0)');
  });

  test('converts blue color', () => {
    const result = convertColor('rgb(0, 0, 255)');
    expect(result).toContain('HEX: #0000ff');
  });

  test('converts black', () => {
    const result = convertColor('#000000');
    expect(result).toContain('HSL: hsl(0, 0%, 0%)');
  });

  test('throws on invalid input', () => {
    expect(() => convertColor('not a color')).toThrow('Invalid color format');
  });

  test('handles edge case HSL values', () => {
    // 300 as hue is valid in HSL (0-360)
    const result = convertColor('hsl(300, 50, 50)');
    expect(result).toContain('HEX:');
  });
});
