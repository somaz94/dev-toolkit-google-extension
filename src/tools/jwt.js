import { decodeJWT } from '../utils/jwtDecoder.js';
import { encodeJWT } from '../utils/jwtEncoder.js';

export default {
  id: 'jwt',
  modes: { encode: 'modeEncode', decode: 'modeDecode' },
  action: { encode: 'actionEncodeJwt', decode: 'actionDecodeJwt' },
  placeholder: 'inputPlaceholder',
  validate: (mode) => (mode === 'encode' ? 'jwtPayload' : 'jwt'),
  async run(input, { mode }) {
    if (mode === 'encode') return encodeJWT(input);
    const decoded = decodeJWT(input);
    if (decoded.error) return decoded;
    return `Header:\n${decoded.header}\n\nPayload:\n${decoded.payload}\n\nSignature:\n${decoded.signature}`;
  },
};
