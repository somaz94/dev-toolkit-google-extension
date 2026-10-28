import { t } from '../i18n.js';

export function encodeBase64(input) {
  try {
    return btoa(input);
  } catch {
    return t('base64EncodeInvalid');
  }
}

export function decodeBase64(input) {
  try {
    return atob(input);
  } catch {
    return t('base64DecodeInvalid');
  }
}
