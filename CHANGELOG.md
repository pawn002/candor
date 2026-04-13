# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Phase 4

### Added

- **Pagination:** New `app-pagination` component — `<nav aria-label="Pagination">` with previous/next buttons and numbered page links. Current page receives `aria-current="page"` and filled accent treatment. Ellipsis collapses large page ranges, keeping first, last, and current ± 1 always visible. `currentPage` is a two-way bindable `model<number>`; `ariaLabel` input for multiple paginators on the same page (#26)
- **Disclosure:** New `app-disclosure` component — single show/hide toggle following the APG Disclosure pattern. Button carries `aria-expanded` and `aria-controls` wired to its content panel; caret rotates 180° on open. `open` is a two-way bindable `model<boolean>`. Suitable for FAQ lists, expandable filter sections, and "read more" patterns (#25)
- **Listbox:** New `app-listbox` component — custom select alternative using `role="listbox"` + `role="option"`. Trigger button shows selected value with `aria-haspopup="listbox"` and `aria-expanded`; dropdown uses `aria-activedescendant` to track keyboard focus without moving DOM focus from the listbox. Full keyboard contract: ArrowDown/Up, Home/End, Enter/Space to select, Escape to close, Tab to close, 500ms typeahead by first character. Disabled options, error/hint with `aria-live`, `ControlValueAccessor` for Angular forms. Label, placeholder, required, hint, and error inputs match `app-select` API (#23)
- **Drawer:** New `app-drawer` component — slide-in panel anchored to a viewport edge. Uses `<dialog>` for native focus trapping and Escape key handling. `position` input supports `right` (default), `left`, and `bottom`; `size` controls panel width (or height for bottom sheets). Entry animation via `@starting-style`; `prefers-reduced-motion` disables it. Emits `(closed)` on close-button click, Escape, or backdrop click. `dismissOnBackdrop` input can disable backdrop dismissal (#51)
- **Tabs:** Added `orientation="vertical"` variant. Tab list renders on the left with a right-edge active indicator; panels fill the remaining space. Keyboard navigation uses ArrowUp/Down in vertical mode; `aria-orientation` set on the tablist. Suited to settings panels and sidebar navigation (#52)

---

## [Unreleased] — Phase 3

### Documentation

- **Tokens README:** Added prominent tokens-only scope notice and peer dependency installation guide — Fontsource font packages, Phosphor Icons, and a note on the `'Roboto Flex Variable'` font name (#64)
- **Typography/Article:** Added component-level serif vs. sans decision table: AI-generated content and human-authored prose use Noto Serif (`font="reading"`); UI chrome and scanning contexts use Noto Sans. Added `AIGeneratedProse` story showing the pattern in a realistic AI card context (#73)
- **Typography/AccessibleText:** Added three AI-app pattern stories: `AICardMetadataHeaders` (model attribution, generation timestamp, source references), `AIConfidenceScores` (inline confidence percentages with low-confidence warning threshold), and `AIStressContextCounters` (session-sensitive live counters with `role="status"` for screen reader announcements) (#71)
- **Design Tokens/Icons:** New Storybook story documenting Phosphor Icons: installation, weight convention table (bold=interactive, regular=informational), `WeightComparison`, `InContext`, and `AccessibilityPatterns` stories (#68)
- **Design Tokens/Typography:** New `OKCAContrastGuidance` story presenting the OKCA contrast score table for sub-16px text. WCAG is silent below 16px; OKCA closes the gap with a geometric ramp anchored at 4.5 (16px regular) → 20 (12px regular). Key Candor implication: `--font-size-sm` (14px) requires a score of 9.5 for regular text and 6.5 for bold — more than double the WCAG 4.5 floor (#62)

---

## [Unreleased] — Phase 2

### Added

- **Icons:** Adopted Phosphor Icons (`@phosphor-icons/web`) as the design system's icon vocabulary. Three-tier weight convention: `ph-fill` for action icons (close, dismiss, add, search — solid forms read as tappable), `ph-bold` for directional affordances (carets, chevrons), `ph` (regular — there is no `ph-regular` class) for informational/status icons.
- **Accordion, Modal, Toast:** Migrated inline SVG icons to Phosphor — chevron, close ×, status icons, and dismiss ×.
- **Button:** Added `.btn`, `.btn-sm`, `.btn-lg`, `.btn-primary`, `.btn-secondary`, `.btn-tertiary`, `.btn-ghost`, `.btn-destructive` global CSS utility classes for consumers using native `<button>` or `<a>` elements (#75)
- **Input:** Added `multiline`, `rows`, and `resize` inputs. When `multiline` is `true`, renders `<textarea>` with identical styling to `<input>` (#53)
- **Select:** New `app-select` wrapper component — native `<select>` with Phosphor caret, ControlValueAccessor, label, placeholder, error, hint, required, and disabled inputs (#54)
- **Navigation, Tabs:** Added `theme="inverse"` variant for dark headers and inverse surfaces. Uses `--color-bg-inverse`, `--color-text-inverse`, `--color-text-subtle-on-inverse`, and new `--color-border-on-inverse` tokens (#65)
- **Tokens:** Added `--color-text-subtle-on-inverse` and `--color-border-on-inverse` semantic tokens (light + dark)
- **Toast:** Added `ToastService` and `ToastContainerComponent` for imperative usage. Place `<app-toast-container>` once in AppComponent; call `toastService.show(message, variant, options)` from anywhere (#66)
- **Badge:** Added `OrdinalSeverity` pattern story documenting how to map domain severity scales (minor/moderate/fundamental, low/medium/high/critical) onto the existing status token triplets (#74)

---

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
