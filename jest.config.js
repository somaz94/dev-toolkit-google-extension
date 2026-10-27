export default {
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup/chrome-i18n.cjs'],
  collectCoverageFrom: [
    'src/utils/**/*.js',
    '!src/popup/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
};
