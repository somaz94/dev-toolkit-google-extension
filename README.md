# Dev Toolkit - Chrome Extension

A developer toolkit for JSON formatting, Base64 encoding/decoding, JWT decoding, and URL encoding/decoding.

## Screenshot
<img src="./img/app.png" width="300" alt="Dev Toolkit">

## Features
- 🔍 JSON Formatter & Validator
  - Format JSON with proper indentation
  - Validate JSON syntax
  - Support for nested objects and arrays
  
- 🔒 Base64 Encoder/Decoder
  - Encode text to Base64
  - Decode Base64 to text
  - Validate Base64 format
  
- 🎫 JWT Token Tools
  - Encode JSON payload to JWT
  - Decode JWT tokens
  - View header, payload, and signature
  - Validate JWT format
  
- 🔗 URL Encoder/Decoder
  - Encode URLs with special characters
  - Decode URL-encoded strings
  - Support for query parameters

- 🌙 Dark Mode Support
  - Toggle between light and dark themes
  - Persistent theme preference

## Installation
### From Chrome Web Store
1. Visit [Dev Toolkit](https://chromewebstore.google.com/detail/dev-toolkit/docgjoppdhbahapgbemfadlkgchnmecc)
2. Click "Add to Chrome"

### From Source
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Usage
1. Click the extension icon in Chrome
2. Select the desired tool tab (JSON, Base64, JWT, or URL)
3. Choose mode (Encode/Decode) if applicable
4. Input your text
5. Click the action button to process
6. Use the Copy button to copy the result

### Example Usage
#### JSON Formatting
```json
Input: {"name":"John","age":30,"city":"New York"}
Output:
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

#### Base64 Encoding/Decoding
```
Encode:
Input: Hello World!
Output: SGVsbG8gV29ybGQh

Decode:
Input: SGVsbG8gV29ybGQh
Output: Hello World!
```

#### JWT Token
```
Decode:
Input: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Output:
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

#### URL Encoding/Decoding
```
Encode:
Input: https://example.com?name=John Doe&age=25
Output: https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe%26age%3D25

Decode:
Input: https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe%26age%3D25
Output: https://example.com?name=John Doe&age=25
```

## Development
```bash
git clone https://github.com/yourusername/dev-toolkit-google-extension.git
cd dev-toolkit-google-extension
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.