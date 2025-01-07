export function validateInput(input, type) {
  if (!input || !input.trim()) {
    return { isValid: false, error: 'Input is empty.' };
  }

  switch (type) {
    case 'json':
      try {
        JSON.parse(input);
        return { isValid: true };
      } catch (e) {
        return { 
          isValid: false, 
          error: 'Invalid JSON format.\n' + e.message 
        };
      }

    case 'base64':
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(input)) {
        return { 
          isValid: false, 
          error: 'Invalid Base64 format.' 
        };
      }
      return { isValid: true };

    case 'jwt':
      if (input.includes('.')) {
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        if (!jwtRegex.test(input)) {
          return { 
            isValid: false, 
            error: 'Invalid JWT format.\nExpected: header.payload.signature' 
          };
        }
      } else {
        try {
          JSON.parse(input);
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            error: 'Invalid JSON format for JWT payload.\n' + e.message
          };
        }
      }
      return { isValid: true };

    case 'url':
      if (input.startsWith('http')) {
        try {
          new URL(input);
          return { isValid: true };
        } catch (e) {
          return { 
            isValid: false, 
            error: 'Invalid URL format.\nExample: https://example.com' 
          };
        }
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}
