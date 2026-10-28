# CLAUDE.md

<br/>

## Project

- Chrome extension (Manifest V3): a popup of developer converters (JSON, Base64, JWT, URL, timestamp, hash, UUID, color, diff)
- Plain ES modules, no bundler, no runtime dependencies; npm is for Jest and ESLint only
- Architecture and the tool contract: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)

<br/>

## Invariants

- **Zero permissions and no network requests.** `tests/manifest.test.js` enforces the empty `permissions`
- **A tool is one util in `src/utils/`, one module in `src/tools/` plus its registry entry, and one tab in `popup.html`.** The popup never branches on a tool id; `tests/tools.contract.test.js` checks the tabs match the registry
- **Logic lives in `src/lib/`, `src/tools/` or `src/utils/`.** `src/popup/` is DOM glue, outside the 90% coverage gate and covered by `make e2e` instead
- **Every user-visible string is a `_locales` key**, reached through `t()`, `data-i18n` or a tool's `action` / `placeholder` / `modes`; `tests/locales.test.js` enforces key and placeholder parity and that every key is used

<br/>

## Commands

`make help` lists every target. Before committing: `make lint` and `make test-cover` (the coverage threshold lives in `jest.config.js`). After touching `manifest.json` or `src/popup/`, also `make e2e`, which drives the real popup in Chrome for Testing; then `make store-screenshots` redraws the store images in `store/`.
