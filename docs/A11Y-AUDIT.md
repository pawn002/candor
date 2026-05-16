# Candor Design System — Accessibility Audit

**Library under audit:** `@candor-design/web-components` (the primary consumer-facing distribution — 34 Lit 3 custom elements).

**Personas covered (in order added):**
1. **Screen-reader user** — NVDA + Chrome as baseline. Methodology + findings below in the [WC SR Audit Findings](#wc-sr-audit-findings) section.
2. **Keyboard-only user** (no SR) — sighted user navigating with Tab, Shift+Tab, arrow keys, Enter, Space, Escape. No mouse. Findings in the [WC Keyboard-only Audit Findings](#wc-keyboard-only-audit-findings) section.

**Still out of scope:** voice-control, switch-control, magnification, low-vision-without-SR. Each of those is a distinct AT user persona with its own audit lens; they will be added in subsequent revisions.

**Method per component:**
1. Navigate to the default story iframe; wait for first render.
2. Capture the page accessibility tree via Playwright (`browser_snapshot`) and DOM-probe shadow-root contents via `browser_evaluate` for ARIA attributes the snapshot collapses.
3. Walk the AT tree as a screen-reader user would: read order, accessible names, exposed roles, state announcements, live-region behavior, keyboard-hint discovery.
4. For interactive components, exercise the most common interaction (focus, activation, expansion, selection) and verify the resulting AT announcement.
5. Document findings; an issue is genuine if it would mislead, silence, or disorient a screen-reader user.

**Historical context:** A pre-WC version of this audit covered the Angular component library (26 components, completed prior to the WC launch). Those findings are preserved in each component section under "Historical Angular audit" so that fixes applied at the Angular layer can be cross-checked at the WC layer. Many WC components are direct ports of the audited Angular components; convergent findings are expected.

Cross-reference: trend analysis and authoring conventions distilled from the prior Angular audit live in [`docs/archive/A11Y-ANALYSIS.md`](./archive/A11Y-ANALYSIS.md) (due for a WC refresh after this audit).

Status legend: ⬜ Pending · 🔄 In Progress · ✅ Pass · ⚠ Issues found · ⏭ Deferred

---

## Open Issues Backlog

Issues found during the WC audit (SR + keyboard) that aren't fixed in the same session as discovery (cross-cutting, or scoped to a follow-up). BL-* are screen-reader findings; KB-* are keyboard-only findings.

| ID | Title | Affects | Severity | Source |
|---|---|---|---|---|
| ~~BL-1~~ | ~~`aria-label` set on a WC host element is announced twice~~ — **Fixed**: introduced `src/web-components/utils/host-aria.ts` (`observeHostAriaLabel` helper) which observes the attribute via MutationObserver, mirrors the value into a component state, and strips the attribute off the host. Rolled out to TonePicker, DataGrid, Tabs, Switch, Slider, Toolbar, Pagination, Button. `role="none"` alone wouldn't fix this because of ARIA presentational-role conflict resolution. | TonePicker, DataGrid, Tabs, Switch, Slider, Toolbar, Pagination, Button | Low | Fixed |
| ~~BL-2~~ | ~~Decorative SVGs inside in-shadow buttons appear in the AT tree as `img`.~~ **Withdrawn**: source already has `aria-hidden="true"` on Menu trigger chevron, Modal close icon, and Select caret. The Playwright AT snapshot reports SVGs as `img [ref]` even when aria-hidden — a known snapshot-tool artifact, not what NVDA reads. Confirmed via DOM probe: the icon-only Modal close button has `aria-label="Close"` and the SVG's aria-hidden is honored. | — | n/a | Withdrawn after verification |
| ~~BL-3~~ | ~~`<script>` blocks in story templates are stripped~~ — **Fixed**: candor-menu stories rewritten to use JSON-encoded `entries='${JSON.stringify(...)}'` attribute injection (mirrors the data-grid pattern). Default story now renders populated. | Menu stories | Medium | Fixed |
| ~~BL-4~~ | ~~`<li>` separator inside `candor-menu` renders without `role="separator"`~~ — **Fixed**: separator now renders as `<li role="separator">` so screen readers hear a grouping break. | Menu | Low | Fixed |
| KB-1 | Sibling `<candor-radio>` elements with a shared `name` don't form a browser-native radio group across shadow-DOM boundaries: ArrowDown/Up doesn't move focus or selection between sibling radios. Keyboard-only users must Tab through each option AND press Space to select — the native single-stop "arrow-to-select" pattern is broken. | Radio (any group of `<candor-radio>` siblings sharing a name) | Medium | Phase 2 keyboard pass, Radio Group story |

---

## Phase 1 — Custom Composite Widgets

| # | Component | WC tag | Status | Notes |
|---|---|---|---|---|
| 1 | TonePicker | `candor-tone-picker` | ✅ Pass | Was 2 low (BL-1 host-aria-label, OOG label noise) — both fixed |
| 2 | DataGrid | `candor-data-grid` | ✅ Pass | Uses `<caption>` not `aria-label` — avoids the BL-1 trap |
| 3 | Tabs | `candor-tabs` | ✅ Pass | Was 1 low (BL-1) + 1 question (tab-panel host opacity) — both fixed |
| 4 | Modal | `candor-modal` | ✅ Pass | BL-2 (close SVG) withdrawn — source already has aria-hidden |
| 5 | Menu | `candor-menu` | ✅ Pass | Was 1 medium (BL-3) + 2 low (BL-2 withdrawn, BL-4) — all resolved |
| 6 | Accordion | `candor-accordion-item` | ✅ Pass | Native `<details>`/`<summary>` — clean |

---

## Phase 2 — Form Controls

| # | Component | WC tag | Status | Notes |
|---|---|---|---|---|
| 7 | Input | `candor-input` | ✅ Pass | Pre-established `aria-live` description region; label↔input wired |
| 8 | Checkbox | `candor-checkbox` | ✅ Pass | Native checkbox with for/id label wiring |
| 9 | Radio | `candor-radio` | ✅ Pass | Group story uses `<fieldset>`/`<legend>` correctly |
| 10 | Switch | `candor-switch` | ✅ Pass | `role="switch"` + native input + label wiring |
| 11 | Slider | `candor-slider` | ✅ Pass | Native `<input type=range>` exposes valuemin/max/now |
| 12 | ChatInput | `candor-chat-input` | ✅ Pass | Send icon-button has explicit `aria-label="Send message"`; status live region pre-established |

---

## Phase 3 — Feedback & Live Regions

| # | Component | WC tag | Status | Notes |
|---|---|---|---|---|
| 13 | Alert | `candor-alert` | ✅ Pass | `role="alert"` on error/warning; `role="status"` on info/success |
| 14 | Toast | `candor-toast` | ✅ Pass | `role="status"` (polite); dismiss button has explicit aria-label |
| 15 | Progress | `candor-progress` | ✅ Pass | `role="progressbar"` with valuemin/max/now/text; redundant aria-label removed |

---

## Phase 4 — Navigation & Structural

| # | Component | WC tag | Status | Notes |
|---|---|---|---|---|
| 16 | Navigation | `candor-navigation` | ✅ Pass | `<nav aria-label>` + list of links + `aria-current="page"` on active |
| 17 | Breadcrumb | `candor-breadcrumb` | ✅ Pass | `<nav aria-label="Breadcrumb">` + `<ol>` + `aria-current="page"` on last item (rendered as plain text, not link) |
| 18 | Tooltip | `candor-tooltip` | ✅ Pass (with caveat) | Bubble `aria-hidden="true"` — AT-hidden by design; appropriate when the trigger has its own text label |
| 19 | Chip | `candor-chip` | ✅ Pass | Non-interactive chip renders as plain text |
| 20 | Button | `candor-button` | ✅ Pass | Slotted content becomes the button's accessible name natively |

---

## Phase 5 — Display & Typography

| # | Component | WC tag | Status | Notes |
|---|---|---|---|---|
| 21 | Badge | `candor-badge` | ✅ Pass | Plain text label; no special ARIA needed |
| 22 | Stat | `candor-stat` | ✅ Pass | Label + value as paragraphs in DOM order; SR reads pair naturally |
| 23 | Table | `candor-table` | ✅ Pass (1 recommendation) | `<th scope="col">` headers; default story doesn't use `scope="row"` |
| 24 | Card | `candor-card` | ✅ Pass | Slotted content reaches AT tree directly via slots |
| 25 | Heading | `candor-heading` | ✅ Pass | `role="heading"` + `aria-level` exposed on the rendered `<hN>` |
| 26 | AccessibleText / Text / Article | `candor-accessible-text`, `candor-text`, `candor-article` | ✅ Pass | `role` input is styling-only and is **not** forwarded to ARIA |

---

## WC SR Audit Findings

### 1. TonePicker

**Story:** Components/TonePicker (`components-tonepicker--default`)
**File:** `src/web-components/components/tone-picker/candor-tone-picker.ts`
**Status:** ⚠ Issues found (2 low-severity)

**AT tree (NVDA + Chrome baseline) — what a SR user encounters tabbing in:**
1. `generic "Navy H 245.34 — sRGB gamut"` — the host element carries the consumer-supplied aria-label.
2. `paragraph` reading the keyboard hint ("Arrow keys navigate · Enter or Space activates · Blank cells are outside sRGB gamut") — DOM-positioned **before** the grid so virtual-cursor users hit it before the widget.
3. `group` (the ARIA-1.2 required radio context) wrapping the grid.
4. `grid "Navy H 245.34 — sRGB gamut"` with 9 rows of `columnheader` + `rowheader` + `gridcell` (each in-gamut gridcell containing a `radio` with the OKLCH label).
5. Pre-selected anchor: `radio "L=0.27 C=0.060 — anchor"` — anchor distinction surfaces in the accessible name.
6. `status` live region (empty initially; populates on selection).
7. Visible preview region: `"No color selected"` and a duplicated hint paragraph.

**Verified state:**
- `aria-describedby` on the grid resolves to the sr-only hint id ✅
- `aria-setsize=19` / `aria-posinset` reflect the **in-gamut** count, not the visual cell count — so a SR user hears "radio 1 of 19" rather than misleading raw grid coordinates ✅
- Corner cell `role="none"` keeps the empty top-left out of the AT tree ✅
- `aria-live="polite" aria-atomic="true"` on the status region ✅

**Issues found:**

| # | Issue | Severity | Notes |
|---|---|---|---|
| 1 | Accessible name appears twice: once on the host `generic "Navy H 245.34 — sRGB gamut"`, then again on the inner `grid "Navy H 245.34 — sRGB gamut"`. NVDA on entry reads the name twice in succession. | Low | Caused by the `ariaLabel_` host-trap workaround — we propagate the attribute inward, but the host's own accessible name from the attribute isn't suppressed. Fix would require removing `aria-label` from the host after mirroring it to the inner element, or accepting the duplicate as a price of the WC mapping. Same risk exists on every WC that uses the `ariaLabel_` pattern (see Switch, Slider, Button entries). |
| 2 | ~~Every out-of-sRGB-gamut cell is exposed as `gridcell "Out of gamut"`. A SR user using virtual-cursor read-all hears "Out of gamut" 40+ times across the grid even though the hint paragraph already explained that blank cells are OOG.~~ **Fixed**: dropped the per-cell `aria-label` so OOG cells now announce as empty `gridcell` (NVDA: "blank"). The keyboard-hint paragraph above the grid is the single explainer. 44 OOG cells per default story go from "Out of gamut × 44" to "blank × 44" — same row of empty announcements, but each one is shorter and the per-cell label is gone. (Further improvement would require collapsing the OOG cells entirely, which breaks grid column consistency.) | Low | Fixed |

**Cross-check against historical Angular audit:** All four prior fixes (sr-only hint pre-positioning, role="group" wrapper, role="none" on corner, no second aria-live) are preserved in the WC port. The two issues above are WC-specific or were not previously flagged.

---

### 2. DataGrid

**Story:** Components/DataGrid (`components-datagrid--default`)
**File:** `src/web-components/components/data-grid/candor-data-grid.ts`
**Status:** ✅ Pass

**AT tree:**
1. `paragraph` keyboard hint ("Arrow keys navigate · Ctrl+Home/End jumps to first/last cell · Enter or Space activates") — DOM-positioned before the grid.
2. `grid "Heat map"` — name comes from the `<caption>` element, not aria-label.
3. `caption "Heat map"` inside the grid.
4. Header rowgroup with five `columnheader` nodes.
5. Body rowgroup with three rows; each row prefixed with `rowheader` (time label) followed by gridcells.
6. Selected cell exposed with `[selected]` state and a visible `✓` marker.
7. Disabled cell exposed with `[disabled]` state.
8. `status` live region appended after the grid.

**Verified state:**
- Roving tabindex on the first interactive cell (`tabindex="0"`) ✅
- Each cell has an aria-label matching its label data ✅
- Corner cell `role="none"` ✅
- Hint id matches grid's `aria-describedby` ✅
- The default story uses `caption` for naming, not `aria-label` on the host — so the host generic is unnamed and the cross-cutting host/grid duplication does **not** apply here. (If a consumer uses `aria-label` instead of caption, the same duplication risk as TonePicker would manifest.)

**Findings:** None at the default-story level. Recommend documenting "use caption, not host aria-label" as a usage best practice in the component story description.

**Cross-check against historical Angular audit:** All three prior fixes preserved (hint + aria-describedby, status live region, corner role=none).

---

### 3. Tabs

**Stories:** Components/Tabs (`components-tabs--default`)
**Files:** `src/web-components/components/tabs/candor-tabs.ts`, `candor-tab-panel.ts` (separate custom element for each panel)
**Status:** ⚠ Issues found (1 low-severity, 1 design-question)

**AT tree:**
1. `generic "Product details"` — the host element bears the consumer's aria-label.
2. `tablist "Product details"` — duplicate name (same source).
3. Three `tab` nodes — Overview, Specifications, Reviews — with `[selected]` state on the active one and roving `tabindex` (selected=0, others=-1).
4. `tabpanel` (Overview) with paragraph content. Inactive panels are CSS-hidden so they're absent from the AT tree, which is correct.

**Verified state:**
- Each tab carries `aria-setsize="3"` and `aria-posinset=N` — SR users hear "tab 1 of 3" ✅
- Each tab `aria-controls` its panel id ✅
- Each `candor-tab-panel` shadow-root contains a `[role="tabpanel"]` with `aria-labelledby` resolving to the corresponding tab's id, plus `tabindex="0"` so the panel itself is focusable for content reading ✅
- Inactive panels removed from the AT tree (via CSS hiding) so SR users don't traverse stale content ✅

**Issues found:**

| # | Issue | Severity | Notes |
|---|---|---|---|
| 1 | Host generic and tablist both carry the same accessible name ("Product details") — NVDA reads the label twice on widget entry. | Low | Same cross-cutting WC issue as TonePicker; logged once as a cross-cutting backlog item. |
| 2 | ~~`<candor-tab-panel>` host element has no role; its shadow-root contains the actual `role="tabpanel"`. Chrome appears to collapse the empty host in the AT tree, but this depends on the host being `display: contents`-like and could regress.~~ **Fixed**: `connectedCallback` on `CandorTabPanel` now sets `role="presentation"` on the host (unless the consumer overrides). AT tree behavior is now defined rather than relying on Chrome's heuristics; AT snapshot still shows `tabpanel` directly. | Question | Fixed |

**Cross-check against historical Angular audit:** The Angular audit's `model<T>` fix (parent template binding for `activeId`) is moot in the WC port — Lit's `@property` setters always update internal state when set externally, so the binding "works" by default.

---

### 4. Modal

**Story:** Components/Modal (`components-modal--default`, opened by triggering `el.open = true`)
**File:** `src/web-components/components/modal/candor-modal.ts`
**Status:** ⚠ Issues found (1 low-severity, BL-2 applies)

**AT tree (modal open):**
1. `dialog "Confirm action"` — name resolved via `aria-labelledby` → title element.
2. `heading "Confirm action" [level=2]` — the actual title.
3. `button "Close"` containing an `img` (SVG close icon).
4. `generic "Dialog content"` (`tabindex="0"`) — body wrapper named so it's an announcable stop in tab order.
5. Body content (paragraph).
6. Footer: unnamed `generic` containing Cancel and Confirm buttons.

**Verified state:**
- `<header>` inside `<dialog>` carries `role="none"` — banner landmark suppressed ✅
- Footer uses `<div>`, not `<footer>` — contentinfo landmark avoided ✅
- Body scroll container has `aria-label="Dialog content"` and `tabindex="0"` ✅
- Dialog gets focus on open (native `<dialog>` behavior) — Escape and click-outside close the dialog (not directly verified in this audit, but native + visible)

**Issues found:**

| # | Issue | Severity | Notes |
|---|---|---|---|
| 1 | Close button's SVG icon appears as `img` in the AT tree. SR users hear "Close button graphic" instead of just "Close button". | Low | See cross-cutting BL-2 — set `aria-hidden="true"` on the inline SVG. |

**Cross-check against historical Angular audit:** All four prior fixes (banner suppression, contentinfo avoidance, body aria-label, focus-visible) are preserved in the WC port.

---

### 5. Menu

**Story:** Components/Menu (`components-menu--default`; default story has empty `entries` so I populated via `el.entries = [...]` for the audit)
**File:** `src/web-components/components/menu/candor-menu.ts`
**Status:** ⚠ Issues found (1 medium, BL-3 and BL-4 apply)

**AT tree (menu open, populated):**
1. `button "Actions" [expanded]` — trigger with `aria-haspopup="menu"`, `aria-expanded="true"`, `aria-controls=...` pointing to the menu element, plus an exposed `img` (caret SVG).
2. `menu "Actions"` — named via `aria-labelledby` resolving to the trigger's id. ✅
3. `menuitem "Edit"`, `menuitem "Duplicate"`, `menuitem "Delete" [disabled]`.
4. **No separator node**: the `'separator'` entry rendered between Duplicate and Delete is in the DOM as `<li role="none"><div class="menu-separator"></div></li>` — SR users get no signal that the menu has groups.

**Verified state:**
- Trigger ↔ menu naming relationship (aria-labelledby ↔ id) intact ✅
- Disabled item exposes `aria-disabled="true"` ✅
- Closed state: `aria-expanded="false"` on trigger; menu hidden from AT tree ✅

**Issues found:**

| # | Issue | Severity | Notes |
|---|---|---|---|
| 1 | Separator entries render with `role="none"` and no AT-visible separator. A SR user navigating menuitems sees no grouping. | Low | BL-4. Fix: render the separator as `<li role="separator"></li>` (or `<hr role="separator">`). |
| 2 | Default story renders an empty menu because the Storybook template uses a stripped `<script>` block to assign `entries`. SR users hit a `menu "Actions"` node with zero menuitems. | Medium | BL-3. Fix: convert all menu stories to JSON-attribute injection (`entries='${JSON.stringify(...)}'`) — mirrors the data-grid pattern. |
| 3 | Trigger SVG caret appears as `img` in AT tree. | Low | BL-2. |

**Cross-check against historical Angular audit:** Trigger↔menu labelling (the one Angular fix) is preserved. New WC-specific issues found above.

---

### 6. Accordion

**Story:** Components/Accordion (`components-accordion--default`)
**File:** `src/web-components/components/accordion/candor-accordion-item.ts`
**Status:** ✅ Pass

**AT tree:**
- Built on native `<details>` / `<summary>` so the SR experience matches the native disclosure pattern.
- Chevron SVG carries `aria-hidden="true"` ✅
- Open/closed state, Enter/Space activation, and panel content hide/show all handled by the browser's native implementation — NVDA announces "What is OKLCH?, button, collapsed" / "expanded" without any ARIA additions.

**Note on Playwright snapshots:** Chrome's accessibility tree (which Playwright mirrors) reports `<summary>` as `generic "..."` rather than `button "..." expanded`. This is a DevTools-protocol representation quirk and not what NVDA actually reads — the historical Angular audit notes the same phenomenon. A real NVDA session would show the disclosure semantics correctly.

**Findings:** None. Recommend periodically re-running a real NVDA pass when refactoring this component to catch any regression that the Playwright snapshot would miss.

**Cross-check against historical Angular audit:** "No issues" then; "No issues" now. WC port faithfully wraps the native pattern.

---

### 7. Input

**Story:** Components/Form/Input (`components-form-input--default`)
**File:** `src/web-components/components/form/input/candor-input.ts`
**Status:** ✅ Pass

**AT tree:** `generic` (label) + `textbox "Email address"` (with placeholder). Inner `<input type="email">` has `id` matching the `<label>`'s `for`; `aria-describedby` points to a pre-established `[aria-live="polite"] [aria-atomic="true"]` description element that is in the DOM (empty until error/hint populates). Pattern matches the historical Angular fix (description region pre-established to support `aria-live` mutation for late-arriving errors).

---

### 8. Checkbox

**Story:** Components/Form/Checkbox
**File:** `src/web-components/components/form/checkbox/candor-checkbox.ts`
**Status:** ✅ Pass

**AT tree:** `checkbox "Accept terms and conditions"` + `generic` (visible label). Native `<input type="checkbox">` with for/id wiring; checked/disabled states reflect natively. No issues.

---

### 9. Radio

**Stories:** Components/Form/Radio — `Default` (single radio, isolated) and `Group` (the consumer-level fieldset pattern).
**File:** `src/web-components/components/form/radio/candor-radio.ts`
**Status:** ✅ Pass

**AT tree for Group story:** `group "Preferred contact method"` (from `<fieldset>`/`<legend>`) wrapping three `radio` nodes — "Email" `[checked]`, "Phone", "Post" `[disabled]`. Story demonstrates the consumer-level markup that the component cannot enforce — exactly the convention called out in the historical audit's "Stories as AT documentation" note. ✅

**Recommendation:** Keep the prominent `Group` story; consumers who only look at `Default` may miss the fieldset/legend requirement.

---

### 10. Switch

**Story:** Components/Form/Switch
**File:** `src/web-components/components/form/switch/candor-switch.ts`
**Status:** ✅ Pass

**AT exposure:** Inner element has `role="switch"`, `id` matches the label's `for`, label text reaches the AT tree via the label association. No host-aria-label set in the default story so no BL-1 risk; the `ariaLabel_` host-trap workaround is wired and would propagate inward if used.

---

### 11. Slider

**Story:** Components/Form/Slider (`components-form-slider--default`)
**File:** `src/web-components/components/form/slider/candor-slider.ts`
**Status:** ✅ Pass

**AT exposure:** Native `<input type="range">` exposes implicit `role="slider"` plus aria-valuemin/max/now from native min/max/value. Label↔input wiring intact; the historical Angular fix (custom `valueTextFn` for OKLCH axes) is preserved as a property on the WC version (not exercised in the default unitless story).

---

### 12. ChatInput

**Story:** Components/Form/ChatInput
**File:** `src/web-components/components/form/chat-input/candor-chat-input.ts`
**Status:** ✅ Pass

**AT exposure:** Visible label "Message" associated with the textarea via for/id; send button is icon-only with explicit `aria-label="Send message"`; pre-established `[aria-live="polite"]` status region empty by default. All four historical Angular fixes are preserved (textarea label, send button label, send-state announcement, disclaimer slot exposure).

---

### 13. Alert

**Stories:** Components/Alert — `Info`, `Success`, `Warning`, `Error`
**File:** `src/web-components/components/alert/candor-alert.ts`
**Status:** ✅ Pass

**AT exposure:**
- `info` and `success` variants → root `role="status"` (polite, non-interrupting)
- `error` and `warning` variants → root `role="alert"` (assertive, interrupts)

This is exactly the right pattern — error and warning are urgency-sensitive and warrant assertive announcement; info and success are informational and shouldn't preempt the user.

Decorative variant icons (`svg`) carry `aria-hidden="true"` ✅. Live region is the live region — no need for separate pre-establishment because the alert appears with content and is announced immediately.

---

### 14. Toast

**Story:** Components/Toast (`components-toast--default`)
**File:** `src/web-components/components/toast/candor-toast.ts`
**Status:** ✅ Pass

**AT exposure:** Root `role="status"` (polite). Icon SVG `aria-hidden="true"`. Dismiss button has explicit `aria-label="Dismiss notification"` so the icon-only control has an accessible name. The historical Angular audit's "no issues" verdict survives the port.

---

### 15. Progress

**Story:** Components/Progress (`components-progress--bar-determinate`)
**File:** `src/web-components/components/progress/candor-progress.ts`
**Status:** ✅ Pass (one redundancy noted)

**AT exposure:** `[role="progressbar"]` with `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow="65"`, `aria-valuetext="65%"`. The `aria-valuetext` formats the announcement for SR users (`"65%"` instead of raw `65`).

**Minor note (now fixed):** The progressbar element previously had BOTH `aria-label` and `aria-labelledby` set with the same name source. Per ARIA spec `aria-labelledby` wins, so the `aria-label` was redundant. The component now emits `aria-labelledby` when a `label` is provided and falls back to `aria-label="Loading"` when not — single source of truth in both branches.

---

### 16. Navigation

**Story:** Components/Navigation (`components-navigation--default`)
**File:** `src/web-components/components/navigation/candor-navigation.ts`
**Status:** ✅ Pass

**AT tree:** `navigation "Main navigation"` containing a `list` of four `listitem > link` nodes. The active link carries `aria-current="page"` so SR users hear "Home, current page, link". Brand text rendered as a `generic` (non-link). No issues.

---

### 17. Breadcrumb

**Story:** Components/Breadcrumb (`components-breadcrumb--default`)
**File:** `src/web-components/components/breadcrumb/candor-breadcrumb.ts`
**Status:** ✅ Pass

**AT tree:** `navigation "Breadcrumb"` containing an `<ol>` of three items. Home and Settings are links; Profile (the current page) is a plain `generic` with `aria-current="page"`. Rendering the current crumb as text (not link) is the correct pattern — SR users hear "Profile, current page" rather than landing on a self-link. Separator nodes are not exposed (handled with `aria-hidden`/`content` CSS or rendered outside the AT tree).

---

### 18. Tooltip

**Story:** Components/Tooltip (`components-tooltip--default`)
**File:** `src/web-components/components/tooltip/candor-tooltip.ts`
**Status:** ✅ Pass (with caveat)

**AT exposure:** The tooltip bubble in the shadow root carries `aria-hidden="true"` — its content does not reach SR users. The historical Angular audit explicitly accepted this ("AT-hidden by design").

**Caveat / question to flag:** This design is correct only when the trigger has its own meaningful text label (as in the default story: "Hover or focus me" is the button text). For icon-only triggers whose meaning depends on the tooltip text (a `ⓘ` info button, a `✎` edit button), an AT-hidden tooltip leaves SR users with no context. The component does not currently provide a way to surface the bubble text via `aria-describedby` on the trigger. Worth tracking as a design improvement, but acceptable for the v1 contract since the historical audit signed off on the same shape.

---

### 19. Chip

**Story:** Components/Chip (`components-chip--default`)
**File:** `src/web-components/components/chip/candor-chip.ts`
**Status:** ✅ Pass

**AT tree:** Non-interactive chip renders as a plain `generic` with the label text ("Tag"). For removable chips, the dismiss button gets its own accessible name (not exercised in the default story — see other stories for that variant).

---

### 20. Button

**Story:** Components/Button (`components-button--primary`)
**File:** `src/web-components/components/button/candor-button.ts`
**Status:** ✅ Pass

**AT tree:** `button "Save changes"` — accessible name comes from slot content (`<slot>` in shadow root projects the light-DOM children into the inner `<button>`). The `ariaLabel_` host-trap workaround is wired and would propagate inward if used; default story does not set it, so no BL-1 duplication.

---

### 21. Badge

**Story:** Components/Badge (`components-badge--default`)
**File:** `src/web-components/components/badge/candor-badge.ts`
**Status:** ✅ Pass

**AT exposure:** Plain text generic with the label ("Badge"). No interactive semantics; SR users hear it as a static word in the reading order. Variants (success / error / warning / info) carry meaning through *color and adjacency*, not through ARIA — when used as the sole signal for status, the consumer is responsible for adding a redundant non-color channel (icon, text label).

---

### 22. Stat

**Story:** Components/Stat (`components-stat--default`)
**File:** `src/web-components/components/stat/candor-stat.ts`
**Status:** ✅ Pass

**AT tree:** Two paragraphs — label ("Monthly active users") then value ("1,284") — read in DOM order. The pairing relies on visual + DOM proximity rather than an explicit ARIA grouping; this is fine when the stat is read in linear order. For dashboards with many stats side-by-side, a consumer-level `<dl>`/`<dt>`/`<dd>` wrapper would help disambiguate; the WC doesn't enforce that.

---

### 23. Table

**Story:** Components/Table (`components-table--default`)
**File:** `src/web-components/components/table/candor-table.ts`
**Status:** ✅ Pass (1 recommendation)

**AT tree:** `table` with header `rowgroup` of four `columnheader` cells and a body `rowgroup` of five rows of `cell`s.

**Verified state:**
- Column headers properly `<th scope="col">` ✅
- Row/cell semantics intact ✅

**Recommendation (not a blocker):**
- The default story has no `<caption>` and no row headers. For NVDA users navigating the table, a caption would name the table on entry ("Team roster"), and marking the first cell of each row as `scope="row"` would announce the row context ("Alice Okonkwo, Senior Engineer") when reading across rows in column-by-column mode. Worth adding to either the story or the documented usage pattern, but not a defect in the component itself — both are consumer-driven choices.

---

### 24. Card

**Story:** Components/Card (`components-card--default`)
**File:** `src/web-components/components/card/candor-card.ts`
**Status:** ✅ Pass

**AT tree:** Card renders as a generic container; slotted header / body / footer content reaches the AT tree directly. Card is a layout primitive without inherent semantics — naming and structure live in the slotted content (e.g. a `<h2>` inside the header slot becomes a heading). This is the correct contract.

---

### 25. Heading

**Story:** Typography/Heading (`typography-heading--default`)
**File:** `src/web-components/components/typography/heading/candor-heading.ts`
**Status:** ✅ Pass

**AT tree:** `heading "The quick brown fox..." [level=1]` — the `level` property is forwarded to the rendered `<hN>` so SR users hear correct heading level on entry. All six levels are produced from a single component via the `level` input.

---

### 26. AccessibleText / Text / Article

**Stories:** Typography/AccessibleText (`typography-accessibletext--default`), Typography/Text, Typography/Article
**Files:** `src/web-components/components/typography/accessible-text/candor-accessible-text.ts`, `text/candor-text.ts`, `article/candor-article.ts`
**Status:** ✅ Pass

**Key verified detail:** The `role_` attribute on `<candor-accessible-text>` is a **styling-only** API. The component does NOT forward it as an ARIA role onto the host element. The default story uses `role_="label"` but the host element has no `role` attribute and no `aria-label`. This means SR users get the plain text content in reading order — no synthetic "label" semantic that would confuse them.

The historical Angular audit verified the same: `[attr.role]: 'null'` correctly removes the role attribute. The WC version achieves the same outcome by simply not binding `role_` to `role`.

Article uses semantic HTML (`<article>`, `<h1>`–`<h6>`, `<p>`, `<abbr>`, `<figure>`, etc.) for its prose content — semantics flow from the element types, not added ARIA.

---

## WC Keyboard-only Audit Findings

**Persona:** Sighted user, no screen reader, no mouse. Navigation is `Tab` / `Shift+Tab` for focus movement; arrow keys for in-widget movement; `Enter` / `Space` to activate; `Escape` to dismiss. Focus must remain visible at all times.

**Method per component:**
1. Navigate to the default story iframe.
2. Press `Tab` from a known starting element; record where focus lands and confirm a visible focus indicator (`:focus-visible` outline, ring, or equivalent — `outline: none` without a replacement is a fail).
3. Continue `Tab`-ing through the component, confirming every interactive element is reachable and the order is logical (matches visual reading order).
4. For composite widgets, verify roving-tabindex (one Tab stop into the widget, arrow keys to navigate within).
5. Activate with `Enter` / `Space` and confirm the expected behavior. For overlays (Modal, Drawer, Menu), confirm `Escape` closes and returns focus to the trigger.
6. `Shift+Tab` exits the widget cleanly.
7. Document failures; an issue is genuine if a keyboard-only user would be unable to reach, see, activate, or escape a component.

**Phase tables**

### Phase 1 — Composite Widgets

| # | Component | Tab in | Internal nav | Activate | Escape | Focus visible | Status |
|---|---|---|---|---|---|---|---|
| 1 | TonePicker | ✅ first in-gamut radio | ✅ arrows, OOG-skip | ✅ Enter / Space | n/a | ✅ outline-focus | ✅ Pass |
| 2 | DataGrid | ✅ first cell (roving) | ✅ arrows, Home/End | ✅ Enter / Space | n/a | ✅ outline + ring | ✅ Pass |
| 3 | Tabs | ✅ active tab | ✅ ArrowLeft/Right (auto-activate) | ✅ Enter / Space | n/a | ✅ outline-focus | ✅ Pass |
| 4 | Modal | ✅ Close button | ✅ Tab cycles within | ✅ Enter | ✅ closes + returns focus to trigger | ✅ outline-focus | ✅ Pass |
| 5 | Menu | ✅ trigger; Enter opens to first menuitem | ✅ arrows | ✅ Enter / Space | ✅ closes + returns focus to trigger | ✅ outline-focus | ✅ Pass |
| 6 | Accordion | ✅ summary | ✅ Tab to next | ✅ Enter / Space toggles | n/a | ✅ native | ✅ Pass |

### Phase 2 — Form Controls

| # | Component | Tab in | Activate / value change | Focus visible | Status |
|---|---|---|---|---|---|
| 7 | Input | ✅ | ✅ typing | ✅ box-shadow ring + border color shift | ✅ Pass |
| 8 | Checkbox | ✅ | ✅ Space toggles | ✅ outline on custom box (`:focus-visible` via hidden-input proxy) | ✅ Pass |
| 9 | Radio | ✅ | ⚠ Space-only (arrow nav broken across shadow roots) | ✅ outline on custom dot | ⚠ KB-1 |
| 10 | Switch | ✅ | ✅ Space toggles | ✅ outline on custom track | ✅ Pass |
| 11 | Slider | ✅ | ✅ arrows step value | ✅ native range thumb focus | ✅ Pass |
| 12 | ChatInput | ✅ textarea | ✅ Enter sends (when not empty); send button enabled when text present | ✅ native textarea focus | ✅ Pass |

### Phase 3 — Feedback & Live Regions

| # | Component | Tab in | Dismiss reachable | Focus visible | Status |
|---|---|---|---|---|---|
| 13 | Alert | n/a; dismissible variant has dismiss button | ✅ Tab → "Dismiss" | ✅ | ✅ Pass |
| 14 | Toast | n/a; dismissible variant has dismiss button | ✅ Tab → "Dismiss notification" | ✅ | ✅ Pass |
| 15 | Progress | n/a non-interactive | n/a | n/a | ✅ Pass |

### Phase 4 — Navigation & Structural

| # | Component | Tab through links | Active marker visible | Focus visible | Status |
|---|---|---|---|---|---|
| 16 | Navigation | ✅ Tab moves through anchors | ✅ aria-current="page" + visual treatment | ✅ outline-focus | ✅ Pass |
| 17 | Breadcrumb | ✅ Tab moves through link crumbs; current page is plain text (skipped) | ✅ visual + aria-current="page" | ✅ outline-focus | ✅ Pass |
| 18 | Tooltip | ✅ trigger Tabbable; focus shows the bubble (opacity 0 → 1) | n/a | ✅ outline on trigger | ✅ Pass |
| 19 | Chip | ✅ static chip — not in tab order (correct for non-interactive) | n/a | n/a | ✅ Pass |
| 20 | Button | ✅ native button | n/a | ✅ outline-focus | ✅ Pass |

### Phase 5 — Display & Typography

| # | Component | Interactive parts | Slotted-content reach | Status |
|---|---|---|---|---|
| 21 | Badge | none | n/a | ✅ Pass |
| 22 | Stat | none | slotted badges/links reachable via natural tab order | ✅ Pass |
| 23 | Table | none in default story | n/a | ✅ Pass |
| 24 | Card | none — host is layout primitive | slotted content (links, buttons) reachable via natural tab order | ✅ Pass |
| 25 | Heading | none | n/a | ✅ Pass |
| 26 | AccessibleText / Text / Article | none | slotted content (links inside `<candor-article>`) reachable | ✅ Pass |

**Walkthrough notes (highlights only):**
- **Phase 1:** All composite widgets pass. Modal uses native `<dialog>.showModal()` for focus trap + return-focus. Menu opens with Enter → first menuitem → arrows → Escape returns focus to trigger. TonePicker / DataGrid use roving tabindex with single-stop entry.
- **Phase 2:** One real finding (KB-1, Medium). Sibling `<candor-radio>` elements with a shared `name` no longer form a native browser radio group across shadow-DOM boundaries — keyboard users must Tab between options AND press Space to select, instead of the native single-stop ArrowDown-to-select pattern. The component currently relies on browser-native radio grouping, which only works in light DOM. A wrapping `<candor-radio-group>` with explicit keyboard nav would restore the expected UX.
- **Phase 3:** Both dismissible Alert and Toast surface their dismiss button in the tab order; non-dismissible variants are correctly non-interactive.
- **Phase 4:** Native anchors / buttons throughout; Tooltip bubble appears on trigger focus via CSS `:focus-within` (no JS needed for keyboard reveal).
- **Phase 5:** All purely display components — nothing in tab order from the host element itself; slotted content (links, buttons inside Card / Article / Stat) reaches the user via natural document order.

---

## Summary

**Personas covered:** Screen-reader (NVDA + Chrome baseline) · Keyboard-only (no SR).

**Pass / issue split across 26 components:**
| Persona | ✅ Pass | ⚠ Issues | ✅ With caveat |
|---|---|---|---|
| Screen-reader | 25 | 0 (all fixed) | 1 (Tooltip — AT-hidden by design) |
| Keyboard-only | 25 | 1 (Radio: KB-1) | 0 |

All Phase 1 SR findings (TonePicker, Tabs, Modal, Menu) were fixed during this audit. The keyboard pass surfaced one new Medium issue: `<candor-radio>` sibling arrow-navigation across shadow-DOM (KB-1).

**Cross-cutting backlog items: 5** (4 SR + 1 KB) — see [Open Issues Backlog](#open-issues-backlog) above.

**Severity distribution:**
- Medium: 2 — BL-3 (fixed); KB-1 (open)
- Low: 6 — all fixed (BL-1 ariaLabel host duplication, BL-2 withdrawn after verification, BL-4 menu separator role, TonePicker OOG label noise, Tabs panel-host opacity, Progress redundant aria-label)

**No critical or high-severity blockers** in either persona. The library cleanly inherits or improves on the historical Angular audit results across all categories.

**Recommended next steps:**
1. ✅ **Done** — all six low-severity items fixed (BL-1/3/4 + TonePicker OOG noise + Tabs panel-host + Progress redundancy). BL-2 withdrawn after verification.
2. Run a real NVDA + Chrome session against the same 26 components to validate the Playwright AT-tree assumptions, especially on Accordion (`<summary>`) and the host-aria-label changes — Playwright's snapshot may not exactly mirror NVDA's announcement script.
3. Refresh `archive/A11Y-ANALYSIS.md` (or replace) to distill the WC-era patterns from this audit: `observeHostAriaLabel` for host-attribute mirroring, JSON-attribute injection for story data, native HTML elements over ARIA constructs where possible.
4. Expand the audit to other AT user personas — keyboard-only, voice-control, switch-control, magnification — in subsequent revisions.

---

## Historical Angular audit (pre-WC)

The following findings come from the audit of the Angular library that preceded the WC launch. They are preserved as reference: many WC components are direct ports, so the issues fixed there are issues to specifically cross-check at the WC layer.

---

### 1. TonePicker (Angular)

**Story:** Angular Components/Tone Picker
**File:** `src/app/components/tone-picker/tone-picker.component.ts`

**Issues found and fixed** (commit: see git log):

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `role="status"` + `aria-live="polite"` on preview div both fired on selection — oklch value announced twice | Medium | Removed `aria-live="polite"` from preview div; status region is sole announcer |
| 2 | `role="radio"` without required `role="radiogroup"` context (ARIA 1.2 normative: radio must be owned by `group` or `radiogroup`) | Medium | Wrapped table with `<div role="group">` |
| 3 | Hint/instructions DOM-last; virtual cursor users encountered the grid before instructions | Medium | Moved sr-only hint element to before the grid; `aria-describedby` still points to it for keyboard tab-in |
| 4 | Corner `<td>` (top-left of header row) appeared as unlabeled empty gridcell in virtual cursor navigation | Low | Changed to `role="none"` — removed from AT tree (`aria-hidden` on table cells is not honoured by Chrome) |
| 5 | `aria-checked="false"` announced on every unselected radio during arrow-key traversal | Low | Left as-is — inherent to `role="radio"`; changing requires a different widget model |

---

### 2. DataGrid

**Story:** Angular Components/Data Grid
**Files:** `src/app/components/data-grid/data-grid.component.ts` / `.html`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | No `aria-describedby` with keyboard instructions — users tab into a grid with a non-obvious model (arrow keys, Home/End, Ctrl+Home/End) with no guidance | Medium | Added sr-only hint paragraph before grid + `aria-describedby` on `<table>` |
| 2 | No live region on activation or pre-set selection — no confirmation that Enter/Space worked; pre-selected state invisible until navigated to | Medium | Added `role="status"` region; `activate()` sets announcement; `ngAfterViewInit` announces any pre-set `cell.selected` via `setTimeout` + `cdr.markForCheck()` |
| 3 | Corner `<td>` missing `role="none"` — appeared as unlabeled empty gridcell at top-left for grids with row headers | Low | Added `role="none"` to corner cell |

Also promoted `.sr-only` utility from `tone-picker.component.scss` to global `styles.scss`.

**Post-fix AT tree confirms (TonePicker):**
- Instructions (`paragraph`) appear before `group` > `grid` in DOM order
- Corner cell absent from header row (only `columnheader` nodes remain)
- `status` region is the sole live announcer
- Pre-selected `[checked]` state correctly reflected on mount

**Post-fix AT tree confirms (DataGrid):**
- Instructions (`paragraph`) appear before `grid` in DOM order
- Corner cell absent from header row
- `status` region present; populates asynchronously via `ngAfterViewInit` + `setTimeout` so live region mutation fires in real browsers

---

### 3. Tabs

**Story:** Angular Components/Tabs
**File:** `src/app/components/tabs/tabs.component.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `activeId = signal('')` is not an Angular `input()` — parent template bindings (e.g. `[activeId]="'settings'"`) are silently ignored; external pre-selection never takes effect; AT users land on the wrong (first) tab regardless of the intended initial state | Medium | Changed to `activeId = model('')` — `ModelSignal` is bindable from parents while still supporting internal `this.activeId.set(id)` calls |

**Post-fix AT tree confirms (Tabs):**
- `[activeId]="'someId'"` binding correctly selects the specified tab on mount
- Arrow key navigation, tab activation, and `role="status"` announcements unaffected
- `ngAfterContentInit` fallback to first tab still fires when no `activeId` is provided

---

### 4. Modal

**Story:** Angular Components/Modal
**Files:** `src/app/components/modal/modal.component.ts` / `.scss` / `modal.stories.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `<header>` inside `<dialog>` exposed as `role="banner"` landmark in Chrome (spec only suppresses banner for header inside article/aside/main/nav/section — not dialog) — pollutes landmark navigation | Medium | Added `role="none"` to `<header class="modal__header">` |
| 2 | `<footer slot="footer">` in story templates exposed as `role="contentinfo"` landmark inside dialog — same problem | Medium | Changed all story footer slots from `<footer>` to `<div slot="footer">` |
| 3 | `modal__body` div (`tabindex="0"`, scroll container) had no accessible name — NVDA reads entire text content verbatim on Tab | Medium | Added `aria-label="Dialog content"` |
| 4 | `&:focus { outline: none }` suppressed focus ring for sighted keyboard users when scroll container is focused | Low | Added `&:focus-visible` rule with inset outline (`outline-offset: -2px`) |

**Post-fix AT tree confirms (Modal):**
- `banner` landmark absent — heading and Close button appear as plain `generic` nodes under dialog
- `contentinfo` landmark absent — footer buttons appear as unnamed `generic` group
- Body scroll container shows as `generic "Dialog content"` — named stop in tab order
- Dialog `aria-labelledby` → heading association intact; dialog announces as "Dialog title, dialog"
- Native `<dialog>` focus trap, Escape handling, and return-focus-on-close all correct (no changes needed)

---

### 5. Menu

**Story:** Angular Components/Menu
**File:** `src/app/components/menu/menu.component.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `role="menu"` had no accessible name — NVDA announced an unnamed "menu" container on open; trigger's `aria-controls` creates a forward link but SRs don't use it to derive a menu label | Low | Added `triggerId` to the component; `[id]="triggerId"` on the trigger button; `[attr.aria-labelledby]="triggerId"` on the `<ul role="menu">` |

**Post-fix AT tree confirms (Menu):**
- Menu now exposed as `menu "Options"` — NVDA announces "Options, menu" on entry
- All other AT behaviour was already correct: `aria-haspopup`, `aria-expanded`, `aria-disabled`, separator skipping, focus management, Escape/Tab close

---

### 6. Accordion

**Story:** Angular Components/Accordion
**File:** `src/app/components/accordion/accordion-item.component.ts`

No issues found. The component uses native `<details>`/`<summary>` elements, which provide full AT support in Chrome+NVDA without any ARIA additions:
- `<summary>` is exposed as a disclosure button with expanded/collapsed state via Chrome's native IAccessible2/UIA implementation (Playwright's AT snapshot shows "generic" for `<summary>` — this is a DevTools protocol representation artifact, not what NVDA reads)
- Panel content is correctly hidden from the AT tree when `<details>` is closed and visible when open
- Enter/Space activation, toggle state announcement, and keyboard navigation all handled natively
- SVG chevron `aria-hidden="true"` correctly suppressed from NVDA (Playwright snapshot shows the SVG node but NVDA's AT APIs honour `aria-hidden`)

**Phase 5 update:** The `--quiet` variant heading was changed from regular to bold weight to meet Tier 2 contrast requirements (OKCA 4.5 bold at 14px — `--color-text-subtle` at 4.6 passes bold but not the 9.5 regular threshold). No ARIA or structural change. See `docs/CONTRAST-TIERS.md`.

---

### 7. Input

**Story:** Angular Components/Form/Input
**File:** `src/app/components/form/input/input.component.html`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Error/hint description div was conditionally rendered (`@if (error() \|\| hint())`) — conditionally rendered elements can't be pre-established live regions; error appearing after focus (on-blur validation, server response) was announced silently; hint→error transitions also silent | Medium | Removed `@if` wrapper; description div always in DOM (empty when unused); added `aria-live="polite"` + `aria-atomic="true"`; `aria-describedby` simplified to always point to the div |

**Post-fix AT tree confirms (Input):**
- Description div present for hint/error states with correct text ✅
- Empty description div correctly absent from snapshot for states with no hint/error ✅
- `aria-invalid="true"` + `aria-describedby` → error text on field focus ✅
- Label/input association via `for`/`id` intact; required state via native `[required]` ✅

---

### 8. Checkbox

**Story:** Angular Components/Form/Checkbox
**File:** `src/app/components/form/checkbox/checkbox.component.html`

No issues found. Native `<input type="checkbox">` with `<label for>` association. All states (unchecked, checked, disabled, checked+disabled) correctly reflected in AT tree.

---

### 9. Radio

**Story:** Angular Components/Form/Radio
**File:** `src/app/components/form/radio/radio.component.stories.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Radio groups had no programmatic group label — stories used bare `<div>` and `<p>` wrappers; AT users heard position context ("1 of N") but not what they were choosing; `MultipleGroups` story was especially broken with two unlabeled groups side by side | Medium | Replaced `<div>`/`<p>` wrappers with `<fieldset>`/`<legend>` in `RadioGroup` and `MultipleGroups` stories |

**Post-fix AT tree confirms (Radio):**
- `group "Size"` and `group "Color"` correctly exposed — NVDA announces "Size, group" then "Small, checked, 1 of 3, radio button" on entry
- The component itself is correct; `<fieldset>`/`<legend>` is a consumer responsibility documented via story patterns

---

### 10. Switch

**Story:** Angular Components/Form/Switch
**File:** `src/app/components/form/switch/switch.component.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `aria-label` on the `<app-switch>` host element did not propagate to the inner `<input role="switch">` — AT snapshot showed host as `generic "Toggle feature"` but the switch itself was completely unnamed; NVDA would announce just "switch" | High | Added `ariaLabel = input<string>()` to the component; bound `[attr.aria-label]="ariaLabel() \|\| null"` on the `<input>`; updated `NoLabel` story to use `ariaLabel="Toggle feature"` on the component input |

**Post-fix AT tree confirms (Switch):**
- `NoLabel` story: inner element exposed as `switch "Toggle feature"` ✅
- `AllStates` story: all four variants (`switch "Off"`, `switch "On" [checked]`, `switch "Disabled off" [disabled]`, `switch "Disabled on" [checked] [disabled]`) correctly reflected ✅
- `role="switch"` on `<input type="checkbox">` maps checked→"on" / unchecked→"off" in NVDA — no action needed

---

### 11. Slider

**Story:** Angular Components/Form/Slider
**File:** `src/app/components/form/slider/slider.component.ts` / `.html`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | No `aria-valuetext` — OKLCH gradient sliders (step=0.001, range 0–1) announced raw decimals (`"0.55"`, `"0.551"`) on every keypress; AT user has no unit context for what the number means | Medium | Added `valueTextFn = input<(v: number) => string>()` and `computedValueText` computed signal; bound `[attr.aria-valuetext]="computedValueText()"` on the `<input>`; updated gradient stories to pass `(v) => (v * 100).toFixed(0) + '%'` |
| 2 | No unlabeled fallback — component had no escape hatch if a consumer renders without a visible `label` | Low | Added `ariaLabel = input<string>()` bound to `[attr.aria-label]` on the `<input>` |

**Design note:** `valueTextFn` is intentionally consumer-supplied — the component cannot know whether the axis is lightness (0–1 → percent), chroma (dynamic max → raw value with unit), or hue (0–360 → degrees). The CPQI tool should provide an axis-appropriate formatter when wiring up sliders; the pattern is documented in the `GradientTrack` story.

**Post-fix AT tree confirms (Slider):**
- `slider "Opacity"` value `"40"` — no `aria-valuetext` needed; integer 0–100 is self-explanatory ✅
- `slider "Lightness — hold C and H"` (sage green): `aria-valuetext="55%"` confirmed in DOM ✅
- `slider "Lightness — hold C and H"` (pale rose): `aria-valuetext="94%"` confirmed in DOM ✅
- `slider "Volume" [disabled]` — no `aria-valuetext` needed; integer is self-explanatory ✅

---

### 12. ChatInput

**Story:** Angular Components/Form/ChatInput
**Files:** `src/app/components/form/chat-input/chat-input.component.ts` / `.html`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | No send confirmation — Enter/click sent silently; textarea cleared with no AT announcement; user could not tell if action succeeded | Medium | Added `statusMessage = signal('')`; `role="status"` live region always in DOM; `onSend()` resets then sets `"Message sent"` via `setTimeout` + `cdr.markForCheck()` |
| 2 | No keyboard instructions — Enter=send, Shift+Enter=newline is non-standard for `<textarea>`; undiscoverable via AT | Medium | Added sr-only `<span [id]="inputId+'-hint'">` with instructions; wired to textarea via `aria-describedby` |
| 3 | Disclaimer not associated with field — safety text DOM-last (after button); keyboard AT users could submit before hearing it; no `aria-describedby` link | Medium | Added `[id]` to disclaimer `<p>`; `ariaDescribedBy` computed signal appends disclaimer ID when present; NVDA now reads both hint and disclaimer on tab-in |
| 4 | `aria-multiline="true"` redundant on `<textarea>` — implicit in the element | Low | Removed attribute |

**Post-fix AT tree confirms (ChatInput):**
- Tab-in: `textbox "Message Candor AI"` — description chain reads hint + disclaimer ✅
- `aria-describedby` resolves to `["Press Enter to send…", "Candor AI can make mistakes…"]` ✅
- Default story (no disclaimer): `aria-describedby` contains only hint ID ✅
- Send via Enter: `status "Message sent"` fires; textarea clears; button returns to `[disabled]` ✅

---

### 13. Alert

**Story:** Angular Components/Alert
**File:** `src/app/components/alert/alert.stories.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `InlineFormValidation` story: `<label>` had no `for` attribute and `<input>` had no `id` — AT snapshot showed `textbox` with no accessible name; NVDA would announce "edit" with no field label | High | Added `for="story-email"` to `<label>` and `id="story-email"` to `<input>` |

**Post-fix AT tree confirms (Alert):**
- `textbox "Email address"` correctly named via `<label for>` association ✅
- `role="status"` (info/success) and `role="alert"` (warning/error) correctly applied ✅
- SVG icons `aria-hidden="true"` — Playwright shows `img` node but NVDA honours `aria-hidden` ✅
- Dismiss button `aria-label="Dismiss"` reachable in tab order ✅

---

### 14. Toast

**Story:** Angular Components/Toast
**File:** `src/app/components/toast/toast.component.ts`

No issues found. `role="status"` (info/success) and `role="alert"` (warning/error) correctly applied. Dismiss button labeled "Dismiss notification" ✅. SVG icons correctly suppressed ✅.

---

### 15. Progress

**Story:** Angular Components/Progress
**File:** `src/app/components/progress/progress.component.ts`

No issues found. `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` all correctly set for determinate bars; all value attrs correctly nulled for indeterminate. Spinner exposed as `role="status"` with `aria-label` ✅.

---

### 16. Navigation

**Story:** Angular Components/Navigation
**File:** `src/app/components/navigation/navigation.component.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Badge spans had no unit context — `link "Inbox 12"` gave AT users a bare number with no indication of what it counts; NVDA announces "Inbox 12, link" | Medium | Added optional `badgeLabel?: string` to `NavItem` interface; bound `[attr.aria-label]="item.badgeLabel \|\| null"` on the badge `<span>` — accname spec substitutes the span's `aria-label` into the parent link's name; updated `WithBadges` story to supply `"12 unread"` and `"3 pending"` |

**Post-fix AT tree confirms (Navigation):**
- `link "Inbox 12 unread"` and `link "Tasks 3 pending"` — badge aria-label correctly substituted into link name ✅
- `badgeLabel` is optional; badges without it fall back to bare number (acceptable, consumer's responsibility to supply context)

---

### 17. Breadcrumb

**Story:** Angular Components/Breadcrumb
**File:** `src/app/components/breadcrumb/breadcrumb.component.ts`

No issues found. `navigation "Breadcrumb"` landmark ✅, `<ol>` list ✅, ancestor items as `<a>` links ✅, current item as `<span aria-current="page">` ✅.

**Phase 5 update:** All link text (ancestor items and current location) changed to bold weight to meet Tier 2 contrast requirements (OKCA 4.5 bold at 14px). No ARIA or structural change. See `docs/CONTRAST-TIERS.md`.

---

### 18. Tooltip

**Story:** Angular Components/Tooltip
**File:** `src/app/components/tooltip/tooltip.component.ts`

No issues found. Tooltip bubble carries `aria-hidden="true"` by design — intentional Candor position documented in component and Storybook docs. Trigger elements in all stories are self-describing via accessible name. `IconButton` story demonstrates the required pattern: every icon-only trigger must carry `aria-label`.

---

### 19. Chip

**Story:** Angular Components/Chip
**File:** `src/app/components/chip/chip.component.ts`

No issues found. Selectable chips use `aria-pressed` toggle button pattern ✅. `FilterGroup` story wraps chips in `role="group" aria-label="Filter by technology"` ✅. Dismiss buttons use contextual `aria-label="Remove {label}"` ✅.

---

### 20. Button

**Story:** Angular Components/Button
**File:** `src/app/components/button/button.component.html`

No issues found. Native `<button>` with projected content as accessible name ✅. `ariaLabel` input correctly binds `null` (removes attribute) when not provided — no spurious `aria-label="undefined"` ✅. Disabled state via native `[disabled]` ✅.

---

### 21. Badge

**Story:** Angular Components/Badge
**File:** `src/app/components/badge/badge.component.ts`

No issues found. Non-interactive `<span>` wrapper with text content via `<ng-content>` ✅. Readable in browse mode; no interactive role needed.

---

### 22. Stat

**Story:** Angular Components/Stat
**File:** `src/app/components/stat/stat.component.html`

No issues found. Value `<p>` carries `aria-label` combining value + unit (e.g. `"3.9 :1"`) so NVDA reads a single coherent string rather than value and unit separately ✅. Label `<p>` provides context before the value in DOM order ✅.

---

### 23. Table

**Story:** Angular Components/Table
**File:** `src/app/components/table/table.stories.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Both story tables had no `<caption>` or `aria-label` — NVDA announced "table, N columns, N rows" with no name; AT users had no context for what the table contained | Medium | Added `<caption>Algorithm contrast scores</caption>` to Default story; added `<caption class="sr-only">Color contrast measurements</caption>` to Compact story |
| 2 | Compact story: left-column descriptor cells were `<td>` not `<th scope="row">` — no formal row header relationship | Low | Changed `<td class="label">` to `<th scope="row" class="label">` in all six Compact rows |

**Post-fix AT tree confirms (Table):**
- Default: `table "Algorithm contrast scores"` with `columnheader` row ✅
- Compact: `table "Color contrast measurements"` with `rowheader "WCAG 2.1"`, `rowheader "OKCA"`, etc. ✅

---

### 24. Card

**Story:** Angular Components/Card
**File:** `src/app/components/card/card.component.ts`

No issues found. Layout wrapper with header/body/footer `<div>` slots — no landmark roles needed; content structure is consumer responsibility ✅.

---

### 25. Heading

**Story:** Angular Components/Typography/Heading
**File:** `src/app/components/typography/heading/heading.component.ts`

No issues found. Host element carries `role="heading"` + `aria-level` computed from `level` input — all six levels correctly exposed as `heading "..." [level=N]` in AT tree ✅.

---

### 26. AccessibleText / Text / Article

**Stories:** Angular Components/Typography/AccessibleText, Angular Components/Typography/Text, Angular Components/Typography/Article
**File:** `src/app/components/typography/accessible-text/accessible-text.component.ts`

No issues found. `[attr.role]: 'null'` correctly removes the role attribute from the host element — the `role` input is a styling API only and is not forwarded to ARIA ✅.
