import { dateToTimestamp, timestampToDate } from '../utils/timestampUtils.js';

// Encode turns a date into a timestamp, decode a timestamp into a date.
export default {
  id: 'timestamp',
  modes: { encode: 'modeToTimestamp', decode: 'modeToDate' },
  action: { encode: 'actionDateToTimestamp', decode: 'actionTimestampToDate' },
  placeholder: { encode: 'placeholderDate', decode: 'placeholderTimestamp' },
  run: (input, { mode }) => (mode === 'encode' ? dateToTimestamp(input) : timestampToDate(input)),
};
