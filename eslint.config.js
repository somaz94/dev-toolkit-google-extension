import js from '@eslint/js';

const browser = {
  window: 'readonly',
  document: 'readonly',
  location: 'readonly',
  Option: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  TextEncoder: 'readonly',
  TextDecoder: 'readonly',
  atob: 'readonly',
  btoa: 'readonly',
  crypto: 'readonly',
  chrome: 'readonly',
  localStorage: 'readonly',
  matchMedia: 'readonly',
};

export default [
  { ignores: ['coverage/', 'dist/', 'node_modules/'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js', '*.config.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: browser },
    rules: {
      semi: ['warn', 'always'],
      quotes: ['warn', 'single', { allowTemplateLiterals: true }],
    },
  },
  {
    files: ['src/theme-early.js'],
    languageOptions: { sourceType: 'script', globals: { matchMedia: 'readonly' } },
  },
  {
    files: ['hack/**/*.mjs', 'tests/e2e/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly', Buffer: 'readonly', WebSocket: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly' },
    },
    rules: {
      semi: ['warn', 'always'],
      quotes: ['warn', 'single', { allowTemplateLiterals: true }],
    },
  },
  {
    files: ['tests/setup/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { require: 'readonly', __dirname: 'readonly', globalThis: 'readonly' } },
  },
];
