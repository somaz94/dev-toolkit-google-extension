import { decodeURL, encodeURL } from '../utils/urlUtils.js';

export default {
  id: 'url',
  modes: { encode: 'modeEncode', decode: 'modeDecode' },
  action: { encode: 'actionEncodeUrl', decode: 'actionDecodeUrl' },
  placeholder: 'inputPlaceholder',
  validate: (mode) => (mode === 'encode' ? 'url' : null),
  run: (input, { mode }) => (mode === 'encode' ? encodeURL(input) : decodeURL(input)),
};
