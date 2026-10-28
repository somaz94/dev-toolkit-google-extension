# Dev Toolkit

A Chrome extension with the small converters developers reach for every day, in one popup: JSON, Base64, JWT, URL, timestamps, hashes, UUIDs, colors and a line diff.

Everything runs in the popup itself. It asks for no permissions, makes no network requests and keeps nothing but your recent inputs and settings, on your own browser.

<img src="./store/screenshots/en/1.png" width="640" alt="Dev Toolkit formatting JSON">

<br/>

## Features

- **JSON**: format with 2 spaces, 4 spaces or tabs, minify, and see where invalid JSON breaks
- **Base64**: encode and decode any text as UTF-8, in the standard or the URL-safe alphabet
- **JWT**: decode a token into its header, payload and signature, with `exp`, `iat` and `nbf` as dates and an HS256 signature check, or sign a payload with HMAC-SHA256
- **URL**: percent-encode and decode
- **Timestamp**: Unix seconds or milliseconds to UTC and local time, and any date, or `now`, back to a timestamp
- **Hash**: SHA-1, SHA-256, SHA-384 and SHA-512 at once
- **UUID**: one v4 UUID, or a batch of up to 100
- **Color**: HEX, RGB or HSL in, all three out
- **Diff**: two texts aligned line by line, the way `git diff` does, with a summary
- **Open in a tab** for inputs too big for the popup, with wide, tall fields
- **Chain tools**: **Use as input** moves a result into the input, so a decoded Base64 string goes straight into the JSON formatter
- **Keyboard first**: `Ctrl+Enter` runs, `Ctrl+Shift+C` copies the result, `Alt+1` to `Alt+9` switch tools (`Cmd` on macOS)
- **Picks up where you left off**: the popup reopens on the last tool, mode and options, and keeps the last five inputs per tool, the latest restored and the rest one pick away
- A light and a dark theme that follow the system unless you pick one, and **English and Korean**, following the browser language

See [Features](docs/FEATURES.md) for input formats and examples.

<br/>

## Installation

### From Chrome Web Store
1. Visit [Dev Toolkit](https://chromewebstore.google.com/detail/dev-toolkit/docgjoppdhbahapgbemfadlkgchnmecc)
2. Click **Add to Chrome**

### From Source

```bash
git clone https://github.com/somaz94/dev-toolkit-google-extension.git
```

1. Open `chrome://extensions/`
2. Turn on **Developer mode**
3. Click **Load unpacked** and select the cloned directory

<br/>

## Usage

1. Click the toolbar icon
2. Pick a tool; Encode and Decode, or the direction for timestamps, appear for the tools that have them
3. Paste or type the input and press the action button or `Ctrl+Enter`
4. Copy the result with **Copy** or `Ctrl+Shift+C`

<br/>

## Examples

### JSON
```
{"name":"John","age":30}
→
{
  "name": "John",
  "age": 30
}
```

### JWT encode
The first line is the payload, the optional second line the secret (`secret` when left out).
```
{"sub":"1234567890","name":"John"}
my-secret-key
→
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.fGbwrKYzoMBvZbgTPJRSr4S4lSy7wDU-6rnS4wL865g
```

### Diff
Put `---` or `===` on its own line between the two texts.
```
hello world
---
hello earth
→
[Summary] +1 added, -1 removed, 0 unchanged
──────────────────────────────────────────────────
- hello world
+ hello earth
```

<br/>

## Permissions

None. The popup works entirely with what you type into it, and Chrome shows no permission prompt on install.

<br/>

## Privacy

Dev Toolkit keeps your last few inputs per tool, your theme and the tool you used last in the popup's `localStorage`, on this browser only, and sends nothing anywhere. See [Privacy](docs/PRIVACY.md).

<br/>

## Documentation

- [Features](docs/FEATURES.md): every tool's input formats and output
- [Development](docs/DEVELOPMENT.md): local setup, architecture, adding a tool, translations, publishing
- [Privacy](docs/PRIVACY.md): what is stored and where

<br/>

## License

[MIT](LICENSE)
