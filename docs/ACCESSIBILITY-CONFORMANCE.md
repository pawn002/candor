# Accessibility Conformance Statement

**Product:** Candor Design System (`@candor-design/tokens` + `@candor-design/web-components`)
**Version:** 3.0.0
**Date:** 2026-05-13
**Standard:** Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
**Evaluation methodology:** Manual screen reader walkthrough (NVDA + Chrome) + Playwright accessibility tree snapshots across the 26-component audit set; the `@candor-design/web-components` library carries the same patterns and guarantees by construction (see note below)

> **3.0.0 note:** The original audit (2026-05-13) was conducted against the 26-component Angular reference library, which defined the minimum accessible feature set. That library has since been removed; `@candor-design/web-components` is now the sole, canonical component surface and carries the audited patterns forward. The audit findings below are retained as the validation record for those patterns.

---

## Conformance level

Candor 3.0.0 aims to **conform to WCAG 2.1 Level AA** for all components within scope, subject to the consumer responsibilities and known limitations described below.

---

## Scope

### Audited component set

This conformance statement covers the 26 components audited in `docs/A11Y-AUDIT.md`. These were audited on the original Angular reference implementations; `@candor-design/web-components` carries the same patterns forward (see the web components note below):

**Phase 1 — Custom composite widgets**
TonePicker, DataGrid, Modal, Tabs, Menu, Accordion

**Phase 2 — Form controls**
Input, Checkbox, Radio, Switch, Slider, ChatInput

**Phase 3 — Feedback & live regions**
Alert, Toast, Progress

**Phase 4 — Navigation & structural**
Navigation, Breadcrumb, Tooltip, Chip, Button

**Phase 5 — Display & typography**
Badge, Stat, Table, Card, Heading, AccessibleText / Text / Article

### Web components (`@candor-design/web-components`)

The 34 Lit custom elements in `@candor-design/web-components` are the canonical component surface. They implement the same ARIA patterns, keyboard contracts, live region approaches, and focus management that the 26-component audit validated, carrying those conformance targets forward by construction.

A formal screen reader walkthrough of the web components package as a whole has not been conducted as of v3.0.0; the AT-snapshot audit of the Storybook example stories (see `docs/A11Y-AUDIT.md`) is the most recent WC-specific validation. The following implementation notes apply:

- **Shadow DOM isolation:** ARIA relationships that cross shadow boundaries (e.g. `aria-labelledby` pointing to an element in light DOM) are not used; all ARIA relationships are contained within each component's shadow root or host element.
- **Form participation:** Form controls use the `ElementInternals` API, so values appear in `FormData` and the native validation APIs with no framework dependency.
- **`candor-article` light DOM:** The article component renders in light DOM (`createRenderRoot()`) so projected prose content is reachable by AT without any Shadow DOM wrapping.

Consumers who require a formal web components AT audit should conduct their own walkthrough using the Storybook `Components/`, `Typography/`, `Form/`, and `Examples/` stories as the test surface.

---

## What Candor guarantees

### Semantics and roles

Each component exposes correct ARIA roles, states, and properties for its interaction model. Custom widgets use the ARIA authoring practices patterns appropriate to their function (radio group, grid, dialog, tablist, menu, etc.).

### Accessible names

Every interactive element has an accessible name — either from a visible label, associated `<label>`, `aria-label`, or `aria-labelledby`. Components that wrap a native interactive element expose an `ariaLabel` input bound directly to the inner element.

### Keyboard navigation

All interactive components are fully keyboard-operable:
- Focusable via Tab / Shift+Tab
- Composite widgets (grids, tab sets, menus) implement the roving tabindex pattern with arrow key navigation
- Dialogs trap focus on open and restore it on close
- No keyboard traps outside of intentional modal dialogs

### Contrast

All color combinations meet WCAG 2.1 AA contrast requirements (≥ 4.5:1 for text, ≥ 3:1 for large text and UI components). Contrast was validated using CPQI CLI against WCAG 2.1, OKCA, and APCA algorithms. OKLCH color space is used throughout to ensure perceptually accurate lightness calculations.

Text at 14px and below is additionally validated against a three-tier use-case contrast system (see `docs/CONTRAST-TIERS.md`). Tier 1 (reading text) requires OKCA 9.5 regular / 6.5 bold; Tier 2 (functional UI) requires 6.5 / 4.5; Tier 3 (supplementary, meaning redundantly coded) requires 4.5 / 4.5. Passing OKCA also passes WCAG — zero false-pass guarantee.

### Live regions

Components that produce dynamic feedback — form errors, status messages, send confirmations, activation results — use pre-established live regions (`role="status"` with `aria-live="polite"` or `role="alert"` with `aria-live="assertive"`). Regions are present in the DOM before content arrives so assistive technology registers the mutation.

### Focus visibility

Focus indicators are visible on all interactive elements. Focus styles use the design system's token-based outline pattern and meet WCAG 2.1 AA focus visibility requirements.

### Responsive and zoom

Components are tested at up to 200% browser zoom without loss of content or functionality.

---

## Consumer responsibilities

Candor components are building blocks. Several accessibility requirements are architectural — they depend on how the consumer assembles components, not on the component implementation itself. The library cannot enforce these, but the Storybook stories for each component demonstrate the correct patterns.

