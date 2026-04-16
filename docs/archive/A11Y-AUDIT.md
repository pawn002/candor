# Candor Design System — Accessibility Audit

Audit methodology: per-component screen reader walkthrough (NVDA + Chrome unless noted),
followed by ranked issues table, fixes, and sign-off.

Cross-reference: trend analysis and recommendations are in [`docs/A11Y-ANALYSIS.md`](./A11Y-ANALYSIS.md).

Status legend: ⬜ Pending · 🔄 In Progress · ✅ Done · ⏭ Deferred

---

## Open Issues Backlog

Issues deferred from component audits (too broad to fix in one pass, or cross-cutting).

*(empty — populated as audit progresses)*

---

## Phase 1 — Custom Composite Widgets

| # | Component | Status | Notes |
|---|---|---|---|
| 1 | TonePicker | ✅ Done | 4 issues fixed — see findings below |
| 2 | DataGrid | ✅ Done | 3 issues fixed — see findings below |
| 3 | Tabs | ✅ Done | 1 issue fixed — see findings below |
| 4 | Modal | ✅ Done | 4 issues fixed — see findings below |
| 5 | Menu | ✅ Done | 1 issue fixed — see findings below |
| 6 | Accordion | ✅ Done | No issues — see findings below |

---

## Phase 2 — Form Controls

| # | Component | Status | Notes |
|---|---|---|---|
| 7 | Input | ✅ Done | 1 issue fixed — see findings below |
| 8 | Checkbox | ✅ Done | No issues |
| 9 | Radio | ✅ Done | 1 issue fixed — see findings below |
| 10 | Switch | ✅ Done | 1 issue fixed — see findings below |
| 11 | Slider | ✅ Done | 2 issues fixed — see findings below |
| 12 | ChatInput | ✅ Done | 4 issues fixed — see findings below |

---

## Phase 3 — Feedback & Live Regions

| # | Component | Status | Notes |
|---|---|---|---|
| 13 | Alert | ✅ Done | 1 issue fixed — see findings below |
| 14 | Toast | ✅ Done | No issues |
| 15 | Progress | ✅ Done | No issues |

---

## Phase 4 — Navigation & Structural

| # | Component | Status | Notes |
|---|---|---|---|
| 16 | Navigation | ✅ Done | 1 issue fixed — see findings below |
| 17 | Breadcrumb | ✅ Done | No issues |
| 18 | Tooltip | ✅ Done | No issues (AT-hidden by design) |
| 19 | Chip | ✅ Done | No issues |
| 20 | Button | ✅ Done | No issues |

---

## Phase 5 — Display & Typography

| # | Component | Status | Notes |
|---|---|---|---|
| 21 | Badge | ✅ Done | No issues |
| 22 | Stat | ✅ Done | No issues |
| 23 | Table | ✅ Done | 2 issues fixed — see findings below |
| 24 | Card | ✅ Done | No issues |
| 25 | Heading | ✅ Done | No issues |
| 26 | AccessibleText / Text / Article | ✅ Done | No issues |

---

## Findings

### 1. TonePicker

**Story:** Components/Tone Picker
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

**Story:** Components/Data Grid
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

**Story:** Components/Tabs
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

**Story:** Components/Modal
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

**Story:** Components/Menu
**File:** `src/app/components/menu/menu.component.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | `role="menu"` had no accessible name — NVDA announced an unnamed "menu" container on open; trigger's `aria-controls` creates a forward link but SRs don't use it to derive a menu label | Low | Added `triggerId` to the component; `[id]="triggerId"` on the trigger button; `[attr.aria-labelledby]="triggerId"` on the `<ul role="menu">` |

**Post-fix AT tree confirms (Menu):**
- Menu now exposed as `menu "Options"` — NVDA announces "Options, menu" on entry
- All other AT behaviour was already correct: `aria-haspopup`, `aria-expanded`, `aria-disabled`, separator skipping, focus management, Escape/Tab close

---

### 6. Accordion

**Story:** Components/Accordion
**File:** `src/app/components/accordion/accordion-item.component.ts`

No issues found. The component uses native `<details>`/`<summary>` elements, which provide full AT support in Chrome+NVDA without any ARIA additions:
- `<summary>` is exposed as a disclosure button with expanded/collapsed state via Chrome's native IAccessible2/UIA implementation (Playwright's AT snapshot shows "generic" for `<summary>` — this is a DevTools protocol representation artifact, not what NVDA reads)
- Panel content is correctly hidden from the AT tree when `<details>` is closed and visible when open
- Enter/Space activation, toggle state announcement, and keyboard navigation all handled natively
- SVG chevron `aria-hidden="true"` correctly suppressed from NVDA (Playwright snapshot shows the SVG node but NVDA's AT APIs honour `aria-hidden`)

**Phase 5 update:** The `--quiet` variant heading was changed from regular to bold weight to meet Tier 2 contrast requirements (OKCA 4.5 bold at 14px — `--color-text-subtle` at 4.6 passes bold but not the 9.5 regular threshold). No ARIA or structural change. See `docs/CONTRAST-TIERS.md`.

---

### 7. Input

**Story:** Components/Form/Input
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

**Story:** Components/Form/Checkbox
**File:** `src/app/components/form/checkbox/checkbox.component.html`

No issues found. Native `<input type="checkbox">` with `<label for>` association. All states (unchecked, checked, disabled, checked+disabled) correctly reflected in AT tree.

---

### 9. Radio

**Story:** Components/Form/Radio
**File:** `src/app/components/form/radio/radio.component.stories.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Radio groups had no programmatic group label — stories used bare `<div>` and `<p>` wrappers; AT users heard position context ("1 of N") but not what they were choosing; `MultipleGroups` story was especially broken with two unlabeled groups side by side | Medium | Replaced `<div>`/`<p>` wrappers with `<fieldset>`/`<legend>` in `RadioGroup` and `MultipleGroups` stories |

