/**
 * Color Converter: HEX <-> RGB <-> HSL
 * Auto-detects input format and converts to all formats
 */

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  };
}

function parseInput(input) {
  const trimmed = input.trim();

  // HEX: #fff, #ffffff, fff, ffffff
  const hexMatch = trimmed.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
  if (hexMatch) {
    const rgb = hexToRgb(hexMatch[1]);
    if (rgb) return { type: 'hex', ...rgb };
  }

  // RGB: rgb(255, 0, 0) or 255, 0, 0 or 255 0 0
  const rgbMatch = trimmed.match(/^(?:rgb\s*\(\s*)?(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)?$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      return { type: 'rgb', r, g, b };
    }
  }

  // HSL: hsl(360, 100%, 50%) or 360, 100, 50
  const hslMatch = trimmed.match(/^(?:hsl\s*\(\s*)?(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?\s*\)?$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    if (h <= 360 && s <= 100 && l <= 100) {
      return { type: 'hsl', h, s, l };
    }
  }

  return null;
}

export function convertColor(input) {
  const parsed = parseInput(input);

  if (!parsed) {
    throw new Error('Invalid color format.\nSupported: #ff0000, rgb(255,0,0), hsl(0,100,50)');
  }

  let r, g, b, h, s, l, hex;

  if (parsed.type === 'hsl') {
    ({ h, s, l } = parsed);
    ({ r, g, b } = hslToRgb(h, s, l));
    hex = rgbToHex(r, g, b);
  } else {
    ({ r, g, b } = parsed);
    hex = rgbToHex(r, g, b);
    ({ h, s, l } = rgbToHsl(r, g, b));
  }

  return [
    `HEX: ${hex}`,
    `RGB: rgb(${r}, ${g}, ${b})`,
    `HSL: hsl(${h}, ${s}%, ${l}%)`,
    '',
    `R: ${r}  G: ${g}  B: ${b}`,
    `H: ${h}° S: ${s}% L: ${l}%`,
  ].join('\n');
}
