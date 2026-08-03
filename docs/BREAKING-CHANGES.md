# Breaking Change Policy

This document defines what constitutes a breaking change in Candor, how changes are classified for semantic versioning, and the required format for migration notes.

---

## Why design system breaking changes are different

In a code library, TypeScript catches most breaking changes at compile time. In a design system, most breaking changes are **silent** — they produce no compile error but break consumers at runtime, in CSS, in AT trees, or in screenshot tests:

- Renaming `--color-primary` to `--color-brand-primary` breaks every consumer using the old token in plain CSS — TypeScript never sees it
- Changing a component's ARIA structure can break consumer AT test suites without touching any TypeScript
- A visual change significant enough to shift contrast can break consumer screenshot regression tests

As a result, the bar for "breaking" is higher and less obvious than for a pure code library. When in doubt, classify as breaking.

---

## Version classification

### Major (breaking) — requires consumer action

| Change type | Example |
|---|---|
| Design token renamed | `--color-primary` → `--color-brand-primary` |
| Design token removed | `--spacing-xl` deleted entirely |
| Token value changed significantly | Primary hue shifted 30°, contrast ratio changed |
| Component input renamed | `[label]` → `[displayLabel]` |
| Component input removed | `[hint]` removed |
| Component output renamed or removed | `(valueChange)` removed |
| Default value changed in a behaviour-affecting way | `orientation` default changed from `horizontal` to `vertical` |
| ARIA role or structure changed | `role="grid"` replaced with `role="listbox"` |
| ARIA relationship changed | `aria-labelledby` target element removed or renamed |
| Keyboard navigation model changed | Arrow keys now wrap; previously they stopped at edges |
| Focus management changed | Focus no longer moves into dialog on open |
| Host element selector renamed | `app-switch` → `app-toggle` |
| `::part` name renamed or removed | `part="button"` renamed or dropped |
| Style custom property renamed or removed | `--candor-button-min-height` renamed or dropped |

### Minor (additive) — no consumer action required

| Change type | Example |
|---|---|
| New component added | New `Stepper` component |
| New design token added | `--color-accent-muted` added |
| New component input added (with a default) | `[size]` input added, defaults to `'md'` |
| New component output added | `(opened)` output added to Modal |
| New ARIA attribute exposed (additive) | `ariaDescribedBy` input added |
| New `::part` exposed on an internal | `part="icon"` added |
| New style custom property exposed (token-defaulted) | `--candor-input-font-size` added |
| Token value adjusted within tolerance | Lightness nudged 2% for contrast headroom |
| Visual refinement without contract change | Border radius adjusted, shadow softened |
| Story added or updated | New `Compact` story variant |
| Documentation updated | CLAUDE.md, docs/ updated |

### Patch — no consumer action required, no new API

| Change type | Example |
|---|---|
| Bug fix (no API change) | Focus trap in Modal was not releasing correctly |
| Accessibility fix (no consumer markup impact) | Live region pre-establishment corrected internally |
| Internal refactor | Signal type changed from `signal()` to `model()` internally |
| Story or documentation fix | Story markup corrected |
| Infrastructure / tooling | CI pipeline updated |

---

## Migration notes

Every **major** version bump requires a migration note in `CHANGELOG.md`. Use this template:

```markdown
## [X.0.0] — YYYY-MM-DD

### Breaking changes

#### <Short description of what changed>

**Before:**
```<language>
<what consumers had before>
```

**After:**
```<language>
<what consumers need now>
```

**Why:** <One sentence on the motivation — design decision, a11y fix, API cleanup.>

**Migration:** <What the consumer needs to do. Be specific — token find-replace, input rename, markup update.>
```

Example:

```markdown
#### Design token renamed: `--color-primary` → `--color-brand-primary`

**Before:**
```css
color: var(--color-primary);
```

**After:**
```css
color: var(--color-brand-primary);
```

**Why:** Namespacing tokens by category to prevent collisions as the token set grows.

**Migration:** Find and replace `--color-primary` with `--color-brand-primary` across all CSS, SCSS, and inline styles.
```

---

## Deprecation policy

Some breaking changes can ship their replacement *first*, so consumers migrate on a working system instead of a broken one. Renaming an event or an input is the common case: both names can coexist for a while.

**The rule: a deprecated API must remain emitted, and documented as deprecated, for at least one full MINOR release before a MAJOR may remove it.**

That is a floor, not a target. Three conditions all have to hold before removal:

