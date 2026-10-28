import { t } from '../i18n.js';

export function validateInput(input, type) {
  if (!input || !input.trim()) {
    return { isValid: false, error: t('errorEmpty') };
  }

  switch (type) {
    case 'json':
      try {
        JSON.parse(input);
        return { isValid: true };
      } catch (e) {
        return {
          isValid: false,
          error: t('validateJson', e.message)
        };
      }

    case 'base64':
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
        return {
          isValid: false,
          error: t('validateBase64')
        };
      }
      return { isValid: true };

    case 'jwt':
      if (input.includes('.')) {
        if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(input)) {
          return {
            isValid: false,
            error: t('validateJwt')
          };
        }
      } else {
        try {
          JSON.parse(input);
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            error: t('validateJwtPayload', e.message)
          };
        }
      }
      return { isValid: true };

    case 'url':
      if (input.startsWith('http')) {
        try {
          new URL(input);
          return { isValid: true };
        } catch {
          return {
            isValid: false,
            error: t('validateUrl')
          };
        }
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}
