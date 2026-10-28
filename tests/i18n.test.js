import { describe, test, expect } from '@jest/globals';
import { applyTranslations, t } from '../src/i18n.js';

function fakeElement(attributes = {}, dataset = {}) {
  return {
    attributes: { ...attributes },
    dataset,
    textContent: '',
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; },
  };
}

describe('i18n', () => {
  test('t substitutes values and falls back to the key', () => {
    expect(t('errorLine', 'boom')).toBe('❌ Error: boom');
    expect(t('noSuchKey')).toBe('noSuchKey');
  });

  test('applyTranslations fills text, attributes and the page language', () => {
    const text = fakeElement({}, { i18n: 'copy' });
    const field = fakeElement({ 'data-i18n-placeholder': 'outputPlaceholder' });
    const root = {
      querySelectorAll: (selector) => ({ '[data-i18n]': [text], '[data-i18n-placeholder]': [field] })[selector] ?? [],
    };
    globalThis.document = { documentElement: {} };
    try {
      applyTranslations(root);
      expect(text.textContent).toBe('Copy');
      expect(field.attributes.placeholder).toBe(t('outputPlaceholder'));
      expect(globalThis.document.documentElement.lang).toBe(t('htmlLang'));
    } finally {
      delete globalThis.document;
    }
  });
});
