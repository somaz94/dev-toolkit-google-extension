import { inspectJWT } from '../utils/jwtDecoder.js';
import { encodeJWT } from '../utils/jwtEncoder.js';

// Both modes take an optional secret on the second line: encode signs with it, decode checks the signature.
export default {
  id: 'jwt',
  modes: { encode: 'modeEncode', decode: 'modeDecode' },
  action: { encode: 'actionEncodeJwt', decode: 'actionDecodeJwt' },
  placeholder: { encode: 'placeholderJwtEncode', decode: 'placeholderJwtDecode' },
  validate: (mode) => (mode === 'encode' ? 'jwtPayload' : 'jwt'),
  run: (input, { mode }) => (mode === 'encode' ? encodeJWT(input) : inspectJWT(input)),
};
