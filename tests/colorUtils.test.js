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

  test('throws on invalid input', () => {
    expect(() => convertColor('not a color')).toThrow('Invalid color format');
  });
});
