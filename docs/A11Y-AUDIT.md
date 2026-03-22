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
| 2 | DataGrid | ⬜ Pending | |
| 3 | Tabs | ⬜ Pending | |
| 4 | Modal | ⬜ Pending | |
| 5 | Menu | ⬜ Pending | |
| 6 | Accordion | ⬜ Pending | |

---

## Phase 2 — Form Controls

| # | Component | Status | Notes |
|---|---|---|---|
| 7 | Input | ⬜ Pending | |
| 8 | Checkbox | ⬜ Pending | |
| 9 | Radio | ⬜ Pending | |
| 10 | Switch | ⬜ Pending | |
| 11 | Slider | ⬜ Pending | |
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

**Post-fix AT tree confirms:**
- Instructions (`paragraph`) appear before `group` > `grid` in DOM order
- Corner cell absent from header row (only `columnheader` nodes remain)
- `status` region is the sole live announcer
- Pre-selected `[checked]` state correctly reflected on mount
