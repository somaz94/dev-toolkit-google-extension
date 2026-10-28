import { t } from '../i18n.js';

// Spreading a whole large array into fromCharCode overflows the call stack.
const CHUNK = 0x8000;

function bytesToBinary(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return binary;
}

export function bytesToBase64(bytes, { urlSafe = false } = {}) {
  const base64 = btoa(bytesToBinary(bytes));
  return urlSafe ? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : base64;
}

/** Bytes of standard or URL-safe Base64, with or without padding and line breaks; throws when it is not Base64. */
export function base64ToBytes(text) {
  const base64 = text.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  let binary;
  try {
    binary = atob(padded);
  } catch {
    throw new Error(t('base64DecodeInvalid'));
  }
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** Base64 of the UTF-8 bytes of `input`, so any text encodes. */
export function encodeBase64(input, options) {
  return bytesToBase64(new TextEncoder().encode(input), options);
}

/** The UTF-8 text in `input`; bytes that are not UTF-8 come back one character per byte. */
export function decodeBase64(input) {
  const bytes = base64ToBytes(input);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return bytesToBinary(bytes);
  }
}
