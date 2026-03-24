# Features

Detailed description of all tools available in Dev Toolkit.

<br/>

## Table of Contents

- [JSON Formatter](#json-formatter)
- [Base64 Encoder/Decoder](#base64-encoderdecoder)
- [JWT Token Tools](#jwt-token-tools)
- [URL Encoder/Decoder](#url-encoderdecoder)
- [Timestamp Converter](#timestamp-converter)
- [Dark Mode](#dark-mode)

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

## Dark Mode

Toggle between light and dark themes.

- Click the moon/sun icon in the header
- Preference is saved in `localStorage` and persists across sessions
- CSS custom properties for consistent theming
