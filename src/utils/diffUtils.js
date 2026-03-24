/**
 * Simple line-by-line text diff
 * Compares two texts separated by a delimiter
 */

export function computeDiff(input) {
  // Split input by delimiter: --- or ===
  const separators = ['---', '==='];
  let parts = null;

  for (const sep of separators) {
    if (input.includes('\n' + sep + '\n')) {
      const idx = input.indexOf('\n' + sep + '\n');
      parts = [
        input.substring(0, idx),
        input.substring(idx + sep.length + 2)
      ];
      break;
    }
  }

  if (!parts) {
    throw new Error(
      'Separate two texts with --- or === on its own line.\n\n' +
      'Example:\n' +
      'first text here\n' +
      '---\n' +
      'second text here'
    );
  }

  const linesA = parts[0].split('\n');
  const linesB = parts[1].split('\n');
  const maxLen = Math.max(linesA.length, linesB.length);

  const result = [];
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (let i = 0; i < maxLen; i++) {
    const lineA = i < linesA.length ? linesA[i] : undefined;
    const lineB = i < linesB.length ? linesB[i] : undefined;

    if (lineA === lineB) {
      result.push(`  ${lineA}`);
      unchanged++;
    } else {
      if (lineA !== undefined) {
        result.push(`- ${lineA}`);
        removed++;
      }
      if (lineB !== undefined) {
        result.push(`+ ${lineB}`);
        added++;
      }
    }
  }

  const summary = `[Summary] +${added} added, -${removed} removed, ${unchanged} unchanged`;

  return summary + '\n' + '─'.repeat(50) + '\n' + result.join('\n');
}
