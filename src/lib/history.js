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
