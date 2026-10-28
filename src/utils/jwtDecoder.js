import { t } from '../i18n.js';

export function decodeJWT(token) {
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    const header = JSON.parse(base64UrlDecode(headerB64));
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    return {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature,
    };
  } catch {
    return { error: t('jwtInvalid') };
  }
}

// atob yields one char per byte; the percent round trip turns UTF-8 bytes back into text.
function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  return decodeURIComponent(atob(padded).split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join(''));
}
