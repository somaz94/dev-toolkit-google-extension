export const MAX_HISTORY = 5;

const keyOf = (tool) => `history_${tool}`;

/** The last inputs per tool, newest first, kept in `storage` (localStorage in the popup). */
export function createHistory(storage = globalThis.localStorage, max = MAX_HISTORY) {
  function load(tool) {
    try {
      const entries = JSON.parse(storage.getItem(keyOf(tool)) ?? '[]');
      return Array.isArray(entries) ? entries : [];
    } catch {
      return [];
    }
  }

  return {
    load,
    save(tool, input) {
      if (!input.trim()) return;
      const entries = [input, ...load(tool).filter((entry) => entry !== input)].slice(0, max);
      storage.setItem(keyOf(tool), JSON.stringify(entries));
    },
    last: (tool) => load(tool)[0] ?? '',
  };
}

/** `entry` on one line, cut to `max` characters, for the history list. */
export function historyLabel(entry, max = 48) {
  const line = entry.replace(/\s+/g, ' ').trim();
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}
