export const STATE_KEY = 'popupState';
const MODES = ['encode', 'decode'];

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** The stored popup state with anything unknown dropped: the last tool, the last mode and each tool's options. */
export function normalizeState(raw, toolIds) {
  const state = isRecord(raw) ? raw : {};
  const options = isRecord(state.options) ? state.options : {};
  return {
    tool: toolIds.includes(state.tool) ? state.tool : null,
    mode: MODES.includes(state.mode) ? state.mode : 'encode',
    options: Object.fromEntries(Object.entries(options).filter(([id, values]) => toolIds.includes(id) && isRecord(values))),
  };
}

/** Where the popup keeps its state between openings (localStorage in the popup). */
export function createState(toolIds, storage = globalThis.localStorage) {
  function load() {
    try {
      return normalizeState(JSON.parse(storage.getItem(STATE_KEY)), toolIds);
    } catch {
      return normalizeState(null, toolIds);
    }
  }
  return {
    load,
    save(patch) {
      storage.setItem(STATE_KEY, JSON.stringify({ ...load(), ...patch }));
    },
    saveOptions(tool, values) {
      const current = load();
      storage.setItem(STATE_KEY, JSON.stringify({ ...current, options: { ...current.options, [tool]: values } }));
    },
  };
}
