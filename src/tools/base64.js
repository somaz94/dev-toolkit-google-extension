import { decodeBase64, encodeBase64 } from '../utils/base64Utils.js';

export default {
  id: 'base64',
  modes: { encode: 'modeEncode', decode: 'modeDecode' },
  action: { encode: 'actionEncodeBase64', decode: 'actionDecodeBase64' },
  placeholder: 'inputPlaceholder',
  validate: (mode) => (mode === 'decode' ? 'base64' : null),
  run: (input, { mode }) => (mode === 'encode' ? encodeBase64(input) : decodeBase64(input)),
};
