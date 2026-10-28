import { formatJSON } from '../utils/jsonFormatter.js';

export default {
  id: 'json',
  action: 'actionFormatJson',
  placeholder: 'inputPlaceholder',
  indentOptions: true,
  validate: () => 'json',
  run: (input, { indent }) => formatJSON(input, indent),
};
