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
- `src/utils/` — Utility modules (jsonFormatter, base64Utils, jwtDecoder, jwtEncoder, urlUtils, validator)
- `icons/` — Extension icons (16, 48, 128px)
- `.github/workflows/` — CI/CD workflows

<br/>

## Features

- JSON Formatter & Validator
- Base64 Encoder/Decoder
- JWT Token Encoder/Decoder
- URL Encoder/Decoder
- Dark mode with localStorage persistence

<br/>

## Tech Stack

- JavaScript (ES6 Modules)
- HTML5 / CSS3 (CSS custom properties for theming)
- Chrome Extension Manifest V3
- Web Crypto API, Clipboard API, localStorage
