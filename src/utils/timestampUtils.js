/**
 * Convert Unix timestamp to human-readable date string
 * Supports seconds (10 digits) and milliseconds (13 digits)
 */
export function timestampToDate(input) {
  const trimmed = input.trim();
  let ts = Number(trimmed);

  if (isNaN(ts)) {
    throw new Error('Invalid timestamp. Enter a numeric value.');
  }

  // Auto-detect: if 13+ digits, treat as milliseconds
  if (trimmed.length >= 13) {
    ts = ts; // already ms
  } else {
    ts = ts * 1000; // convert seconds to ms
  }

  const date = new Date(ts);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp value.');
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

  return `UTC:   ${utcFormatted}\nLocal: ${local}\n\nSeconds:      ${Math.floor(ts / 1000)}\nMilliseconds: ${ts}`;
}

/**
 * Convert date string to Unix timestamp
 * Accepts ISO 8601, common date formats, and "now"
 */
export function dateToTimestamp(input) {
  const trimmed = input.trim();

  if (trimmed.toLowerCase() === 'now') {
    const now = Date.now();
    return `Seconds:      ${Math.floor(now / 1000)}\nMilliseconds: ${now}`;
  }

  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Try: 2026-03-24, 2026-03-24T12:00:00Z, or "now"');
  }

  const ms = date.getTime();
  const sec = Math.floor(ms / 1000);

  return `Seconds:      ${sec}\nMilliseconds: ${ms}`;
}