**Post-fix AT tree confirms (Radio):**
- `group "Size"` and `group "Color"` correctly exposed — NVDA announces "Size, group" then "Small, checked, 1 of 3, radio button" on entry
- The component itself is correct; `<fieldset>`/`<legend>` is a consumer responsibility documented via story patterns

---

### 10. Switch

**Story:** Components/Form/Switch
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

**Story:** Components/Form/Slider
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

**Story:** Components/Form/ChatInput
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

**Story:** Components/Alert
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

**Story:** Components/Toast
**File:** `src/app/components/toast/toast.component.ts`

No issues found. `role="status"` (info/success) and `role="alert"` (warning/error) correctly applied. Dismiss button labeled "Dismiss notification" ✅. SVG icons correctly suppressed ✅.

---

### 15. Progress

**Story:** Components/Progress
**File:** `src/app/components/progress/progress.component.ts`

No issues found. `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` all correctly set for determinate bars; all value attrs correctly nulled for indeterminate. Spinner exposed as `role="status"` with `aria-label` ✅.

---

### 16. Navigation

**Story:** Components/Navigation
**File:** `src/app/components/navigation/navigation.component.ts`

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | Badge spans had no unit context — `link "Inbox 12"` gave AT users a bare number with no indication of what it counts; NVDA announces "Inbox 12, link" | Medium | Added optional `badgeLabel?: string` to `NavItem` interface; bound `[attr.aria-label]="item.badgeLabel \|\| null"` on the badge `<span>` — accname spec substitutes the span's `aria-label` into the parent link's name; updated `WithBadges` story to supply `"12 unread"` and `"3 pending"` |

**Post-fix AT tree confirms (Navigation):**
- `link "Inbox 12 unread"` and `link "Tasks 3 pending"` — badge aria-label correctly substituted into link name ✅
- `badgeLabel` is optional; badges without it fall back to bare number (acceptable, consumer's responsibility to supply context)

---

### 17. Breadcrumb

**Story:** Components/Breadcrumb
**File:** `src/app/components/breadcrumb/breadcrumb.component.ts`

No issues found. `navigation "Breadcrumb"` landmark ✅, `<ol>` list ✅, ancestor items as `<a>` links ✅, current item as `<span aria-current="page">` ✅.

**Phase 5 update:** All link text (ancestor items and current location) changed to bold weight to meet Tier 2 contrast requirements (OKCA 4.5 bold at 14px). No ARIA or structural change. See `docs/CONTRAST-TIERS.md`.

---

### 18. Tooltip

**Story:** Components/Tooltip
**File:** `src/app/components/tooltip/tooltip.component.ts`

No issues found. Tooltip bubble carries `aria-hidden="true"` by design — intentional Candor position documented in component and Storybook docs. Trigger elements in all stories are self-describing via accessible name. `IconButton` story demonstrates the required pattern: every icon-only trigger must carry `aria-label`.

---

### 19. Chip

**Story:** Components/Chip
**File:** `src/app/components/chip/chip.component.ts`

No issues found. Selectable chips use `aria-pressed` toggle button pattern ✅. `FilterGroup` story wraps chips in `role="group" aria-label="Filter by technology"` ✅. Dismiss buttons use contextual `aria-label="Remove {label}"` ✅.

---

### 20. Button

**Story:** Components/Button
**File:** `src/app/components/button/button.component.html`

No issues found. Native `<button>` with projected content as accessible name ✅. `ariaLabel` input correctly binds `null` (removes attribute) when not provided — no spurious `aria-label="undefined"` ✅. Disabled state via native `[disabled]` ✅.

---

### 21. Badge

**Story:** Components/Badge
**File:** `src/app/components/badge/badge.component.ts`

No issues found. Non-interactive `<span>` wrapper with text content via `<ng-content>` ✅. Readable in browse mode; no interactive role needed.

---

### 22. Stat

**Story:** Components/Stat
**File:** `src/app/components/stat/stat.component.html`

No issues found. Value `<p>` carries `aria-label` combining value + unit (e.g. `"3.9 :1"`) so NVDA reads a single coherent string rather than value and unit separately ✅. Label `<p>` provides context before the value in DOM order ✅.

---

### 23. Table

**Story:** Components/Table
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

**Story:** Components/Card
**File:** `src/app/components/card/card.component.ts`

No issues found. Layout wrapper with header/body/footer `<div>` slots — no landmark roles needed; content structure is consumer responsibility ✅.

---

### 25. Heading

**Story:** Typography/Heading
**File:** `src/app/components/typography/heading/heading.component.ts`

No issues found. Host element carries `role="heading"` + `aria-level` computed from `level` input — all six levels correctly exposed as `heading "..." [level=N]` in AT tree ✅.

---

### 26. AccessibleText / Text / Article

**Stories:** Typography/AccessibleText, Typography/Text, Typography/Article
**File:** `src/app/components/typography/accessible-text/accessible-text.component.ts`

No issues found. `[attr.role]: 'null'` correctly removes the role attribute from the host element — the `role` input is a styling API only and is not forwarded to ARIA ✅.
