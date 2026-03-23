## What this PR does

<!-- One sentence. -->

## Change type

<!-- Check all that apply -->

- [ ] New component
- [ ] Component enhancement / bug fix
- [ ] Design token change
- [ ] Story / documentation only
- [ ] Infrastructure / tooling

---

## Universal checklist

_Every PR must pass these before merge._

- [ ] No hard-coded color values — tokens only (`oklch(...)` in `colors.scss`, then `var(--...)` in components)
- [ ] No `::ng-deep` — use `ViewEncapsulation.None` with a host class for projected content
- [ ] No `*ngIf` / `*ngFor` — use `@if` / `@for` (zoneless mode requirement)
- [ ] Stories exist or are updated — all significant variants covered
- [ ] Every interactive element has an accessible name (label, `aria-label`, or `aria-labelledby`)

---

## Component checklist

_Complete this section if the PR adds or modifies a component._

**Tokens**
- [ ] Component imports tokens via `@use '../../../design-tokens'` — no raw values
- [ ] Any new tokens are added to the relevant token file and exported from `index.scss`

**Inputs / API**
- [ ] Component wrapping a native interactive element (`<input>`, `<button>`, etc.) exposes `ariaLabel = input<string>()` bound to the inner element — not the host
- [ ] Any signal that a parent template needs to set or react to uses `model<T>()`, not `signal<T>()`

**Live regions**
- [ ] If the component produces status feedback (errors, confirmations, activation results): the live region element is always in the DOM — `@if` is **inside** the region, not wrapping it

**Landmark pollution**
- [ ] If the component renders inside or as a dialog/panel: no `<header>` or `<footer>` without `role="none"` (they inherit `banner`/`contentinfo` in Chrome)

**Stories as AT documentation**
- [ ] Stories demonstrate correct consumer-level markup that the component cannot enforce:
  - Radio groups: `<fieldset>` / `<legend>` (not `<div>` / `<p>`)
  - Tables: `<caption>`, `<th scope="row">` for key/value rows
  - Unlabeled form fields: `<label for>` / `<input id>` association

---

## Composite widget checklist

_Complete this section if the component builds a custom interaction model from generic elements — custom grids, dialogs, menus, pickers, tab sets, carousels, or anything using `role="grid"`, `role="listbox"`, `role="dialog"`, `role="menu"`, `role="tablist"`._

These components have generated 50% of all AT issues in this codebase. Visual review is not sufficient — a screen reader walkthrough is required.

- [ ] **SR walkthrough completed** — traced what NVDA + Chrome announces on: tab-in, arrow navigation, activation, and pre-set/externally-controlled state
- [ ] ARIA role ownership rules satisfied — required ancestor/child roles are present (e.g., `role="radio"` inside `role="radiogroup"`, `role="tab"` inside `role="tablist"`)
- [ ] `aria-setsize` / `aria-posinset` set where the user needs position context ("3 of 7")
- [ ] Keyboard navigation model documented for AT users via a sr-only `aria-describedby` hint on the widget
- [ ] Empty, disabled, or out-of-gamut cells/items are labeled — silence in virtual cursor mode reads as broken

---

## Breaking change declaration

_A breaking change is any of the following. If none apply, check the first box and move on._

- [ ] No breaking changes in this PR
- [ ] **Token rename or removal** — consumers using `var(--old-name)` in plain CSS will silently break
- [ ] **Component input/output rename or removal** — consumer templates will silently break
- [ ] **ARIA pattern change** — consumers who have built on the component's AT structure (e.g., `aria-labelledby` relationships, role assumptions) will need to update
- [ ] **Visual breaking change** — consumers running screenshot regression tests will see failures

If any breaking change box is checked: version bump is included and `CHANGELOG.md` is updated.
