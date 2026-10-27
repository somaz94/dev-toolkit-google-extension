/**
 * Generate UUID v4 using crypto.randomUUID()
 * Also supports generating multiple UUIDs at once
 */

import { t } from '../i18n.js';

export function generateUUID(input) {
  const trimmed = input.trim();
  let count = 1;

  if (trimmed) {
    count = parseInt(trimmed, 10);
    if (isNaN(count) || count < 1) {
      throw new Error(t('uuidCountInvalid'));
    }
    if (count > 100) {
      throw new Error(t('uuidCountTooLarge'));
    }
  }

  const uuids = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }

  return uuids.join('\n');
}
