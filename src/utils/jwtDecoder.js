import { t } from '../i18n.js';
import { decodeBase64 } from './base64Utils.js';
import { signHS256 } from './jwtEncoder.js';

const TIME_CLAIMS = ['iat', 'nbf', 'exp'];
const UNITS = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];

export function decodeJWT(token) {
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    const header = JSON.parse(decodeBase64(headerB64));
    const payload = JSON.parse(decodeBase64(payloadB64));
    return {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature,
      claims: { header, payload },
    };
  } catch {
    return { error: t('jwtInvalid') };
  }
}

/** `seconds` from now, as "in 2 hours" or "3 days ago" in the popup's language. */
export function relativeTime(seconds) {
  const [unit, size] = UNITS.find(([, length]) => Math.abs(seconds) >= length) ?? UNITS[UNITS.length - 1];
  return new Intl.RelativeTimeFormat(t('htmlLang'), { numeric: 'auto' }).format(Math.round(seconds / size), unit);
}

/** One line per time claim in `payload`, with its UTC time, how far from `now` it is, and whether it fails. */
export function describeTimes(payload, now = Date.now()) {
  const lines = [];
  for (const claim of TIME_CLAIMS) {
    const value = payload?.[claim];
    const date = new Date(value * 1000);
    if (typeof value !== 'number' || isNaN(date.getTime())) continue;
    const offset = value - now / 1000;
    const notes = [relativeTime(offset)];
    if (claim === 'exp' && offset <= 0) notes.push(t('jwtExpired'));
    if (claim === 'nbf' && offset > 0) notes.push(t('jwtNotYetValid'));
    lines.push(`${claim}  ${date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} (${notes.join(', ')})`);
  }
  return lines;
}

async function signatureNote(token, header, secret) {
  if (!secret) return t('jwtSignatureHint');
  if (header.alg !== 'HS256') return t('jwtSignatureUnsupported', String(header.alg));
  const [headerB64, payloadB64, signature] = token.split('.');
  return (await signHS256(`${headerB64}.${payloadB64}`, secret)) === signature ? t('jwtSignatureValid') : t('jwtSignatureInvalid');
}

/**
 * The decode view of a token on the first line of `input`: header, payload, time claims and signature,
 * checked against the secret on the second line when there is one.
 */
export async function inspectJWT(input, now = Date.now()) {
  const [token, secret] = input.trim().split('\n').map((line) => line.trim());
  const decoded = decodeJWT(token);
  if (decoded.error) return decoded;
  const sections = [`Header:\n${decoded.header}`, `Payload:\n${decoded.payload}`];
  const times = describeTimes(decoded.claims.payload, now);
  if (times.length) sections.push(`Times:\n${times.join('\n')}`);
  sections.push(`Signature:\n${decoded.signature}\n${await signatureNote(token, decoded.claims.header, secret)}`);
  return sections.join('\n\n');
}
