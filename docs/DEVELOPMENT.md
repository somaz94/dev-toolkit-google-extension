# Development

<br/>

## Prerequisites

- Google Chrome
- Node.js and npm, for the tests, the linter and the store images only; the extension itself has no build step and no runtime dependencies. `make e2e` and `make store-screenshots` need Node 22 or later

<br/>

## Local development

```bash
make install     # dev dependencies (Jest, ESLint)
make test-cover  # unit tests; fails below the coverage threshold in jest.config.js
make e2e         # the real popup in Chrome for Testing
make lint
make help        # every target
```

Load the repository directory as an unpacked extension (`chrome://extensions/`, Developer mode, **Load unpacked**). After a change, click the reload button on the extension card and open the popup again. Right-click the popup and pick **Inspect** for its DevTools.

<br/>

## Architecture

Plain ES modules, loaded straight from `src/` with no bundler. Each directory has one role:

| Directory | Role |
|---|---|
| `src/utils/` | The conversions themselves: one module per tool plus the input validator. Pure functions with no DOM |
| `src/tools/` | One module per popup tab, describing the tool to the popup (labels, modes, validation, which util to run), plus the registry in `index.js` |
| `src/lib/` | What the popup does around a tool, without touching the page: running a tool and turning the result into output or an error, input history, the theme, keyboard shortcuts |
| `src/i18n.js` | `t()` and the helper that fills `data-i18n` attributes, over Chrome's `_locales` |
| `src/theme-early.js` | A classic script in the popup's `<head>` that paints the stored theme before the modules load; `src/lib/theme.js` is its tested copy |
| `src/popup/` | The popup page, also opened in a tab as `popup.html?page` with a wide layout; DOM glue over `src/lib` and `src/tools` |

`src/popup/` is the only code outside the coverage gate, so logic belongs in `src/lib/`, `src/tools/` or `src/utils/`, where it is tested. The popup itself is covered by the end-to-end test.

<br/>

## End-to-end test

`make e2e` (`tests/e2e/run.mjs`) loads the extension into Chrome for Testing and drives the popup over the DevTools protocol: every tool on a sample input, the option panels and modes, the input history, the keyboard shortcuts, the theme, the Korean UI, and no uncaught or console errors. It checks what unit tests cannot: that Chrome accepts the manifest and that the DOM glue in `src/popup/` is wired correctly. CI runs it on every push.

`hack/chrome.mjs` starts Chrome and talks to it with Node's built-in `WebSocket`, so the test adds no dependency; `make store-screenshots` uses it too. Branded Chrome ignores `--load-extension`, so it downloads Chrome for Testing into `~/.cache/dev-toolkit-chrome` on the first run; set `DEV_TOOLKIT_CHROME` to use a Chromium you already have.

After a change to `popup.html` or `popup.js`, run `make e2e` and add a check for the new behavior.

<br/>

## Adding a tool

1. Write the conversion in `src/utils/<name>Utils.js`. Throw an `Error` with a `t()` message for bad input; `runTool` shows it as an error
2. Create `src/tools/<name>.js` exporting one object:

   | Key | Required | Purpose |
   |---|---|---|
   | `id` | yes | Matches the tab's `data-tab` in `popup.html` |
   | `action` | yes | Message key of the run button, or one per mode: `{ encode, decode }` |
   | `placeholder` | yes | Message key of the input placeholder, or one per mode |
   | `run(input, { mode, options })` | yes | Returns the output, or a promise of it; may return `{ error }` instead of throwing |
   | `modes` | no | `{ encode, decode }` message keys for the two mode buttons; without it the buttons are hidden |
   | `validate(mode)` | no | The `validateInput` type to check before running, or `null` |
   | `allowEmpty` | no | Runs on an empty input (UUID generates one) |

   A tool that takes options gets a `.tool-options` panel with `data-tool="<id>"` in `popup.html`; each input in it with `data-option="<name>"` reaches `run` as `options.<name>` (a checkbox as a boolean, anything else as its value).

3. Add it to `TOOLS` in `src/tools/index.js` and a tab button to `src/popup/popup.html`, in the same position. The order is the `Alt+1` to `Alt+9` order, so there is room for nine tools
4. Add its message keys to every `_locales/<language>/messages.json`
5. Add `tests/<name>Utils.test.js`, and a case to `tests/run.test.js` when the tool has modes or validation. `tests/tools.contract.test.js` already checks every registered tool: its tab, its message keys and one label per mode
6. Update the README features, [Features](FEATURES.md), the store description in [DESCRIPTION.md](DESCRIPTION.md) and `store/listing-ko.txt`

<br/>

## Translations

The popup follows the browser language through Chrome's `_locales`: English is the default, Korean is in `_locales/ko/`.

- A string is a key in `_locales/en/messages.json` and in every other `_locales/<language>/messages.json`, written as `{ "message": "..." }`. Positional values are `$1` to `$9`
- In HTML, set `data-i18n="key"` for text or `data-i18n-placeholder` / `data-i18n-title` / `data-i18n-aria-label` for attributes; in JavaScript, call `t('key')` or `t('key', [value])` from `src/i18n.js`; in a tool module, name the key in `action`, `placeholder` or `modes`
- `tests/locales.test.js` fails when a language misses a key, a placeholder differs, a key the code or a tool names does not exist, or a key is no longer used
- In Jest, `tests/setup/chrome-i18n.cjs` serves the English catalog as `chrome.i18n`, so tests assert the English text
- `tests/manifest.test.js` checks that the store summary (`extDescription`) fits the store's 132 characters in every language, and that both `make package` and the release workflow ship `_locales/`

<br/>

## Publishing to the Chrome Web Store

```bash
make bump-version VERSION=1.3.0
make package     # writes dist/dev-toolkit.zip
```

Upload the ZIP in the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). The listing text, the graphic assets, the Privacy tab answers and the reviewer test instructions are in [DESCRIPTION.md](DESCRIPTION.md); link [Privacy](PRIVACY.md) as the privacy policy. A tag push (`v*.*.*`) also builds the ZIP and attaches it to the GitHub release.

`make store-screenshots` redraws `store/screenshots/` in English and Korean and the shared `store/promo-small.png`, in the same Chrome for Testing as the end-to-end test.

<br/>

## Conventions

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), in English
- Code comments in English, only where the reason is not obvious from the code
- No runtime dependencies and no permissions; anything that would need one is out of scope
