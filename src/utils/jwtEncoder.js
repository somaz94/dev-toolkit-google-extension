/**
 * JWT Encoder with HMAC-SHA256 signing via Web Crypto API
 *
 * Input format in textarea:
 *   Line 1: JSON payload
 *   Line 2 (optional): secret key (default: "secret")
 *
 * Example:
 *   {"sub":"1234567890","name":"John"}
 *   my-secret-key
 */

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function encodeJWT(input) {
  try {
    const lines = input.trim().split('\n');
    const payloadStr = lines[0].trim();
    const secret = lines.length > 1 ? lines[1].trim() : 'secret';

    // Validate JSON
    const payload = JSON.parse(payloadStr);

    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // HMAC-SHA256 signing with Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
    const signature = arrayBufferToBase64Url(signatureBuffer);

    return `${signingInput}.${signature}`;
  } catch (e) {
    return { error: 'Failed to encode JWT: ' + e.message };
  }
}
