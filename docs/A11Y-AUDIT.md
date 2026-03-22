# Candor Design System — Accessibility Audit

Audit methodology: per-component screen reader walkthrough (NVDA + Chrome unless noted),
followed by ranked issues table, fixes, and sign-off.

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
| 12 | ChatInput | ⬜ Pending | |

---

## Phase 3 — Feedback & Live Regions

| # | Component | Status | Notes |
|---|---|---|---|
| 13 | Alert | ⬜ Pending | |
| 14 | Toast | ⬜ Pending | |
| 15 | Progress | ⬜ Pending | |

---

## Phase 4 — Navigation & Structural

| # | Component | Status | Notes |
|---|---|---|---|
| 16 | Navigation | ⬜ Pending | |
| 17 | Breadcrumb | ⬜ Pending | |
| 18 | Tooltip | ⬜ Pending | |
| 19 | Chip | ⬜ Pending | |
| 20 | Button | ⬜ Pending | |

---

## Phase 5 — Display & Typography

| # | Component | Status | Notes |
|---|---|---|---|
| 21 | Badge | ⬜ Pending | |
| 22 | Stat | ⬜ Pending | |
| 23 | Table | ⬜ Pending | |
| 24 | Card | ⬜ Pending | |
| 25 | Heading | ⬜ Pending | |
| 26 | AccessibleText / Text / Article | ⬜ Pending | |

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
