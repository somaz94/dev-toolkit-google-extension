# Features

Detailed description of all tools available in Dev Toolkit.

<br/>

## Table of Contents

- [JSON Formatter](#json-formatter)
- [Base64 Encoder/Decoder](#base64-encoderdecoder)
- [JWT Token Tools](#jwt-token-tools)
- [URL Encoder/Decoder](#url-encoderdecoder)
- [Timestamp Converter](#timestamp-converter)
- [Hash Generator](#hash-generator)
- [UUID Generator](#uuid-generator)
- [Color Converter](#color-converter)
- [Diff Viewer](#diff-viewer)
- [Theme](#theme)
- [Open in a Tab](#open-in-a-tab)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Languages](#languages)

<br/>

## JSON Formatter

Format and validate JSON strings with proper indentation.

**Input:**
```json
{"name":"John","age":30,"city":"New York"}
```

**Output:**
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

**Details:**
- Indent with 2 spaces, 4 spaces or a tab, picked next to the input
- **Minify** puts the whole document back on one line
- Validates JSON syntax before formatting and shows the parser's message when it fails
- Handles nested objects and arrays

<br/>

## Base64 Encoder/Decoder

Encode text to Base64 or decode Base64 strings.

**Encode:**
```
Hello World! → SGVsbG8gV29ybGQh
```

**Decode:**
```
SGVsbG8gV29ybGQh → Hello World!
```

**Details:**
- Encodes the UTF-8 bytes of the text, so Korean, emoji and any other text work
- **URL-safe** encodes with `-` and `_` and no padding, as JWTs and URLs use
- Decoding accepts both alphabets, missing padding and line breaks; a result that is not UTF-8 text is shown one character per byte

<br/>

## JWT Token Tools

Decode a token to see its header, payload, times and signature, or encode a JSON payload into a signed token.

**Decode:**
```
Input:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
your-256-bit-secret

Output:
Header:
{ "alg": "HS256", "typ": "JWT" }

Payload:
{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }

Times:
iat  2018-01-18 01:30:22 UTC (N years ago)

Signature:
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
✓ Valid HS256 signature for this secret
```

**Encode:**
```
Input:
{"sub":"1234567890","name":"John"}
my-secret-key

Output:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.fGbwrKYzoMBvZbgTPJRSr4S4lSy7wDU-6rnS4wL865g
```

**Details:**
- Decodes all three JWT parts (header, payload, signature), and any text in them, Korean included
- `iat`, `nbf` and `exp` are shown as UTC times with how long ago or ahead they are; an `exp` in the past is marked expired and an `nbf` in the future not valid yet
- With a secret on the second line, decoding checks an HS256 signature against it; other algorithms are shown but not checked
- Encoding signs with HMAC-SHA256 through the Web Crypto API. The payload is the first line, as one line of JSON, and the secret the optional second line (`secret` when left out)

<br/>

## URL Encoder/Decoder

Encode or decode URL strings with special characters.

**Encode:**
```
https://example.com?name=John Doe → https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe
```

**Decode:**
```
https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe → https://example.com?name=John Doe
```

**Details:**
- Uses `encodeURIComponent()` / `decodeURIComponent()`
- Input starting with `http` is checked to be a valid URL before encoding

<br/>

## Timestamp Converter

Convert between Unix timestamps and human-readable dates.

**Timestamp to Date:**
```
Input: 1711270800

Output:
UTC:   2024-03-24 07:00:00 UTC
Local: 03/24/2024, 16:00:00 KST

Seconds:      1711270800
Milliseconds: 1711270800000
```

**Date to Timestamp:**
```
Input: 2026-03-24T12:00:00Z

Output:
Seconds:      1774440000
Milliseconds: 1774440000000
```

**Details:**
- Auto-detects seconds (10 digits) vs milliseconds (13 digits)
- Displays both UTC and local time
- Accepts ISO 8601 format, common date strings, or `now`
- Shows both seconds and milliseconds output

<br/>

## Hash Generator

Generate cryptographic hashes using Web Crypto API.

**Input:**
```
Hello World!
```

**Output:**
```
SHA-1:
2ef7bde608ce5404e97d5f042f95f89f1c232871

SHA-256:
7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069

SHA-384:
bfd76c0ebbd006fee583410547c1887b0292be76d582d96c242d2a792...

SHA-512:
861844d6704e8573fec34d967e20bcfef3d424cf48be04e6dc08f2bd5...
```

**Details:**
- Generates SHA-1, SHA-256, SHA-384, SHA-512 simultaneously
- Uses Web Crypto API (`crypto.subtle.digest`)
- No mode selector needed (single input → all hashes)

<br/>

## UUID Generator

Generate UUID v4 identifiers.

**Input:**
```
5    (or leave empty for 1 UUID)
```

**Output:**
```
550e8400-e29b-41d4-a716-446655440000
6ba7b810-9dad-11d1-80b4-00c04fd430c8
f47ac10b-58cc-4372-a567-0e02b2c3d479
a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
d6e7f8a9-b0c1-4d2e-9f3a-4b5c6d7e8f90
```

**Details:**
- Uses `crypto.randomUUID()` for cryptographically secure generation
- Batch generation: enter a number (1-100) or leave empty for 1
- Standard UUID v4 format

<br/>

## Color Converter

Convert between HEX, RGB, and HSL color formats. Auto-detects input format.

**Input:**
```
#ff6347
```

**Output:**
```
HEX: #ff6347
RGB: rgb(255, 99, 71)
HSL: hsl(9, 100%, 64%)

R: 255  G: 99  B: 71
H: 9° S: 100% L: 64%
```

**Supported input formats:**
- HEX: `#ff6347`, `#f00`, `ff6347`
- RGB: `rgb(255, 99, 71)`, `255, 99, 71`
- HSL: `hsl(9, 100, 50)`, `9, 100, 50`

<br/>

## Diff Viewer

Compare two texts line by line.

**Input:**
```
hello world
foo bar
---
hello earth
foo bar
new line
```

**Output:**
```
[Summary] +2 added, -1 removed, 1 unchanged
──────────────────────────────────────────────────
- hello world
+ hello earth
  foo bar
+ new line
```

**Details:**
- Separate two texts with `---` or `===` on its own line
- Shows added (`+`), removed (`-`), and unchanged lines
- Summary with counts at the top
- Lines are aligned with Myers' algorithm, so a line inserted near the top shows as one addition, not as every line below it changing
- Texts that differ in thousands of places show the differing middle as one removed block and one added block

<br/>

## Theme

Follow the system appearance, or pick light or dark.

- The button in the header cycles through **system** (🌓), **light** (☀️) and **dark** (🌙); hover it to see the current setting
- **System** is the default, and follows the operating system as it switches between light and dark
- The setting is saved in `localStorage`, and the popup opens in it without a flash of the other theme

<br/>

## Open in a Tab

The ⤢ button in the header opens the same tools in a browser tab, with wide, tall fields for inputs too big for the popup. The tab shares the popup's history, theme and last tool, and needs no extra permission.

<br/>

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` (or `Cmd+Enter`) | Execute conversion |
| `Ctrl+Shift+C` (or `Cmd+Shift+C`) | Copy result |
| `Alt+1` ~ `Alt+9` | Switch to the tool in that position, counting tabs from the left |

<br/>

## Input History

- The last 5 inputs per tool are saved in `localStorage` each time a tool runs
- The latest one is restored when the popup opens and when you switch to a tool
- **Recent inputs**, next to **Clear**, lists all five; pick one to put it back in the input
- The popup reopens on the tool and mode you used last, with each tool's options (indentation, URL-safe Base64) as you left them
- **Clear** empties both fields without restoring it
- **Use as input** moves the result into the input, to run it again or through another tool: decode a Base64 string, then format the JSON inside it

<br/>

## Languages

- English and Korean, following the browser language (Chrome's `_locales`); any other language shows English
- Tool names and formats (JSON, Base64, JWT, URL, UUID, HEX/RGB/HSL, SHA-*) stay as they are in every language
