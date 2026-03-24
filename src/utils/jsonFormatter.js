export function formatJSON(input, indent = 2) {
  try {
    if (!input.trim()) {
      return '';
    }
    const parsed = JSON.parse(input);
    const space = indent === 'tab' ? '\t' : indent;
    return JSON.stringify(parsed, null, space);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export function minifyJSON(input) {
  try {
    if (!input.trim()) {
      return '';
    }
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export function validateJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
