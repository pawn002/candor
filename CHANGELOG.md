# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Breaking

- **Tokens:** Primitive color ramp `--purple-*` renamed to `--indigo-*` across all ten steps (`--indigo-50` through `--indigo-900`). The hue (H=278.14) is perceptually indigo, not purple. Consumers who reference primitive tokens directly (against the two-tier architecture recommendation) must find-replace `--purple-` → `--indigo-`. Semantic tokens (`--color-highlight`, `--color-highlight-decorative`, `--color-link-visited`) are unchanged and require no consumer action.

### Added

- **`@candor-design/web-components` 3.0.0** — new package shipping all 34 Candor components as Lit 3 custom elements. Version aligned to `@candor-design/tokens` so a single version number describes the full design system release. Separate npm package keeps Lit out of Angular-only consumers' dependency graph.
  - **Custom elements:** `candor-badge`, `candor-alert`, `candor-card`, `candor-stat`, `candor-progress`, `candor-heading`, `candor-text`, `candor-accessible-text`, `candor-article`, `candor-button`, `candor-chip`, `candor-breadcrumb`, `candor-pagination`, `candor-toolbar` + `candor-toolbar-separator`, `candor-navigation`, `candor-input`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`, `candor-chat-input`, `candor-tooltip`, `candor-modal`, `candor-drawer`, `candor-toast` + `candor-toast-container`, `candor-tabs` + `candor-tab-panel`, `candor-accordion-item`, `candor-disclosure`, `candor-menu`, `candor-table`, `candor-data-grid`
  - Form controls use the `ElementInternals` API (`static formAssociated = true`) for native form participation — values appear in `FormData`, validation works, `:disabled` applies correctly
  - CSS custom properties pierce Shadow DOM boundaries, so `candor-tokens.css` loaded once at the document level resolves inside all shadow roots — no injection required
  - `candor-article` uses light DOM (`createRenderRoot()`) so prose styles reach projected content, equivalent to Angular's `ViewEncapsulation.None`
  - Stories appear in Storybook under the `Components/`, `Typography/`, `Form/`, and `Examples/` categories
  - Build: `npm run build:wc` — Vite lib build producing ESM (165 kB) and UMD (151 kB) bundles with declaration files
  - **Form control parity:** `candor-checkbox`, `candor-radio`, `candor-switch`, and `candor-slider` now match the Angular rendering primitive. Checkbox/radio use the hidden-input + sibling-span pattern (20×20 box, CSS-drawn check/dot, hover state) instead of `accent-color` on the native input. Switch track uses `--color-bg-surface` + bordered shell with hover, and the thumb changes color on `:checked`. Slider thumb is white-with-shadow at 1.375rem with hover scale, and the track gradient is on `::-webkit-slider-runnable-track`
  - **Container parity:** `candor-drawer`, `candor-modal`, `candor-tabs`, `candor-disclosure`, and `candor-tooltip` now match Angular. Drawer has `@starting-style` slide-in transforms per position, `--shadow-modal` on the panel, display-font title at h3/bold, correct width sizes (480px md not 28rem), bottom-sheet max-height variants, projected-footer flex layout, and `prefers-reduced-motion` support. Modal gets `backdrop-filter: blur(2px)`, the same display-font title, correct sizes (400/560/768px), asymmetric header padding, body line-height/font, and projected-footer button row layout. Tabs got the missing `.tabs__list-wrapper` with fade-gradient scroll affordance wired to a scroll listener, plus full `tabs--vertical` layout (was a no-op property before). Disclosure trigger now has a `--color-border-subtle` underline, vertical padding, medium weight, and a hover color shift. Tooltip got the missing `::after` arrow/tail for all four positions, plus visibility transition and z-index 100 to match.
  - **Typography parity:** `candor-accessible-text` `role="label"` now renders uppercase, bold, with tight line-height as Angular does; `role="status"` and `role="annotation"` apply the correct line-heights (tight, relaxed); `color="error"` uses `--color-status-error` not the `-text` variant. `candor-breadcrumb` switched from `--font-family-base` to `--font-family-accessible` with `letter-spacing: 0.02em` and bold links/current; separator now uses `'/' / ''` to mark itself decorative to screen readers. `candor-pagination` adopted the same accessible font + 14px bold + tracking, dropped its button borders, swapped Unicode `‹›` for rotated Phosphor caret icons, and uses the correct color tokens. `candor-menu` trigger picks up medium weight + strong border + open-state styling, items now use the accessible font at 14px with tracking (was 16px base), and the chevron is now a Phosphor SVG. `candor-toast` got the missing 4px left-border accent, the correct base-font/`--color-text-default` title, and the matching dismiss-button hover token. `candor-article` adds the missing prose rules for `abbr[title]`, `figure`/`figcaption`, and in-article `<table>`.
  - **Icon parity:** Unicode `▾` chevrons in `candor-accordion-item`, `candor-select`, `candor-listbox`, and `candor-combobox` swapped to the same Phosphor caret-down SVG the Angular components use, so glyph styling lines up across components. `candor-select` additionally gained the missing focus-within/error/disabled caret color states, a hover border-color shift, and the correct `padding-right` calculation; class name normalized from `select-caret` to `select__caret`.

### Removed

- **Angular reference component library** (`src/app/components/`, `src/app/examples/` — the `Angular Components/` Storybook section) removed. It was an internal feature-parity benchmark that defined the minimum accessible feature set for the web components; with WC parity confirmed it has served its purpose. **No consumer impact** — the Angular library was never published as a package. `@candor-design/web-components` is now the sole, canonical component surface; teams on Angular consume the framework-agnostic custom elements (register `CUSTOM_ELEMENTS_SCHEMA`). The framework-agnostic article prose stylesheet source moved from the Angular component SCSS to `src/design-tokens/article.scss` — the published `candor-article.css` is unchanged. See `docs/BREAKING-CHANGES.md` → v3.0.0.
- Dead Angular-app npm scripts (`ng`, `start`, `watch`, `build`, `test`) removed from `package.json`; the published build/test commands are `build:tokens`, `build:wc`, and `test:playwright`. The Storybook toolchain still runs on the `@storybook/angular` builder.

---

## [3.0.0] - 2026-04-20

### Breaking

- **Article:** CSS modifier `article--font-reading` renamed to `article--font-serif` — reflects the token it applies (`--font-family-serif`) and removes the false association with the `--font-reading` token (Noto Sans). Consumers using the framework-agnostic `candor-article.css` must rename the class on their wrapper elements (#93)
- **Article:** `ArticleComponent` `font` input values changed — `'reading'` → `'serif'`. The `ArticleFont` union type is now `'serif' | 'sans'`. Angular consumers must update `[font]="'reading'"` and `font="reading"` bindings (#93)

### Added

- **Chip:** `linkHref = input<string | null>(null)` — third interaction mode renders the chip as `<a>` when set. Mutually exclusive with `selectable` and `dismissible`. Includes visited, hover, and focus-visible styles; visited uses `--color-text-subtle-on-surface` (OKCA 4.6 on surface) not `--color-text-subtle` (OKCA 3.4 — fails Tier 2 bold at 14px on surface). New `Link` and `TaxonomyLinks` stories (#97)
- **Tokens:** `--letter-spacing-relaxed: 0.03em` — moderate tracking between `--letter-spacing-normal` (0) and `--letter-spacing-wide` (0.05em). Suited to small body text and captions where `--letter-spacing-wide` reads as over-spaced (#95)

### Documentation

- **CLAUDE.md:** Added mobile viewport check as step 5 in the design iteration workflow — switch to mobile1 (320 × 568) before closing any story work (#104)
- **CLAUDE.md:** New "Responsive Layout Patterns" section — intrinsic two-column grid (`repeat(auto-fit, minmax(min(100%, 240px), 1fr))`) and flex child text overflow fix (`min-width: 0` + `overflow-wrap: break-word`) (#102, #103)
- **Article CSS:** Expanded `candor-article.css` usage comment — modifier listed as required (not optional), disambiguation note that `article--font-serif` applies `--font-family-serif`, not `--font-reading` (#96)
- **tokens/README.md:** Font `@font-face` naming hazard — `'Noto Serif'` and `'Noto Sans'` must be used exactly; appending "Variable" produces a silent fallback with no console error (#94)
- **tokens/README.md:** Article end-of-content spacing guidance — minimum `--spacing-3xl` (6rem) bottom padding recommended for long-form reading contexts (#99)

---

## [2.3.0] - 2026-04-15

### Added

- **Toolbar:** New `app-toolbar` component — `role="toolbar"` container implementing the APG Toolbar pattern. Single tab stop with roving tabindex; Left/Right (horizontal) or Up/Down (vertical) arrow keys navigate between controls; Home/End jump to first/last. Includes `app-toolbar-separator` for visual group dividers. Stories cover formatting buttons, toggle buttons (`aria-pressed`), separators, vertical orientation, and data-table action bar (#27)
- **Tokens:** `--spacing-2xs: 0.25rem` (4px) — compact UI contexts: table cells in compact mode, icon nudges, tone-picker cell padding (#48)
- **Tokens:** `--hit-target-aaa: 2.75rem` (44px) and `--hit-target-aa: 1.375rem` (22px) — WCAG 2.5.5 AAA/AA touch target size tokens, under a new `Interaction` section alongside focus-ring tokens (#48)
- **AccordionItem:** `variant` input (`'default' | 'subtle' | 'quiet'`) — expresses heading hierarchy in nested accordion groups. `subtle`: regular weight, subtle colour; `quiet`: regular weight, `--font-size-sm`, subtle colour (#48)

### Fixed

- **Tokens:** Dark-mode `--color-action-primary` chroma boosted from C=0.05 → C=0.12 (`oklch(0.79 0.12 245)`). The `navy-*` scale is intentionally low-chroma — appropriate for the dark charcoal primaries in light mode, but at L=0.76 C=0.05 the button reads as muted gray-blue rather than a confident CTA. The new value is clearly perceptible as blue without changing hue or breaking contrast (text 5.5:1, button-on-page 6.9:1 ✅). Hover/active updated to `oklch(0.87 0.08 245)` for consistency (#76)
- **Card:** Footer now uses `--color-text-subtle-on-surface` (validated against `--color-bg-surface`) instead of `--color-text-subtle` (page-only). Footer font-size reduced to `--font-size-sm` to distinguish secondary content from body prose. Header gains `font-optical-sizing: auto` to activate Roboto Flex's optical-size axis (#20)
- **Modal:** Close button replaced with `app-button variant="ghost" size="small"` — hover, active, and focus ring now drawn from `ButtonComponent` tokens. Removed hand-rolled `.modal__close` SCSS block (#83)
- **Card:** Removed `overflow: hidden` from `.card` — was clipping sticky children (`<thead>`, sticky toolbar, sticky alert bar inside a card). Border-radius renders correctly without it in modern browsers (#48)
- **Tokens:** Clarified `--color-toast-message` dark-mode comment — the intentional subtle dimming on dark backgrounds is documented inline to prevent silent substitution with `--color-text-default` (#48)
- **Tokens:** Color re-audit (#14) — full OKCA validation against the OKCA Contrast Guidance scale. 7 failing pairs corrected; 14 other pairs confirmed passing. 14px token usage constraint documented
- **Examples:** Six example stories made mobile-responsive — fixed widths, hard 2-column grids, and missing scroll affordances corrected (#100)

### Documentation

- **Card:** Component-level prose covering three integration patterns: light-mode surface layering, slot style encapsulation, and `ViewEncapsulation.None` (#48)
- **Article:** `:visited` link indicator — double underline via `border-bottom` technique (#19)
- **Visual Design guidance:** New `docs/VISUAL-DESIGN.md` (#8)
- **Conscience:** New `docs/CONSCIENCE.md`
- **Docs:** Archived six internal/superseded documents to `docs/archive/` (#16)
- **Toast:** Message text bumped from `--font-size-sm` (14px) to `--font-size-md` (16px) for Tier 1 contrast compliance
- **A11Y:** Corrected over-aggressive 14px contrast audit — OKCA two-axis tier system applied correctly

---

## [2.2.0] - 2026-04-13

### Added

- **Pagination:** New `app-pagination` component — `<nav aria-label="Pagination">` with previous/next buttons and numbered page links. Current page receives `aria-current="page"` and filled accent treatment. Ellipsis collapses large page ranges, keeping first, last, and current ± 1 always visible. `currentPage` is a two-way bindable `model<number>`; `ariaLabel` input for multiple paginators on the same page (#26)
- **Disclosure:** New `app-disclosure` component — single show/hide toggle following the APG Disclosure pattern. Button carries `aria-expanded` and `aria-controls` wired to its content panel; caret rotates 180° on open. `open` is a two-way bindable `model<boolean>`. Suitable for FAQ lists, expandable filter sections, and "read more" patterns (#25)
- **Listbox:** New `app-listbox` component — custom select alternative using `role="listbox"` + `role="option"`. Trigger button shows selected value with `aria-haspopup="listbox"` and `aria-expanded`; dropdown uses `aria-activedescendant` to track keyboard focus without moving DOM focus from the listbox. Full keyboard contract: ArrowDown/Up, Home/End, Enter/Space to select, Escape to close, Tab to close, 500ms typeahead by first character. Disabled options, error/hint with `aria-live`, `ControlValueAccessor` for Angular forms. Label, placeholder, required, hint, and error inputs match `app-select` API (#23)
- **Drawer:** New `app-drawer` component — slide-in panel anchored to a viewport edge. Uses `<dialog>` for native focus trapping and Escape key handling. `position` input supports `right` (default), `left`, and `bottom`; `size` controls panel width (or height for bottom sheets). Entry animation via `@starting-style`; `prefers-reduced-motion` disables it. Emits `(closed)` on close-button click, Escape, or backdrop click. `dismissOnBackdrop` input can disable backdrop dismissal (#51)
- **Tabs:** Added `orientation="vertical"` variant. Tab list renders on the left with a right-edge active indicator; panels fill the remaining space. Keyboard navigation uses ArrowUp/Down in vertical mode; `aria-orientation` set on the tablist. Suited to settings panels and sidebar navigation (#52)
- **Combobox:** New `app-combobox` component — text input + filterable listbox dropdown implementing the APG `list` autocomplete pattern. `role="combobox"` on the input with `aria-expanded`, `aria-controls`, and `aria-activedescendant`; DOM focus stays on the input throughout. Filters options by substring match as the user types; shows all options when the field is empty. Keyboard: ArrowDown/Up navigate options, Enter selects the active option (or sole remaining match), first Escape closes the dropdown, second Escape clears the input, Tab closes. Clear button replaces the caret when text is present. `ControlValueAccessor` for Angular forms; API matches `app-listbox` (#24)

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
