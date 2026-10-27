# Changelog

All notable changes to this project will be documented in this file.

## [v1.2.0](https://github.com/somaz94/dev-toolkit-google-extension/compare/v1.1.0...v1.2.0) (2026-10-27)

### Features

- add Korean, following the browser language ([0dcae5a](https://github.com/somaz94/dev-toolkit-google-extension/commit/0dcae5a4de37e42970bd8f51507062238bb2e259))

### Documentation

- remove duplicate rules covered by global CLAUDE.md ([e428df6](https://github.com/somaz94/dev-toolkit-google-extension/commit/e428df694fbf27560785eec18aad18646793cb84))

### Continuous Integration

- package _locales in the release ZIP ([431d381](https://github.com/somaz94/dev-toolkit-google-extension/commit/431d381af857a1f78499d746ef21444fa2f11248))
- move the release action to its Node 24 major ([156ae9e](https://github.com/somaz94/dev-toolkit-google-extension/commit/156ae9e6f804755aed5800c343a9960fd5984431))
- deduplicate identical commit lines in release notes ([e9b42f6](https://github.com/somaz94/dev-toolkit-google-extension/commit/e9b42f6531d01fd0c713539e25711f25a86d2b8d))
- trim redundant comments in gitlab-mirror workflow ([9398534](https://github.com/somaz94/dev-toolkit-google-extension/commit/93985345ae7feb1a482b40e0ba85e649ab12bda0))
- retry mirror pushes on transient remote failures ([7499d06](https://github.com/somaz94/dev-toolkit-google-extension/commit/7499d06adb89ac354dc2bf4e743b3da23399c570))
- drop the dead issue-close trigger from changelog generation ([8e1b290](https://github.com/somaz94/dev-toolkit-google-extension/commit/8e1b2905bd8b175a28f61f1172b8fecee660ec49))
- remove DCO workflow ([cebcea3](https://github.com/somaz94/dev-toolkit-google-extension/commit/cebcea354b0875e66e5e0afc64938d2ada21d344))
- adopt semantic-pr, labels, lock-threads, PR size, and auto-assign reusables ([3681eac](https://github.com/somaz94/dev-toolkit-google-extension/commit/3681eac395a9e1ed03485eb00458020b6be0d2bf))
- use reusable stale-issues workflow ([403db70](https://github.com/somaz94/dev-toolkit-google-extension/commit/403db702c41aa202389622a72425ad5f7dfe5c79))
- use reusable issue-greeting workflow ([3f195ef](https://github.com/somaz94/dev-toolkit-google-extension/commit/3f195ef0b9abeba577b559cb25613cfc95dc8015))
- use reusable contributors workflow ([4f32aab](https://github.com/somaz94/dev-toolkit-google-extension/commit/4f32aabcf7de19b265cbb3401110e7dc2dd7583b))
- add ok-to-test workflow stub ([c9f264b](https://github.com/somaz94/dev-toolkit-google-extension/commit/c9f264b12f3d48cfc0f3c06e9af3451dc3350c26))
- add PR welcome workflow stub ([5abcd59](https://github.com/somaz94/dev-toolkit-google-extension/commit/5abcd598260bd36f63d9b5b99b158451a0556fdb))
- add DCO check via shared reusable workflow ([bfa14fd](https://github.com/somaz94/dev-toolkit-google-extension/commit/bfa14fd372a33d5f713331648f9872e8469153c3))
- add concurrency guards to recurring workflows ([31e7a9a](https://github.com/somaz94/dev-toolkit-google-extension/commit/31e7a9a6eef5c046fd6fc32496bf8f3f699adab7))
- skip auto-generated changelog and contributors commits in release notes ([44b9a66](https://github.com/somaz94/dev-toolkit-google-extension/commit/44b9a66492b130558fdf23382bd0f3dc15f9c074))
- add git-cliff for auto-generated release notes ([81a1f2d](https://github.com/somaz94/dev-toolkit-google-extension/commit/81a1f2da2a66f3c692793a71e5fe551991b0312d))
- revert to body_path RELEASE.md in release workflow ([7ef2791](https://github.com/somaz94/dev-toolkit-google-extension/commit/7ef27914bd4ac77f182bc9c1cefb446a76420750))

### Chores

- bump version to 1.2.0 ([292eff8](https://github.com/somaz94/dev-toolkit-google-extension/commit/292eff8ee01c4620a6629ce2ecb6a1083ba37dac))
- credit somaz94 as the author ([f58666f](https://github.com/somaz94/dev-toolkit-google-extension/commit/f58666f67f04fe2bea1c7beba545d1689c45e22f))
- remove duplicate rules from CLAUDE.md (moved to global) ([dc3f9b0](https://github.com/somaz94/dev-toolkit-google-extension/commit/dc3f9b0a17f00b693356aa15ea499df93b15ae7f))
- add git config protection to CLAUDE.md ([a75a373](https://github.com/somaz94/dev-toolkit-google-extension/commit/a75a3738584acd7414bf078713a34f5eafb34d4c))

### Contributors

- somaz

<br/>

## [v1.1.0](https://github.com/somaz94/dev-toolkit-google-extension/releases/tag/v1.1.0) (2026-03-24)

### Features

- add input history with localStorage (last 5 per tab) ([7067a15](https://github.com/somaz94/dev-toolkit-google-extension/commit/7067a1590690eebbd37d666fe0858796012107c7))
- replace copy feedback with toast notification ([9040bd5](https://github.com/somaz94/dev-toolkit-google-extension/commit/9040bd5de4ce84563f2a9a891754c85dac5c21f0))
- add JSON indent selection (2/4/tab) and Minify button ([131a69f](https://github.com/somaz94/dev-toolkit-google-extension/commit/131a69f7fa82437b805c06f4f5a8d2406fe49242))
- add keyboard shortcuts (Ctrl+Enter, Ctrl+Shift+C, Alt+1-9) ([870b55f](https://github.com/somaz94/dev-toolkit-google-extension/commit/870b55fb2919cac5ac4bd9a2424d13d2134f4cd8))
- add Diff Viewer (line-by-line text comparison) ([b0b41c5](https://github.com/somaz94/dev-toolkit-google-extension/commit/b0b41c537363547f66e8c47f62f522096ff01efb))
- add Color Converter (HEX, RGB, HSL auto-detection) ([119cb97](https://github.com/somaz94/dev-toolkit-google-extension/commit/119cb97d7697b476edad9a6f2ea501f98272b6df))
- add UUID Generator (v4, supports batch generation up to 100) ([57ca86f](https://github.com/somaz94/dev-toolkit-google-extension/commit/57ca86f0b61171d11896ba4d1478d9e507b062f2))
- add Hash Generator (SHA-1, SHA-256, SHA-384, SHA-512) ([8784911](https://github.com/somaz94/dev-toolkit-google-extension/commit/87849112c9b388b451693f1dca21a993a9ba4427))
- add Timestamp Converter (Unix timestamp <-> date) ([8904ad8](https://github.com/somaz94/dev-toolkit-google-extension/commit/8904ad819bfcb8c3934ff5014ae321fa0a651bfe))

### Bug Fixes

- widen popup to 520px to fit all 9 tabs in one row ([867fe19](https://github.com/somaz94/dev-toolkit-google-extension/commit/867fe19437bd3798ce3676c3681b543ed068b803))
- widen popup to 480px, wrap tabs to prevent overflow ([7ab7a94](https://github.com/somaz94/dev-toolkit-google-extension/commit/7ab7a94a4e1dfea7c55bfd07d820c92176b9f81a))
- JWT encoder now uses HMAC-SHA256 real signing via Web Crypto API ([9b4f7b2](https://github.com/somaz94/dev-toolkit-google-extension/commit/9b4f7b2e0aed4dce6ddcf3b51c30285eeec851ca))
- icons, manifest ([eff1df2](https://github.com/somaz94/dev-toolkit-google-extension/commit/eff1df2585c43a329b11cf840c6d40e5538fcfe0))
- manifest.json ([db04b6c](https://github.com/somaz94/dev-toolkit-google-extension/commit/db04b6c8218a72a325abf431a7ebb024157352fc))

### Documentation

- update all docs with new features, shortcuts, tests, Makefile ([d186865](https://github.com/somaz94/dev-toolkit-google-extension/commit/d186865ca87bab852b147d7e7eb2870711c8cbd2))
- add FEATURES.md, DEVELOPMENT.md, update README with timestamp and docs links ([6b25ef1](https://github.com/somaz94/dev-toolkit-google-extension/commit/6b25ef152743693af7097102aafeb30d639bfa4b))
- README.md ([acfa6a2](https://github.com/somaz94/dev-toolkit-google-extension/commit/acfa6a2871af270f144fe3eb59adc7a38f6bce01))

### Tests

- increase coverage to 98%+ (75 tests), add DESCRIPTION.md ([f66ad6f](https://github.com/somaz94/dev-toolkit-google-extension/commit/f66ad6f57a50851645903a4b9736ef19d64bf854))

### Continuous Integration

- migrate gitlab-mirror workflow to multi-git-mirror action ([22cd71b](https://github.com/somaz94/dev-toolkit-google-extension/commit/22cd71b8bc2d8b60a94b3fe691b42086472df2eb))

### Chores

- bump version to 1.1.0 ([8277790](https://github.com/somaz94/dev-toolkit-google-extension/commit/82777908c033d3f4bd00b32bc054725845195696))
- add tests, lint, coverage, Makefile, bump-version script ([19e4439](https://github.com/somaz94/dev-toolkit-google-extension/commit/19e44393b85011683dcd85478cbda62fc5f764b3))
- add CLAUDE.md, workflows, issue templates, update README ([5bd9566](https://github.com/somaz94/dev-toolkit-google-extension/commit/5bd9566b4a053a315e35e5f8da71c74e74a7574a))
- add img ([f24c5ab](https://github.com/somaz94/dev-toolkit-google-extension/commit/f24c5ab0af910afff6f99d33ec1c9a248e712b9a))
- delete .DS_Store ([aa69362](https://github.com/somaz94/dev-toolkit-google-extension/commit/aa69362daa2bc0b48a3aa90b84e03b301e1b5158))
- add validator ([df7aec2](https://github.com/somaz94/dev-toolkit-google-extension/commit/df7aec2ecff92ea2e49f4575408ce90c2ed709fc))

### Add

- gitlab-mirror.yml ([3b0f97c](https://github.com/somaz94/dev-toolkit-google-extension/commit/3b0f97c666399e8638052f6858663156d2f50af9))
- .gitignore ([9823c28](https://github.com/somaz94/dev-toolkit-google-extension/commit/9823c289d990d7c0d11dd88033c32e83a98a59e2))

### Contributors

- somaz

<br/>

