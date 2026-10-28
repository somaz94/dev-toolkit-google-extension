# Chrome Web Store Listing

The text pasted into the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) for Dev Toolkit. The item name and summary come from `name` and the `_locales` description, so they are not repeated here.

<br/>

## Store listing

### Description

```text
Dev Toolkit puts the small converters developers reach for every day in one popup, and runs every one of them offline in your browser.

Tools
- JSON: format with 2 spaces, 4 spaces or tabs, minify, and see where invalid JSON breaks
- Base64: encode and decode any text as UTF-8, standard or URL-safe
- JWT: decode a token into its header, payload and signature, or sign a payload with HMAC-SHA256
- URL: percent-encode and decode
- Timestamp: Unix seconds or milliseconds to UTC and local time, and any date, or "now", back to a timestamp
- Hash: SHA-1, SHA-256, SHA-384 and SHA-512 at once
- UUID: one v4 UUID, or up to 100 at once
- Color: HEX, RGB or HSL in, all three out
- Diff: two texts compared line by line, with a summary

Made for quick work
- Ctrl+Enter runs, Ctrl+Shift+C copies the result, Alt+1 to Alt+9 switch tools
- The last five inputs of each tool come back when you return to it
- A light and a dark theme
- English and Korean, following the browser language

Privacy
- No permissions, no network requests, no analytics, no server
- Only your recent inputs and theme are kept, in the popup's local storage on this browser
- Open source: https://github.com/somaz94/dev-toolkit-google-extension
```

### Category

Developer Tools

### Language

English is the default listing. The Korean listing uses [`store/listing-ko.txt`](../store/listing-ko.txt) as its description; that text is kept outside `docs/` because it is translated product copy, like `_locales/ko`, not documentation. Keep it in step with the English description above.

### Graphic assets

Upload `store/screenshots/en/` to the default listing and `store/screenshots/ko/` as the Korean localized screenshots, in file order, and `store/promo/small-<language>.png` as the small promo tile of each. `make store-screenshots` redraws all of them from the extension itself (the inputs and the slide copy are in `hack/store-screenshots.mjs` and `hack/store-slide.html`); run it after a change to the popup.

### Additional fields

| Field | Value |
|---|---|
| Homepage URL | `https://github.com/somaz94/dev-toolkit-google-extension` |
| Support URL | `https://github.com/somaz94/dev-toolkit-google-extension/issues` |
| Mature content | No |

<br/>

## Privacy practices

### Single purpose

```text
Convert, encode, decode and format developer data (JSON, Base64, JWT, URL, timestamps, hashes, UUIDs, colors and text diffs) that the user types into the popup.
```

### Permission justification

None; the extension requests no permissions and no host access.

### Remote code

No. Every script ships in the package.

### Data usage

Check none of the data types, then certify all three statements (not sold to third parties, not used for purposes unrelated to the single purpose, not used for creditworthiness or lending).

### Privacy policy URL

`https://github.com/somaz94/dev-toolkit-google-extension/blob/main/docs/PRIVACY.md`

<br/>

## Test instructions

```text
No account or setup is needed. Open the popup, paste {"a":1} into the JSON tab and press Format JSON; the other tabs work the same way.
```
