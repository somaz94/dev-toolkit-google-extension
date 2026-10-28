/**
 * JWT Encoder with HMAC-SHA256 signing via Web Crypto API
 *
 * Input format in textarea:
 *   Line 1: JSON payload
 *   Line 2 (optional): secret key (default: "secret")
 */

import { t } from '../i18n.js';
import { bytesToBase64, encodeBase64 } from './base64Utils.js';

const HEADER = { alg: 'HS256', typ: 'JWT' };

/** The URL-safe Base64 HMAC-SHA256 signature of `signingInput` under `secret`. */
export async function signHS256(signingInput, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  return bytesToBase64(new Uint8Array(signature), { urlSafe: true });
}

export async function encodeJWT(input) {
  try {
    const lines = input.trim().split('\n');
    const payload = JSON.parse(lines[0].trim());
    const secret = lines.length > 1 ? lines[1].trim() : 'secret';
    const signingInput = [HEADER, payload].map((part) => encodeBase64(JSON.stringify(part), { urlSafe: true })).join('.');
    return `${signingInput}.${await signHS256(signingInput, secret)}`;
  } catch (e) {
    return { error: t('jwtEncodeFailed', e.message) };
  }
}
