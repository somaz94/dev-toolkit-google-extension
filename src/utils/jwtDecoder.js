import { t } from '../i18n.js';
import { decodeBase64 } from './base64Utils.js';

export function decodeJWT(token) {
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    const header = JSON.parse(decodeBase64(headerB64));
    const payload = JSON.parse(decodeBase64(payloadB64));
    return {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature,
    };
  } catch {
    return { error: t('jwtInvalid') };
  }
}
