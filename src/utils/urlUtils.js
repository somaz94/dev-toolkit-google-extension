import { t } from '../i18n.js';

export function encodeURL(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return t('urlEncodeInvalid');
  }
}

export function decodeURL(input) {
  try {
    return decodeURIComponent(input);
  } catch (e) {
    return t('urlDecodeInvalid');
  }
}