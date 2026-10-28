/**
 * What a key press asks the popup to do: `{ action: 'run' }`, `{ action: 'copy' }`,
 * `{ action: 'tab', index }`, or `null` when it is not a shortcut.
 */
export function shortcutFor(event, tabCount) {
  const command = event.ctrlKey || event.metaKey;
  if (command && event.key === 'Enter') return { action: 'run' };
  if (command && event.shiftKey && event.key === 'C') return { action: 'copy' };
  if (event.altKey && event.key >= '1' && event.key <= '9') {
    const index = Number(event.key) - 1;
    return index < tabCount ? { action: 'tab', index } : null;
  }
  return null;
}
