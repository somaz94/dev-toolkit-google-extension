import { formatJSON } from '../utils/jsonFormatter.js';

export default {
  id: 'json',
  action: 'actionFormatJson',
  placeholder: 'inputPlaceholder',
  validate: () => 'json',
  run: (input, { options }) => formatJSON(input, options.indent === 'tab' ? 'tab' : Number(options.indent ?? 2)),
};
