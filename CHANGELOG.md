# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Phase 1

### Breaking

- **AccordionItem, Alert, Modal, Toast:** `title` input renamed to `heading`. Replace `[title]="..."` or `title="..."` with `[heading]="..."` or `heading="..."` on all four components. See [BREAKING-CHANGES.md](docs/BREAKING-CHANGES.md).

### Fixed

- **Tokens:** `--font-sans` now lists `'Roboto Flex Variable'` first so consumers using `@fontsource-variable/roboto-flex` get the correct font instead of a silent fallback to system-ui (#67)
- **Table:** Dark-mode zebra stripe was invisible because the stripe background matched the table surface (`--color-bg-elevated`). Fixed with `color-mix(in oklch, white 15%, var(--color-bg-elevated))` (#79)
- **Badge:** `font-weight-semibold` on Atkinson Hyperlegible silently fell back to 400. Changed to `font-weight-bold` (700) which Atkinson actually supports (#72)
- **Chip:** `isSelected` was initialised once in `ngOnInit` and never updated. Promoted `selected` to `model()` so the chip stays in sync with parent state changes (#55)
- **Modal:** Removed unused `ButtonComponent` import that caused `NG8113` warnings in consuming projects (#57)
- **Tabs:** Added comment on `activeId` model clarifying that parent signals must be typed as `string`, not a narrower union type, to avoid TS2345 under strict template checking (#56)
- **Security:** Updated `@angular/build` to 21.2.7, resolving 19 undici and vite CVEs (#49)
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-23

### Fixed
- README rewritten for npm registry — leads with install/usage, documents all token categories with real property names and contrast ratios
- Bundler `@import` example correctly labelled (not SCSS `@use`)

### Added
- `LICENSE` file (ISC)
- `CHANGELOG.md`
- `release:patch/minor/major` npm scripts for safe version management

## [1.0.0] - 2026-03-23

### Added
- Initial public release of `@candor-design/tokens`
- CSS custom properties for color (OKLCH), typography, spacing, and shape tokens
- Dark mode support via `prefers-color-scheme` and `[data-theme]` attribute
- Minified CSS and JSON exports alongside the full stylesheet
- GitHub Actions publish pipeline with OIDC trusted publishing (no `NPM_TOKEN` required)
