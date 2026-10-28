/**
 * Line diff of two texts separated by a delimiter line, aligned with Myers' algorithm.
 */

import { t } from '../i18n.js';

const SEPARATORS = ['---', '==='];

// The backtracking trace grows with the square of the edit distance, so beyond this many edits the
// differing middle is shown as one removed block and one added block instead.
export const MAX_EDITS = 2000;

/** The shortest edit script from `a` to `b` as `[op, line]` pairs, op `' '`, `'-'` or `'+'`; null past `limit` edits. */
function shortestEdit(a, b, limit) {
  const n = a.length;
  const m = b.length;
  const offset = n + m + 1;
  const v = new Int32Array(2 * offset + 1);
  // trace[d] holds v for k in [-d, d] before step d, at index k + d.
  const trace = [];
  for (let d = 0; d <= Math.min(n + m, limit); d += 1) {
    trace.push(v.slice(offset - d, offset + d + 1));
    for (let k = -d; k <= d; k += 2) {
      const down = k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1]);
      let x = down ? v[offset + k + 1] : v[offset + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x += 1;
        y += 1;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) return backtrack(trace, a, b);
    }
  }
  return null;
}

function backtrack(trace, a, b) {
  const script = [];
  let x = a.length;
  let y = b.length;
  for (let d = trace.length - 1; d >= 0; d -= 1) {
    let prevX = 0;
    let prevY = 0;
    let down = false;
    if (d > 0) {
      const at = (k) => trace[d][k + d];
      const k = x - y;
      down = k === -d || (k !== d && at(k - 1) < at(k + 1));
      const prevK = down ? k + 1 : k - 1;
      prevX = at(prevK);
      prevY = prevX - prevK;
    }
    while (x > prevX && y > prevY) {
      script.push([' ', a[x - 1]]);
      x -= 1;
      y -= 1;
    }
    if (d > 0) {
      script.push(down ? ['+', b[y - 1]] : ['-', a[x - 1]]);
      x = prevX;
      y = prevY;
    }
  }
  return script.reverse();
}

/** `[op, line]` pairs turning `a` into `b`; common lines are aligned, not just compared by position. */
export function diffLines(a, b, limit = MAX_EDITS) {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start += 1;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }
  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);
  const middle = shortestEdit(midA, midB, limit) ?? [...midA.map((line) => ['-', line]), ...midB.map((line) => ['+', line])];
  const same = (lines) => lines.map((line) => [' ', line]);
  return [...same(a.slice(0, start)), ...middle, ...same(a.slice(endA))];
}

function split(input) {
  for (const separator of SEPARATORS) {
    const marker = `\n${separator}\n`;
    const index = input.indexOf(marker);
    if (index !== -1) return [input.substring(0, index), input.substring(index + marker.length)];
  }
  throw new Error(t('diffNoSeparator'));
}

export function computeDiff(input) {
  const [before, after] = split(input);
  const script = diffLines(before.split(/\r?\n/), after.split(/\r?\n/));
  const count = (op) => String(script.filter(([kind]) => kind === op).length);
  const summary = t('diffSummary', [count('+'), count('-'), count(' ')]);
  return `${summary}\n${'─'.repeat(50)}\n${script.map(([op, line]) => `${op} ${line}`).join('\n')}`;
}
