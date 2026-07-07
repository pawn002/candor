# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **`@candor-design/web-components` consistent value events (DOM two-event rule):** value controls now emit events by the same rule the DOM uses, so there's nothing component-specific to memorise. **`change`** fires with the *committed* value on every value control (input, select, radio, checkbox, switch, slider, listbox, combobox, chip). **`input`** fires with the *live, mid-edit* value on the controls that have an editing phase — `candor-input` (per keystroke), `candor-slider` (per drag tick / arrow step), and `candor-combobox` (per filter-text keystroke), mirroring native `<input>` / `<input type="range">`. This converges the four historical value-changed names (`change`, `input-change`, `value-change`, `selected-change`) onto this rule. `candor-input`, `candor-slider`, and `candor-chip` keep emitting their legacy event with its original semantics so existing listeners keep working — deprecated, removed in the next major: `input-change` → `input` (live), `value-change` → `input` (live), `selected-change` → `change` (commit) (#164).
- **`@candor-design/web-components` published event types:** the TypeScript declarations now describe every component's events and `detail` shapes. New `events.ts` exports a `*Detail` type per event (e.g. `CandorSelectChangeDetail = string`, `CandorComboboxInputDetail = string`, `CandorChatInputSendDetail = { value: string }`) and a per-component `*EventMap` interface, re-exported from the package root. Consumers annotate handlers with a real type instead of grepping the minified bundle. `HTMLElementEventMap` is intentionally **not** globally augmented — `change`, `input`, and `toggle` already exist there as plain `Event`, and redefining them would mistype unrelated DOM code (#163).
- **`@candor-design/tokens` package entry points:** added `main`, `module`, `style`, and an `exports` map to the root `package.json` (the manifest published as `@candor-design/tokens`) so consumers can `@import "@candor-design/tokens/candor-tokens.css"` instead of the internal filesystem path `@candor-design/tokens/tokens/candor-tokens.css`. Previously `main`/`module`/`exports` were all `null`. Maps `.`, `./candor-tokens.css`, `./candor-tokens.min.css`, and `./candor-tokens.json` to their emitted paths under `tokens/` (#168).
- **`candor-drawer` non-modal mode:** new `modal` boolean attribute (default `true`, preserving current behavior). Set `modal="false"` for a non-modal side panel that coexists with the page — it opens via `dialog.show()` instead of `showModal()`, so there is no backdrop, focus is not trapped or stolen, and the rest of the page stays interactive (the full-viewport dialog layer is made `pointer-events: none` so only the panel captures clicks). For persistent assistants, inspectors, and filters that you work alongside (#166).

### Fixed

- **`candor-checkbox`:** fixed unresponsive taps/clicks on mobile (iOS/Android). The visually-hidden native `<input type="checkbox">` used `width: 0; height: 0`, which some mobile browsers exclude from hit-testing entirely — tapping the label or visible box silently did nothing. Switched to the standard 1px/clip-rect visually-hidden pattern (`width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap`), which keeps the input a real, laid-out (if imperceptible) element so it remains tappable while staying visually hidden (#110).
- **`candor-tooltip`:** the hidden bubble no longer contributes to the host's `scrollWidth`. It was `position: absolute; white-space: nowrap`, hidden only via `opacity: 0; visibility: hidden` — CSS properties that suppress paint but not layout, so the bubble's full (unwrapped) intrinsic width still counted toward the host's scrollable overflow region, and `left: 50%; transform: translateX(-50%)` centering pushed half of that leaked width past each edge of the host. In tight `min-width: 0` flex/grid containers this surfaced as a stray horizontal scrollbar on an ancestor scroll container even though the tooltip was never shown. The bubble now uses `display: none` when hidden (removing it from layout entirely) and fades via `@starting-style` + `transition-behavior: allow-discrete` — the same technique `candor-drawer` uses for its `dialog[open]` transitions — so the hover/focus opacity transition is unchanged. This also resolves `candor-toolbar` showing horizontal and vertical scrollbars when its direct children are `candor-tooltip` wrappers: the toolbar's `overflow-x: auto` row was reacting to the tooltip bubbles' leaked width, not a toolbar sizing bug (#107, #175).
- **Release tooling:** the root `version` npm lifecycle script no longer relies on POSIX `$npm_package_version` shell expansion, which broke every release cut from Windows (npm runs lifecycle scripts under `cmd.exe` there by default, where `$npm_package_version` is a literal string). Replaced with `scripts/sync-wc-version.js`, a small Node script that reads `process.env.npm_package_version` directly and spawns `npm --prefix web-components version` itself — behaves identically under `cmd.exe` and bash (#161).

## [4.1.0] - 2026-06-16

### Added

- **`candor-pagination` `compact` attribute** — opt-in compact layout (`‹ Prev · Page X of Y · Next ›`) that drops the numbered page buttons and ellipses for narrow viewports. Set it from a media/container query in a responsive app; defaults to `false` (the full numbered layout is unchanged). The "Page X of Y" position text is a polite live region, so screen readers announce the new page after Prev/Next. Prev/Next keep their existing disabled logic and `page-change` events (#152).
- **`--color-slider-thumb`** token — the slider handle fill, themed per mode (white in light, light grey `oklch(0.91)` in dark) so the thumb reads as a light puck in both themes. Non-text token (paired with `--color-border-control` for the edge).

### Changed

- **Tests (no consumer impact):** Rewrote `tests/accessibility.spec.ts` to target the web components — it now loads each story's canvas directly (`iframe.html?id=…&viewMode=story`) and uses shadow-piercing `candor-*` selectors instead of the dead Angular `app-*` locators on the Storybook manager page. Removed the two screenshot-only specs (`visual-regression.spec.ts`, `storybook-snapshots.spec.ts`) as redundant with Chromatic, the visual gate on every PR. Wired the suite into CI as a new `accessibility` job so the behaviour Chromatic can't see (keyboard / focus / ARIA) is gated on every PR (#148).
- **Tooling (no consumer impact):** Migrated the Storybook build harness from `@storybook/angular` to `@storybook/web-components-vite` and retired the Angular toolchain entirely (#143). Candor has shipped no Angular components since 3.0.0 — Angular survived only as the Storybook renderer for the framework-agnostic web-component stories. The 47 story files now render via lit-html (`render: (args) => html\`…\``) instead of Angular `template:` strings. Removed `angular.json`, the Angular bootstrap shell (`src/app/`, `src/main.ts`), the Angular tsconfigs, and the `@angular/*`, `@angular-devkit/build-angular`, `zone.js`, and `rxjs` dependencies. This dissolves the TypeScript 5 / Angular &lt; 22 version ceiling that blocked #141 and removes the bulk of the dev-time `npm audit` advisories (all of which traced through the Angular/webpack toolchain). The published `@candor-design/tokens` and `@candor-design/web-components` packages are unaffected.

### Fixed

- **`candor-alert`:** the `message` attribute now renders even when the element has whitespace between its tags (`<candor-alert message="…">\n</candor-alert>`). Previously `message` was the fallback content of an internal `<slot>`, which a whitespace-only child text node suppressed — rendering a blank alert body. `message`, when set, now renders directly; the slot is used only for projected content. (Surfaced by the #143 migration: Angular stripped insignificant whitespace text nodes, lit-html preserves them.)
- **`candor-menu`:** the checked-item checkmark is no longer rendered upside-down (it read as an upward caret). The `phCheckBold` icon path was vertically flipped; corrected so the tick points down-right.
- **`candor-toolbar`:** a full horizontal toolbar now scrolls within its own bounds on narrow viewports (`max-width: 100%; overflow-x: auto`) instead of overflowing the page. Items keep their natural size (`flex-shrink: 0`) so the row scrolls rather than squashing; roving-tabindex navigation already scrolls focus into view (#152).
- **`candor-data-grid` / `candor-tone-picker`:** the grid now scrolls horizontally within its own bounds on narrow viewports instead of overflowing the page.
- **`candor-toast`:** no longer overflows narrow viewports — `box-sizing: border-box` plus `min(…, 100%)` width caps keep the toast within its container so its text wraps.
- **`candor-slider`:** the thumb is now visible in dark theme. It previously filled with `--color-bg-page` and used a hard-coded black border/shadow, so in dark mode the handle became the page colour and disappeared. It now uses the themed `--color-slider-thumb` fill with a `--color-border-control` edge.

---

## [4.0.0] - 2026-06-05

### Breaking

- **Tokens:** Primitive color ramp `--purple-*` renamed to `--indigo-*` across all ten steps (`--indigo-50` through `--indigo-900`). The hue (H=278.14) is perceptually indigo, not purple. Consumers who reference primitive tokens directly (against the two-tier architecture recommendation) must find-replace `--purple-` → `--indigo-`. Semantic tokens (`--color-highlight`, `--color-highlight-decorative`, `--color-link-visited`) are unchanged and require no consumer action.
- **Tokens package:** `candor-article.css`, `candor-article.min.css`, `candor-blog.css`, `candor-blog.min.css`, `candor-syntax.css`, and `candor-syntax.min.css` removed from the `@candor-design/tokens` published package. These class-based stylesheets were outside the scope of a token package (CSS custom properties only); the `<candor-article>` web component is the canonical prose surface. No known consumers — if you were using these files, migrate to the equivalent `@candor-design/web-components` component or copy the source SCSS from `src/design-tokens/` in the repository.

### Added

- **`@candor-design/web-components` 4.0.0** — first published release of the Candor web components package. Ships 34 Lit 3 custom elements. Version aligned to `@candor-design/tokens` so a single version number describes the full design system. Separate npm package keeps Lit out of consumers who only need tokens.
  - **Custom elements:** `candor-badge`, `candor-alert`, `candor-card`, `candor-stat`, `candor-progress`, `candor-heading`, `candor-text`, `candor-accessible-text`, `candor-article`, `candor-button`, `candor-chip`, `candor-breadcrumb`, `candor-pagination`, `candor-toolbar` + `candor-toolbar-separator`, `candor-navigation`, `candor-input`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`, `candor-chat-input`, `candor-tooltip`, `candor-modal`, `candor-drawer`, `candor-toast` + `candor-toast-container`, `candor-tabs` + `candor-tab-panel`, `candor-accordion-item`, `candor-disclosure`, `candor-menu`, `candor-table`, `candor-data-grid`
  - Form controls use the `ElementInternals` API (`static formAssociated = true`) — values appear in `FormData`, constraint validation works, `:disabled` styling applies correctly
  - CSS custom properties pierce Shadow DOM boundaries — `candor-tokens.css` loaded once at the document level resolves inside all shadow roots; no per-component injection required
  - `candor-article` uses light DOM so prose styles reach projected content without the shadow boundary
  - Build: `npm run build:wc` — Vite lib build producing ESM (165 kB) and UMD (151 kB) bundles with TypeScript declaration files; `./tone-data` subpath export for tree-shakeable tone-picker data
- **`candor-article`:** `justify` attribute — enables full justification + hyphenation on `<p>` elements. Typographic transparency feature: the formal block-edge register marks AI-generated prose as a produced document without a label. Requires `lang` on the element or an ancestor for `hyphens: auto` to resolve hyphenation dictionaries.
- **`candor-stat`:** `size` prop — `sm` (25px), `md` (31px, default), `lg` (39px). Allows stat heroes to scale with layout context without hand-rolling font sizes.
- **`candor-input`:** `autocomplete` prop — forwards the `autocomplete` attribute to the inner `<input>`. `Password` story sets `current-password` by default.
- **`candor-modal`:** `alert` boolean prop — sets `role="alertdialog"` on the inner `<dialog>` for destructive confirmation patterns where the dialog requires an immediate response.
- **`candor-menu`:** `align` prop (`left` | `right`) — controls which edge of the panel aligns with the trigger. Icon-only trigger mode (no label, accessible via `aria-label`). Checked item support via `menuitemradio` for sort-by and single-select option groups.
- **`candor-tabs`:** Scroll arrow buttons appear automatically when the tab row overflows its container. Arrows advance by one tab per click; focused tab auto-scrolls into view on arrow-key navigation. Reduces dependence on horizontal scroll gesture discovery.
- **`candor-tone-picker`:** CIEDE2000 AT labels — each swatch announces its perceptual distance from the nearest named color in addition to its OKLCH coordinates. `show-labels` attribute renders the label text visibly beneath each swatch (developer/audit mode). `/tone-data` subpath export provides the underlying color-name dataset for consumers building custom pickers.
- **`candor-slider`:** CSS custom properties `--candor-slider-track-height`, `--candor-slider-thumb-size`, and `--candor-slider-gradient-height` exposed for consumer overrides without subclassing.
- **Tokens:** `--color-border-control-on-surface` — WCAG 1.4.11 compliant border color for form controls placed on `--color-bg-surface` backgrounds (the existing `--color-border-control` is validated against page background only).
- **Tokens:** Component-level CSS custom properties for drawer (`--candor-drawer-width-*`), modal (`--candor-modal-width-*`), and toast (`--candor-toast-width`) exposed for consumer sizing overrides.

### Removed

- **Angular reference component library** (`src/app/components/`, `src/app/examples/`) removed. It was an internal feature-parity benchmark; with WC parity confirmed it has served its purpose. **No consumer impact** — the Angular library was never published. `@candor-design/web-components` is the sole canonical component surface; Angular consumers use the framework-agnostic custom elements with `CUSTOM_ELEMENTS_SCHEMA`.
- **`@candor-design/tokens`:** `candor-article.css/.min.css`, `candor-blog.css/.min.css`, `candor-syntax.css/.min.css` removed from the published package (see Breaking above).

### Fixed

- **Tokens (WCAG 1.4.11 non-text contrast):** Light-mode status icon colors darkened to meet the 3.0 non-text floor against their tinted `-bg` backgrounds: `--color-status-success` → `oklch(0.55 0.15 144.2)` (OKCA 2.0 → 3.0), `--color-status-warning` → `oklch(0.54 0.16 53.54)` (OKCA 1.7 → 3.0), `--color-status-error` → `oklch(0.54 0.22 25)` (OKCA 2.9 → 3.0). The `-text` and `-bg` variants and dark mode are unaffected.
- **Tokens:** Remaining off-grid raw values snapped to the nearest spacing token across 10 components. Component-level `px`/`rem` literals replaced with `var(--spacing-*)`, `var(--border-width-*)`, and `var(--letter-spacing-*)` references.
- **Tokens:** Stale OKCA annotations corrected on dark-mode `--color-action-secondary-*` tokens.
- **`candor-drawer` (screen reader):** Closed drawer now sets `inert` on the host element — slotted light-DOM controls no longer appear in the accessibility tree when the drawer is closed.
- **`candor-tabs` / `candor-tab-panel` (screen reader):** Replaced cross-shadow-root `aria-labelledby` (which cannot cross shadow boundaries) with `aria-label` fed via a new `tabLabel` property. Tab panels now have accessible names.
- **`candor-radio`:** Mutual exclusion and arrow-key navigation now work correctly across shadow-DOM siblings. Each `candor-radio` is in its own shadow root so the browser cannot group shared-`name` inputs into a mutually exclusive set; the component implements both behaviors itself by querying sibling `<candor-radio name="…">` elements within the nearest `<fieldset>`.
- **`candor-progress`:** Host `aria-label` now forwarded to the inner `role="progressbar"` element via the `observeHostAriaLabel` helper, preventing a doubled accessible name.
- **`candor-table`:** Becomes a horizontal scroll container when content overflows narrow viewports. Numeric column alignment prop added (`numeric-columns`) — right-aligns specified columns for tabular figures.
- **`candor-badge`:** `md` size corrected to `--font-size-md` (16px) — was incorrectly using `--font-size-sm` (14px), which placed it below the readable floor for regular-weight text at that size.
- **`candor-button`:** All sizes now render at bold weight (700) — optical sizing (`opsz` axis) handles the visual refinement per size, removing an artificial weight inconsistency between sizes. `white-space: nowrap` added to prevent label text wrapping in constrained layouts.
- **`candor-input` / `candor-combobox` / `candor-listbox` / `candor-select`:** Hint text moved above the input following the GOV.UK Design System pattern — users encounter the hint before interacting with the field. Hint and error now coexist simultaneously (`aria-describedby` references both). `observeHostAriaLabel` wired on combobox, listbox, and select so `aria-label` on the host reaches the inner control without doubling.
- **`candor-input` / `candor-combobox`:** `setValidity()` wired for required constraint validation — `:invalid` pseudo-class and form validation APIs work correctly.
- **`candor-checkbox` / `candor-radio` / `candor-switch` / `candor-slider` / `candor-select` / `candor-combobox` / `candor-listbox`:** `setFormValue()` now called in `updated()` so initial and programmatic property changes register correctly in `FormData` without requiring a user interaction.
- **`candor-accessible-text`:** `size` prop made optional — role defaults (14px) are no longer silently overridden when size is omitted. Styles moved to `:host` selectors for accurate DevTools inspection.
- **`candor-accordion-item`:** Quiet variant now uses `font-optical-sizing: auto` + `GRAD -150` for visual weight differentiation, replacing the numeric `font-weight` step that felt engineered rather than designed.
- **Build (`@candor-design/web-components`):** `npm run build:wc` failed under Vite 7 when UMD and ESM entry points were combined. The main library and `tone-data` entry are now built in two separate Vite passes. The `./tone-data` subpath in the `exports` map now resolves correctly for consumers.

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
