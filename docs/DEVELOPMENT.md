# Development

Guide for developing, testing, and publishing Dev Toolkit.

<br/>

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Adding a New Tool](#adding-a-new-tool)
- [Chrome Web Store Publishing](#chrome-web-store-publishing)
- [CI/CD Workflows](#cicd-workflows)
- [Conventions](#conventions)

<br/>

## Prerequisites

- Google Chrome browser
- Text editor (VS Code recommended)
- No build tools or package managers required

<br/>

## Project Structure

```
dev-toolkit-google-extension/
├── manifest.json              # Chrome extension config (Manifest V3)
├── src/
│   ├── popup/
│   │   ├── popup.html         # UI markup (tabs, buttons, textareas)
│   │   ├── popup.js           # Event handling & orchestration
│   │   └── popup.css          # Light/dark theme styling
│   └── utils/
│       ├── jsonFormatter.js   # JSON formatting & validation
│       ├── base64Utils.js     # Base64 encode/decode
│       ├── jwtDecoder.js      # JWT token decoding
│       ├── jwtEncoder.js      # JWT token encoding
│       ├── urlUtils.js        # URL encode/decode
│       ├── timestampUtils.js  # Unix timestamp <-> date conversion
│       └── validator.js       # Input validation rules
├── icons/                     # Extension icons (16, 48, 128px)
├── docs/                      # Documentation
└── .github/workflows/         # CI/CD
```

<br/>

## Local Development

<br/>

### Load Extension

1. Clone the repository
   ```bash
   git clone https://github.com/somaz94/dev-toolkit-google-extension.git
   cd dev-toolkit-google-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (top right toggle)

4. Click **Load unpacked** and select the project root directory

5. The extension icon appears in the toolbar

<br/>

### Hot Reload

After editing files:
1. Go to `chrome://extensions/`
2. Click the refresh icon on the Dev Toolkit card
3. Close and reopen the extension popup to see changes

<br/>

### Debugging

- Right-click the extension popup > **Inspect** to open DevTools
- Check the Console tab for errors
- Network tab is usually empty (no external requests)

<br/>

## Adding a New Tool

1. **Create utility module** in `src/utils/`
   ```javascript
   // src/utils/myTool.js
   export function encode(input) { ... }
   export function decode(input) { ... }
   ```

2. **Add tab button** in `src/popup/popup.html`
   ```html
   <button class="tab-btn" data-tab="mytool">MyTool</button>
   ```

3. **Import and wire up** in `src/popup/popup.js`
   - Add import at the top
   - Add case in tab switch logic
   - Add case in `formatBtn` click handler
   - Add case in `updateButtonText()`

4. **Add validation** in `src/utils/validator.js` if needed

5. **Update docs** (README.md, DEVELOPMENT.md)

<br/>

## Chrome Web Store Publishing

<br/>

### First-time Setup

1. Register at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) ($5 one-time fee)
2. Note: South Korea is not available as a seller country. Use an alternative address if needed.

<br/>

### Package the Extension

```bash
# Create ZIP file (exclude unnecessary files)
zip -r dev-toolkit.zip \
  manifest.json \
  src/ \
  icons/ \
  LICENSE \
  README.md \
  -x "*.DS_Store" "*.git*"
```

<br/>

### Upload and Submit

1. Go to [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New Item** (or select existing item for updates)
3. Upload the ZIP file
4. Fill in store listing:
   - Description
   - Screenshots (at least 1, 1280x800 or 640x400)
   - Icons (128x128 required)
   - Category: Developer Tools
   - Language: English
5. Click **Submit for Review**
6. Review typically takes 1-3 business days

<br/>

### Common Rejection Reasons

- **Unnecessary permissions**: Only request permissions you actually use. Remove `activeTab` if not needed.
  ```json
  // manifest.json - keep permissions minimal
  "permissions": []
  ```
- **Missing privacy policy**: Required if collecting any user data
- **Misleading description**: Store listing must match actual functionality

<br/>

### Updating an Existing Extension

1. Update `version` in `manifest.json`
2. Create new ZIP
3. Dashboard > Select extension > **Package** tab > **Upload new package**
4. Submit for review

<br/>

## CI/CD Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `gitlab-mirror.yml` | Push to main | Mirror repo to GitLab |
| `release.yml` | Tag push (`v*.*.*`) | Package ZIP and create GitHub Release |
| `changelog-generator.yml` | PR merged / Release | Auto-generate CHANGELOG.md |
| `contributors.yml` | Push to main | Update contributors list |
| `stale-issues.yml` | Daily cron | Close stale issues after 30+7 days |
| `issue-greeting.yml` | Issue opened | Greet first-time contributors |

<br/>

## Conventions

<br/>

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add timestamp converter
fix: base64 decoding error on special chars
chore: update workflows
docs: add development guide
```

<br/>

### Code Style

- ES6 module syntax (`import`/`export`)
- No external dependencies
- Native browser APIs only
- 2-space indentation
- Single quotes for strings
