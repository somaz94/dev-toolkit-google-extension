# CLAUDE.md

<br/>

## Commit Guidelines

- Do not include `Co-Authored-By` lines in commit messages.
- Do not push to remote. Only commit. The user will push manually.

<br/>

## Project Structure

- Chrome Extension (Manifest V3) for developer utilities
- Zero external dependencies — native browser APIs only
- Zero permissions required
- ES6 modules without bundler

<br/>

## Key Directories

- `src/popup/` — UI (popup.html, popup.js, popup.css)
- `src/utils/` — Utility modules (jsonFormatter, base64Utils, jwtDecoder, jwtEncoder, urlUtils, timestampUtils, hashUtils, uuidUtils, colorUtils, diffUtils, validator)
- `tests/` — Unit tests (Jest)
- `hack/` — Scripts (bump-version.sh)
- `icons/` — Extension icons (16, 48, 128px)
- `.github/workflows/` — CI/CD workflows

<br/>

## Features

- JSON Formatter & Validator (indent selection, minify)
- Base64 Encoder/Decoder
- JWT Token Encoder/Decoder (HMAC-SHA256 signing)
- URL Encoder/Decoder
- Timestamp Converter (Unix timestamp <-> date)
- Hash Generator (SHA-1, SHA-256, SHA-384, SHA-512)
- UUID Generator (v4, batch up to 100)
- Color Converter (HEX, RGB, HSL)
- Diff Viewer (line-by-line comparison)
- Dark mode with localStorage persistence
- Keyboard shortcuts (Ctrl+Enter, Alt+1-9)
- Input history (localStorage, last 5 per tab)

<br/>

## Commands

- `make test` — Run unit tests
- `make test-cover` — Run tests with coverage
- `make lint` — ESLint
- `make package` — ZIP for Chrome Web Store
- `make bump-version VERSION=x.x.x` — Update version
