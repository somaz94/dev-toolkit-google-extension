# Dev Toolkit

A lightweight Chrome extension providing developer utilities for encoding, decoding, and formatting.

Zero dependencies. Zero permissions. Manifest V3.

<br/>

## Screenshot

<img src="./img/app.png" width="300" alt="Dev Toolkit">

<br/>

## Features

### JSON Formatter & Validator
- Format JSON with proper indentation
- Validate JSON syntax
- Support for nested objects and arrays

### Base64 Encoder/Decoder
- Encode text to Base64
- Decode Base64 to text
- Validate Base64 format

### JWT Token Tools
- Encode JSON payload to JWT
- Decode JWT tokens
- View header, payload, and signature

### URL Encoder/Decoder
- Encode URLs with special characters
- Decode URL-encoded strings
- Support for query parameters

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference

<br/>

## Installation

<br/>

### Chrome Web Store
1. Visit [Dev Toolkit](https://chromewebstore.google.com/detail/dev-toolkit/docgjoppdhbahapgbemfadlkgchnmecc)
2. Click "Add to Chrome"

<br/>

### From Source
```bash
git clone https://github.com/somaz94/dev-toolkit-google-extension.git
cd dev-toolkit-google-extension
```
1. Open Chrome > `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project directory

<br/>

## Usage

1. Click the extension icon in Chrome
2. Select a tool tab (JSON, Base64, JWT, URL)
3. Choose mode (Encode/Decode) if applicable
4. Input text and click the action button
5. Copy the result with the Copy button

<br/>

## Examples

<br/>

### JSON Formatting
```json
Input: {"name":"John","age":30,"city":"New York"}

Output:
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

<br/>

### Base64
```
Encode: Hello World! → SGVsbG8gV29ybGQh
Decode: SGVsbG8gV29ybGQh → Hello World!
```

<br/>

### JWT Decode
```
Input: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...

Output:
Header: { "alg": "HS256" }
Payload: { "sub": "1234567890" }
```

<br/>

### URL
```
Encode: https://example.com?name=John Doe → https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe
Decode: https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe → https://example.com?name=John Doe
```

<br/>

## Project Structure

```
dev-toolkit-google-extension/
├── manifest.json          # Chrome extension config (Manifest V3)
├── src/
│   ├── popup/
│   │   ├── popup.html     # UI markup
│   │   ├── popup.js       # Event handling & orchestration
│   │   └── popup.css      # Light/dark theme styling
│   └── utils/
│       ├── jsonFormatter.js
│       ├── base64Utils.js
│       ├── jwtDecoder.js
│       ├── jwtEncoder.js
│       ├── urlUtils.js
│       └── validator.js
├── icons/                 # Extension icons (16, 48, 128px)
└── .github/workflows/     # CI/CD
```

<br/>

## Tech Stack

- JavaScript (ES6 Modules) — no bundler, no dependencies
- HTML5 / CSS3 with CSS custom properties
- Chrome Extension Manifest V3
- Native browser APIs (Clipboard, localStorage, Web Crypto)

<br/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

<br/>

## License

[MIT](LICENSE)
