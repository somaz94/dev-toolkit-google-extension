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
- [Dark Mode](#dark-mode)
- [Keyboard Shortcuts](#keyboard-shortcuts)

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
- 2-space indentation
- Validates JSON syntax before formatting
- Displays parsing errors with detailed messages
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
- Uses native `btoa()` / `atob()` APIs
- Validates Base64 format with regex before decoding
- Supports standard Base64 alphabet

<br/>

## JWT Token Tools

Decode JWT tokens to view their structure, or encode a JSON payload into JWT format.

**Decode:**
```
Input: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...

Output:
Header:  { "alg": "HS256" }
Payload: { "sub": "1234567890" }
Signature: (displayed as-is)
```

**Encode:**
```
Input: { "sub": "1234567890", "name": "John" }
Output: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0...DEMO_SIGNATURE
```

**Details:**
- Decodes all three JWT parts (header, payload, signature)
- Handles Base64Url encoding (URL-safe Base64 with padding)
- Encoding uses demo signature (not cryptographic)

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
- Validates URL structure before encoding

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

<br/>

## Dark Mode

Toggle between light and dark themes.

- Click the moon/sun icon in the header
- Preference is saved in `localStorage` and persists across sessions
- CSS custom properties for consistent theming

<br/>

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` (or `Cmd+Enter`) | Execute conversion |
| `Ctrl+Shift+C` (or `Cmd+Shift+C`) | Copy result |
| `Alt+1` ~ `Alt+9` | Switch tabs (JSON, Base64, JWT, URL, Time, Hash, UUID, Color, Diff) |

<br/>

## Input History

- Last 5 inputs per tab are saved in `localStorage`
- Automatically restored when switching tabs
- Clear button resets without restoring history
