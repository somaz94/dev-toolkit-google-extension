import { convertColor } from '../utils/colorUtils.js';

export default {
  id: 'color',
  action: 'actionConvertColor',
  placeholder: 'placeholderColor',
  run: (input) => convertColor(input),
};
