import { computeDiff } from '../utils/diffUtils.js';

export default {
  id: 'diff',
  action: 'actionCompare',
  placeholder: 'placeholderDiff',
  run: (input) => computeDiff(input),
};