1. **The replacement shipped in a released MINOR**, not merely on `main`. A consumer cannot migrate to something they cannot install.
2. **Both names are documented together** — in the component's own story, not only in the Introduction. The component page is where a consumer looks before wiring anything up, so a deprecation documented only centrally has not really been announced. (This was the gap #215 fixed: the aliases were deprecated in 4.2.0 while all three component stories still taught the old name and never mentioned the new one, which grew the migration burden the deprecation existed to shrink.)
3. **A MAJOR is being cut for other reasons.** Removing deprecated API is not on its own a good reason to break consumers — see the opening section on why the bar here is higher than in a pure code library. Deprecations wait for a major that has its own justification.

### Why a floor rather than a fixed duration

A calendar duration would be arbitrary at this maturity, and would either block a release or wave one through on the strength of the date alone. The three conditions are the things that actually determine whether a consumer *could* have migrated.

### Prefer a compile-time signal

`addEventListener` accepts any string, so a listener bound to a removed event stays valid TypeScript and valid DOM — it just never fires. The break is silent, and the symptom is an inert control rather than a build error. Where a rename can also be expressed in the published types (a renamed exported `*Detail` type, a changed `*EventMap` member), do that too: it is the only part of the change a consumer's compiler will catch for them. Say so explicitly in the migration note, and say which parts it will *not* catch.

### Precedent

`input-change`, `value-change` and `selected-change` were deprecated in **4.2.0** (2026-07-12) and removed in **5.0.0** — one minor release, alongside a major cut primarily for the sRGB gamut invariant. The 5.0.0 event-name convergence that accompanied it (`closed` → `close`, `clicked` removed, and so on) had **no** deprecation period, which is the exception this policy allows only because those names had never been announced as changing and the alternative was a second major dedicated to event names.

---

## Special cases

### ARIA changes

When a component's ARIA structure changes in a way that could break consumer AT tests or `aria-labelledby` / `aria-describedby` relationships built on top of it:

- Classify as **major**
- In the migration note, explicitly describe the old AT structure and the new AT structure — not just the code change
- Flag that consumer screen reader tests will need to be re-run

### Token value changes

A token value change is **minor** if it stays within the design system's contrast tolerance (WCAG 2.1 AA, APCA ≥ 75 Lc for body text) and does not require consumers to update their own contrast calculations.

It is **major** if it shifts a color enough that consumers who have built on that token for contrast pairs will be broken.

### Consumer responsibility

The conformance model distinguishes what the library guarantees from what the consumer owns (see `docs/ACCESSIBILITY-CONFORMANCE.md`). Changes to consumer-responsibility patterns — such as requiring `<fieldset>`/`<legend>` around radio groups — are documented as recommended practice updates, not breaking changes, because the library never enforced them.

---

## Migration notes

### v3.0.0

#### Angular reference component library removed

The Angular standalone-component library (`src/app/components/`) has been removed. `@candor-design/web-components` (Lit 3 custom elements) is now the sole, canonical component surface.

**Consumer impact:** None. The Angular library was an internal feature-parity benchmark — it was **never published** as an npm package. Only `@candor-design/tokens` and `@candor-design/web-components` are distributed, and neither is affected. No `var(--...)` token, custom-element tag, attribute, or event changed.

**Migration:** Teams on Angular consume Candor through `@candor-design/web-components` — the custom elements work in any framework, including Angular (add `CUSTOM_ELEMENTS_SCHEMA` to the consuming module/component). See the README for usage.

### v2.0.0 (Phase 1)

#### `title` input renamed to `heading` on AccordionItem, Alert, Modal, Toast

**Before:**
```html
<app-accordion-item title="Section heading">...</app-accordion-item>
<app-alert title="Changes saved" message="..."></app-alert>
<app-modal [title]="dialogTitle" ...></app-modal>
<app-toast title="Success" message="..."></app-toast>
```

**After:**
```html
<app-accordion-item heading="Section heading">...</app-accordion-item>
<app-alert heading="Changes saved" message="..."></app-alert>
<app-modal [heading]="dialogTitle" ...></app-modal>
<app-toast heading="Success" message="..."></app-toast>
```

**Why:** Angular reflects unrecognised attribute bindings onto the host element. An input named `title` caused the browser's native tooltip to appear on hover, echoing the component's heading text — a spurious UX behaviour reported by multiple downstream projects.

**Migration:** Find and replace `[title]=` with `[heading]=` and `title="` with `heading="` on `app-accordion-item`, `app-alert`, `app-modal`, and `app-toast` elements. Note: only replace the Angular input binding, not the Storybook `meta.title` field or unrelated HTML `title` attributes.

---

## Changelog format

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) with semantic versioning.

Each release entry has sections in this order (omit empty sections):

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Breaking changes
### Added
### Changed
### Fixed
### Deprecated
### Removed
```