| Pattern | Consumer responsibility | Reference story |
|---|---|---|
| Radio group labeling | Wrap `<app-radio>` groups in `<fieldset>` + `<legend>` | Components/Form/Radio — `RadioGroup`, `MultipleGroups` |
| Form field association | Associate labels with inputs via `for` / `id` when not using `<app-input>` | Components/Form/Alert — `InlineFormValidation` |
| Table headers and caption | Supply `<caption>` and `<th scope="row">` for key/value tables | Components/Table — `Default`, `Compact` |
| Badge context | Supply `badgeLabel` on `NavItem` to replace bare numbers with meaningful text | Components/Navigation — `WithBadges` |
| Slider value text | Supply `valueTextFn` when a slider's axis has domain-specific units or dynamic bounds | Components/Form/Slider — `GradientTrack` |
| Page structure | Supply `<main>`, `<nav>`, and landmark regions at the page level | Consumer application |
| Language declaration | Set `lang` attribute on `<html>` | Consumer application |

---

## Known limitations

### `:visited` link state — double-underline indicator (WCAG 1.4.1)

**Criterion:** 1.4.1 Use of Color (Level A)
**Status:** Partial — platform-limited; mitigated with structural cue

Browsers only allow color-value CSS properties inside `:visited` rules (`color`, `border-color`,
`outline-color`, etc.). Width, style, and layout properties are silently ignored to prevent
navigation-history side-channel attacks. `text-decoration-style: double` cannot be set in `:visited`.

**The mitigation:** Article links pre-declare `border-bottom: 1px solid transparent` in the base
rule. On `:visited`, only `border-bottom-color` changes (an allowed color property) — but the effect
is a second underline appearing beneath the existing `text-decoration` underline. The structural
signal is: single underline = unvisited, double underline = visited. This cue persists under
deuteranopia and protanopia (red-green CVD), where hue shift alone may be ambiguous.

**What the system provides:**
- Double-underline structural indicator (not purely color-dependent)
- Hue shift: azure (unvisited) → indigo (visited)
- Both colors independently pass contrast against their backgrounds (light and dark)

**Remaining limitation:** The indicator is still ultimately delivered via a color property change
(`border-bottom-color: transparent → visible`). A strict WCAG 1.4.1 interpretation requires
non-color means; the double-underline is a structural *effect* of a color change rather than a
truly independent non-color property. Consumers who need a fully color-independent indicator
should implement a JS-assisted pattern: intercept clicks, store visited URLs in `localStorage`,
apply a class (e.g. `.is-visited`). Class selectors have no `:visited` color restriction.

**Affected component:** Article (`app-article`) links only. No other component exposes `:visited` state.

---

### OKLCH browser support

OKLCH color values are not supported in all browsers. The design system currently targets modern Chromium-based browsers and Firefox 113+. Safari 15.4+. Older Chromium versions (pre-111), Samsung Internet, and IE do not support OKLCH. Hex fallback tokens are not yet provided. See roadmap.

### AT snapshot scope

The screen reader audit was conducted using NVDA 2024.x with Chrome (latest stable). VoiceOver (macOS/iOS), JAWS, TalkBack, and Narrator were not tested in the v1.0.0 audit cycle. Known divergences between NVDA+Chrome and other AT+browser combinations may exist, particularly for:
- The `<details>`/`<summary>` pattern (Accordion) — AT support varies by browser
- `role="grid"` keyboard model (DataGrid, TonePicker) — JAWS handles this differently than NVDA

### Composite widget complexity

Custom composite widgets (TonePicker, DataGrid, Modal, Tabs, Menu) required the most remediation during the audit and carry the highest ongoing risk. They are correct for the tested AT+browser combination but should be re-validated when the AT environment changes (major NVDA release, Chrome AT API changes).

---

## Testing methodology

All 26 components were audited in the following sequence:

1. **Static analysis** — markup read against ARIA authoring practices; role ownership rules, name computation, and state attribute correctness verified
2. **Live AT snapshot** — Playwright MCP `browser_snapshot` against the Storybook story iframe, capturing the accessibility tree as Chrome's DevTools protocol exposes it
3. **Attribute verification** — ARIA attributes not surfaced in the snapshot (e.g. `aria-valuetext`) verified via `browser_evaluate`
4. **Fix and re-snapshot** — issues resolved and snapshot re-taken to confirm the fix

Audit findings and per-component results are in `docs/A11Y-AUDIT.md`. Cross-cutting trends and authoring conventions derived from both the Angular-era and WC-era audits are in `docs/archive/A11Y-ANALYSIS.md`.

---

## Feedback and issue reporting

Accessibility issues should be reported via GitHub Issues with the label `a11y`. When reporting:

- Identify the component and story
- Identify the AT + browser combination
- Describe what was announced vs. what was expected
- If possible, include a Playwright AT snapshot

---

## Commitment to future conformance

The PR checklist in `.github/PULL_REQUEST_TEMPLATE.md` requires a screen reader walkthrough for any new composite widget before merge. This ensures the audit's findings become a gate, not a one-time event.

The breaking change policy in `docs/BREAKING-CHANGES.md` classifies ARIA structure changes as major version bumps, ensuring consumers are notified when the AT contract changes.
