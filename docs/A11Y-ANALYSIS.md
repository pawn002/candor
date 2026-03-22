# Candor Design System — Accessibility Audit Analysis

Cross-reference: findings data is in [`docs/A11Y-AUDIT.md`](./A11Y-AUDIT.md).

This document synthesises trends observed across the full 26-component audit. It is intended to inform documentation strategy, component authoring conventions, and review priorities for future work.

---

## Summary statistics

| Phase | Components | Issues found | Issues fixed |
|---|---|---|---|
| 1 — Custom composite widgets | 6 | 13 | 13 |
| 2 — Form controls | 6 | 9 | 9 |
| 3 — Feedback & live regions | 3 | 1 | 1 |
| 4 — Navigation & structural | 5 | 1 | 1 |
| 5 — Display & typography | 6 | 2 | 2 |
| **Total** | **26** | **26** | **26** |

11 of 26 components were clean. All 26 are now signed off.

---

## Trend 1 — Live region pre-establishment is the most misunderstood pattern

**Affected components:** Input (#7), DataGrid (#2), ChatInput (#12)

Three separate components failed the same way: either conditionally rendering a live region (`@if (error())` wrapping the description div) or omitting one entirely. The root cause is a mental model where the DOM element and its content are treated as one thing, when AT treats them separately. The region must exist before the content arrives; the content *change* is what fires the announcement.

**Pattern that emerged from fixes:**
```html
<!-- Always in DOM — empty when unused. The @if is INSIDE, not outside. -->
<div role="status" aria-live="polite" aria-atomic="true">
  @if (condition) { {{ message }} }
</div>
```

This pattern appears in: Input description div, ChatInput send confirmation, DataGrid activation feedback, ChatInput disclaimer-free state.

---

## Trend 2 — Angular's host element creates a structural AT trap

**Affected components:** Switch (#10), Navigation badges (#16)

Angular wraps every component in a host element (`<app-switch>`, `<app-chip>`, etc.) that sits between the consumer's template and the semantically meaningful inner element. Developers put `aria-label` on `<app-switch>` expecting it to reach the `<input role="switch">` inside — it doesn't. The host is a generic container; the label lands there and goes nowhere.

This pattern will recur any time a component wraps a native interactive element. The established fix is:
1. Add an `ariaLabel = input<string>()` to the component
2. Bind `[attr.aria-label]="ariaLabel() || null"` directly on the inner element

This convention is now in place on: Switch, Slider, Button. It should be a documented authoring rule for any component that wraps a native interactive element.

---

## Trend 3 — Complex custom widgets account for the majority of issues

**Phase 1 (custom composite widgets): 13 of 26 total issues — 50% from 6 components**

The correlation between widget complexity and AT failure rate is stark:

| Component | Issues | Complexity |
|---|---|---|
| TonePicker | 4 | Custom grid picker with ARIA radio grid |
| DataGrid | 3 | Custom keyboard-navigable grid |
| Modal | 4 | Custom dialog with focus trap |
| Tabs | 1 | Custom tablist pattern |
| Menu | 1 | Custom role="menu" with focus management |
| Accordion | 0 | Native `<details>`/`<summary>` |

Accordion — the only Phase 1 component that uses native HTML — had no issues. Every component that built a custom interaction model from generic elements required explicit ARIA and got some of it wrong.

**The practical implication:** accessibility review effort should be weighted toward composite widgets, not distributed evenly. A new `<select>`-replacement needs more scrutiny than a new typography variant.

---

## Trend 4 — Stories are part of the accessibility surface

**Story-level fixes: 6 of 15 total fixes**

Components whose stories were fixed (component itself was correct):
- Radio (#9) — `<fieldset>`/`<legend>` grouping
- Alert (#13) — `<label for>` / `<input id>` association in story
- Table (#23) — `<caption>`, `<th scope="row">`
- Navigation (#16) — `badgeLabel` demonstrated in `WithBadges` story

A story that demonstrates wrong usage is as harmful as a component with a bug, because stories are what developers copy into production. Treating stories as executable documentation changes how they are written: every story should demonstrate the surrounding markup that the component cannot provide on its own — `<fieldset>`/`<legend>` for radio groups, `<caption>` for tables, `for`/`id` for label associations.

---

## Trend 5 — The OKLCH tool creates AT challenges that generic solutions can't solve

**Affected component:** Slider (#11)

The Slider's `aria-valuetext` issue surfaced something specific to this design system: axes whose min/max values are dynamically constrained by the selected hue cannot be meaningfully described by any auto-computed formatter. `"55%"` is correct for a lightness axis — but the same formula applied to a chroma axis with a dynamic ceiling would be meaningless.

The fix (`valueTextFn = input<(v: number) => string>()`) was the right call because the component cannot know what it is measuring. This pattern — where domain knowledge lives at the consumer level, not the component level — will apply again as the CPQI tool integrates live color-picking workflows.

**Established convention:** when a component's values are semantically opaque (units depend on context), expose a formatter callback input rather than attempting auto-computation.

---

## Trend 6 — Landmark pollution is a browser specification edge case

**Affected component:** Modal (#4)

`<header>` inside `<dialog>` gets `role="banner"` in Chrome — not because anyone put it there, but because the HTML spec only suppresses the implicit `banner` landmark for `<header>` when it is inside `article`, `aside`, `main`, `nav`, or `section`. Dialog is not on that list. `<footer>` similarly becomes `role="contentinfo"`.

These are correct-looking markup choices that produce wrong AT structure. They are invisible to visual inspection and will not appear in linting. They only surface in the AT tree — which is exactly why the live snapshot step in the walkthrough matters. The same trap exists for any future overlay or panel component.

**Fix pattern:** `role="none"` on `<header>` inside dialogs/panels; `<div>` instead of `<footer>` in slotted content.

---

## Trend 7 — The clean components share a common property: they don't fight the platform

**Clean components:** Checkbox, Accordion, Breadcrumb, Toast, Progress, Heading, Badge, Card, Chip, Button, Stat

All clean components use native HTML semantics as the primary mechanism:
- Checkbox: `<label>` + `<input type="checkbox">`
- Accordion: `<details>`/`<summary>`
- Breadcrumb: `<nav>` + `<ol>` + `<a>` + `aria-current`
- Progress: native `role="progressbar"` attributes + `<svg role="status">`

The components that required the most remediation are the ones that built custom interaction models from generic elements. That is not a criticism of the design decisions — a grid picker or a keyboard-navigable menu genuinely requires custom ARIA — but it confirms that every component that steps away from native semantics takes on an explicit accessibility debt that must be paid at design time, not discovered in a post-hoc audit.

---

## Recommendations for future work

These are discussed further in CLAUDE.md and design system documentation:

1. **Establish a live-region checklist** for any component that produces feedback (form errors, send confirmations, activation results). The pre-establishment pattern should be a documented convention, not rediscovered per component.

2. **Document the host-element trap** as an Angular-specific authoring rule: any component wrapping a native interactive element must expose an `ariaLabel` input bound to the inner element.

3. **Weight code review effort** toward composite widgets. A new custom picker or overlay warrants a screen reader walkthrough at PR time, not just visual review.

4. **Treat stories as AT documentation**. Every story involving a form element, table, or grouped widget should demonstrate the consumer-level markup pattern (fieldset/legend, caption, for/id) even when the component itself cannot enforce it.

5. **Document the `valueTextFn` convention** for OKLCH-axis sliders in the CPQI tool integration guide.

6. **Add the landmark-in-dialog trap** to CLAUDE.md's Common Pitfalls section, alongside the existing `::ng-deep` and `*ngIf` warnings.
