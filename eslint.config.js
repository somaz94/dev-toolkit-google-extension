import js from '@eslint/js';

const browser = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  URL: 'readonly',
  TextEncoder: 'readonly',
  TextDecoder: 'readonly',
  atob: 'readonly',
  btoa: 'readonly',
  crypto: 'readonly',
  chrome: 'readonly',
  localStorage: 'readonly',
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
    files: ['tests/setup/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { require: 'readonly', __dirname: 'readonly', globalThis: 'readonly' } },
  },
];
