export default {
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup/chrome-i18n.cjs'],
  collectCoverageFrom: [
    'src/**/*.js',
    // DOM glue; the logic it calls lives in src/lib and src/tools and is tested there.
    '!src/popup/**',
    // A classic script that runs before the modules; the logic it mirrors is src/lib/theme.js.
    '!src/theme-early.js',
  ],
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
};
