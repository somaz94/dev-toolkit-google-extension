import { t } from '../i18n.js';

/**
 * Convert Unix timestamp to human-readable date string
 * Supports seconds (10 digits) and milliseconds (13 digits)
 */
export function timestampToDate(input) {
  const trimmed = input.trim();
  let ts = Number(trimmed);

  if (isNaN(ts)) {
    throw new Error(t('timestampNotNumeric'));
  }

  // Auto-detect: if 13+ digits, treat as milliseconds
  if (trimmed.length >= 13) {
    ts = ts; // already ms
  } else {
    ts = ts * 1000; // convert seconds to ms
  }

  const date = new Date(ts);
  if (isNaN(date.getTime())) {
    throw new Error(t('timestampOutOfRange'));
  }

  const utc = date.toISOString();
  const local = date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });

  const utcFormatted = utc.replace('T', ' ').replace('Z', ' UTC');

  return [
    t('resultUtc', utcFormatted),
    t('resultLocal', local),
    '',
    secondsAndMilliseconds(ts),
  ].join('\n');
}

/**
 * Convert date string to Unix timestamp
 * Accepts ISO 8601, common date formats, and "now"
 */
export function dateToTimestamp(input) {
  const trimmed = input.trim();

  if (trimmed.toLowerCase() === 'now') {
    const now = Date.now();
    return secondsAndMilliseconds(now);
  }

  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    throw new Error(t('dateInvalid'));
  }

  return secondsAndMilliseconds(date.getTime());
}

function secondsAndMilliseconds(ms) {
  return [t('resultSeconds', String(Math.floor(ms / 1000))), t('resultMilliseconds', String(ms))].join('\n');
}
