import { t } from '../i18n.js';
import { forMode } from '../tools/index.js';
import { validateInput } from '../utils/validator.js';

export const MAX_INPUT_LENGTH = 5 * 1024 * 1024;

/** Why the popup refuses `input` before running `tool`, or `null`. */
export function inputError(tool, input) {
  if (!input.trim() && !tool.allowEmpty) return t('errorEmpty');
  if (input.length > MAX_INPUT_LENGTH) return t('errorTooLarge');
  return null;
}

/** The labels the popup shows for `tool` in `mode`. */
export function labelsFor(tool, mode) {
  return {
    action: t(forMode(tool.action, mode)),
    placeholder: t(forMode(tool.placeholder, mode)),
    modes: tool.modes ? Object.fromEntries(Object.entries(tool.modes).map(([id, key]) => [id, t(key)])) : null,
  };
}

/** Runs `tool` on `input` with the values of its options panel; resolves to `{ output }` or `{ error }`, never rejects. */
export async function runTool(tool, input, { mode, options = {} } = {}) {
  const type = tool.validate?.(mode);
  if (type) {
    const validation = validateInput(input, type);
    if (!validation.isValid) return { error: validation.error };
  }
  try {
    const result = await tool.run(input, { mode, options });
    return result?.error ? { error: result.error } : { output: result };
  } catch (error) {
    return { error: t('errorUnexpected', error.message) };
  }
}
