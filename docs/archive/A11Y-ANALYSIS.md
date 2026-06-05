# Candor Design System — Accessibility Audit Analysis

Cross-reference: findings data is in [`docs/A11Y-AUDIT.md`](../A11Y-AUDIT.md).

This document synthesises trends observed across two full audits: the **Angular-era audit** (26 components, completed before the WC launch) and the **WC-era audit** (`@candor-design/web-components`, 26 Lit 3 components, completed 2026-05-17). It is intended to inform documentation strategy, component authoring conventions, and review priorities for future work.

---

## Summary statistics

### Angular-era audit

| Phase | Components | Issues found | Issues fixed |
|---|---|---|---|
| 1 — Custom composite widgets | 6 | 13 | 13 |
| 2 — Form controls | 6 | 9 | 9 |
| 3 — Feedback & live regions | 3 | 1 | 1 |
| 4 — Navigation & structural | 5 | 1 | 1 |
| 5 — Display & typography | 6 | 2 | 2 |
| **Total** | **26** | **26** | **26** |

11 of 26 components were clean on first pass. All 26 signed off.

### WC-era audit (SR + keyboard personas)

| Phase | Components | Issues found | Issues fixed |
|---|---|---|---|
| 1 — Custom composite widgets | 6 | 6 | 5 fixed + 1 withdrawn |
| 2 — Form controls | 6 | 1 | 1 |
| 3 — Feedback & live regions | 3 | 1 | 1 |
| 4 — Navigation & structural | 5 | 0 | — (1 design caveat) |
| 5 — Display & typography | 6 | 0 | — |
| **Total** | **26** | **8** | **7 fixed + 1 withdrawn** |

20 of 26 components were clean on first pass. All 26 signed off. The lower issue count vs. the Angular audit reflects both Angular-era fixes being baked into the WC ports and the narrower persona scope (two personas vs. a full WCAG coverage target).

---

## Trend 1 — Live region pre-establishment is the most misunderstood pattern

**Angular-era affected components:** Input (#7), DataGrid (#2), ChatInput (#12)

Three separate components failed the same way: either conditionally rendering a live region (`@if (error())` wrapping the description div) or omitting one entirely. The root cause is a mental model where the DOM element and its content are treated as one thing, when AT treats them separately. The region must exist before the content arrives; the content *change* is what fires the announcement.

**Pattern that emerged from fixes:**
```html
<!-- Always in DOM — empty when unused. The @if / conditional is INSIDE, not outside. -->
<div role="status" aria-live="polite" aria-atomic="true">
  @if (condition) { {{ message }} }
</div>
```

**WC-era status:** All three affected Angular components were ported to WC with the fix already in place — Input's pre-established description region, ChatInput's send-confirmation region, and DataGrid's activation-feedback region all follow the correct pattern. No WC components regressed on this pattern.

The principle carries forward unchanged: treat the live region element as infrastructure, not as conditional content. This applies to both Angular template control flow (`@if`) and Lit conditional renders (`${condition ? html\`...\` : nothing}`) — the region container must be unconditional in both.

---

## Trend 2 — The host-element ARIA trap is harder to fix in shadow DOM

**Angular-era affected components:** Switch (#10), Slider (#11), Navigation badges (#16)

Angular wraps every component in a host element (`<app-switch>`, etc.) that sits between the consumer's template and the semantically meaningful inner element. Developers put `aria-label` on `<app-switch>` expecting it to reach the inner `<input role="switch">` — it doesn't. The established Angular fix: expose an `ariaLabel = input<string>()` on the component class and bind `[attr.aria-label]="ariaLabel() || null"` directly on the inner element.

**WC-era — same trap, harder fix:**

The same consumer expectation applies to WC — `<candor-switch aria-label="Night mode">` — but the shadow DOM makes the fix significantly more complex:

1. **`role="none"` on the host is insufficient.** ARIA's presentational-role conflict resolution preserves the host's accessible name when `aria-label` is set, even if `role="none"` is present. The attribute itself must be removed.
2. **Simply mirroring inward causes double-announcement.** Without stripping the attribute from the host, SR users hear the name twice: once from the host's own AT entry, once from the inner element's name. This was BL-1 in the WC audit (TonePicker and Tabs were the first manifestations; 8 components total affected).
3. **Lit's `@property({ attribute: 'aria-label' })` cannot be used** for this pattern. Lit's attribute observer re-fires the setter each time the attribute changes — stripping the attribute from the host would re-clear the cached value on the next observer tick, defeating the fix.

**The WC fix — `observeHostAriaLabel` helper** (`src/web-components/utils/host-aria.ts`):
```typescript
import { observeHostAriaLabel } from '../../utils/host-aria';

@state() private _ariaLabel = '';
private _stopObservingAriaLabel?: () => void;

override connectedCallback() {
  super.connectedCallback();
  this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
}

override disconnectedCallback() {
  this._stopObservingAriaLabel?.();
  super.disconnectedCallback();
}

render() {
  return html`<input aria-label=${this._ariaLabel || nothing} />`;
}
```

The helper installs a MutationObserver on the host, fires the callback with the current value (and again on every change), and strips the attribute off the host after caching it. Observation survives multiple `aria-label` sets because the MutationObserver watches attribute mutations, not the initial value. Currently applied to: TonePicker, DataGrid, Tabs, Switch, Slider, Toolbar, Pagination, Button.

**Authoring rule for any WC that wraps a native interactive element:** use `observeHostAriaLabel`, not `@property({ attribute: 'aria-label' })`.

---

## Trend 3 — Complex custom widgets account for the majority of issues

**Angular-era:** Phase 1 (custom composite widgets) produced 13 of 26 total issues — 50% from 6 components.

**WC-era:** Phase 1 produced 6 of 8 total issues — 75% from 6 components. The ratio is higher in the WC audit because the per-component issue count dropped, but Phase 1 components still disproportionately dominate.

| Component | Angular issues | WC issues | Complexity |
|---|---|---|---|
| TonePicker | 4 | 2 (BL-1 + OOG noise) | Custom grid picker with ARIA radio grid |
| DataGrid | 3 | 0 | Custom keyboard-navigable grid |
| Modal | 4 | 1 (BL-2, withdrawn) | Custom dialog with focus trap |
| Tabs | 1 | 2 (BL-1 + panel-host) | Custom tablist pattern |
| Menu | 1 | 3 (BL-2/3/4) | Custom role="menu" with focus management |
| Accordion | 0 | 0 | Native `<details>`/`<summary>` |

Accordion — the only Phase 1 component using native HTML — had zero issues in both audits. Every component that built a custom interaction model from generic elements required explicit ARIA and got some of it wrong in at least one pass. The DataGrid's zero WC issues reflect that all three Angular-era fixes (hint + `aria-describedby`, status live region, corner `role="none"`) were carried forward correctly.

**The practical implication remains unchanged:** review effort should be weighted toward composite widgets, not distributed evenly. A new `<select>`-replacement needs more scrutiny than a new typography variant.

---

## Trend 4 — Stories are part of the accessibility surface (including a WC-specific failure mode)

**Angular-era story-level fixes: 6 of 15 total fixes**

Components whose stories were fixed (component itself was correct):
- Radio (#9) — `<fieldset>`/`<legend>` grouping
- Alert (#13) — `<label for>` / `<input id>` association in story
- Table (#23) — `<caption>`, `<th scope="row">`
- Navigation (#16) — `badgeLabel` demonstrated in `WithBadges` story

A story that demonstrates wrong usage is as harmful as a component bug, because stories are what developers copy into production. Treating stories as executable documentation changes how they are written: every story should demonstrate the surrounding markup that the component cannot provide on its own — `<fieldset>`/`<legend>` for radio groups, `<caption>` for tables, `for`/`id` for label associations.

**WC-era story-level finding: script-tag stripping (BL-3, Medium)**

The Storybook Angular renderer **strips inline `<script>` tags from story `template:` strings.** This is a silent failure: the component renders, but data-assignment code is never executed, leaving the component empty. BL-3 manifested as `<candor-menu>` rendering an empty `role="menu"` in the default story because the entries were assigned via `<script>document.getElementById(...).entries = [...]</script>`.

**WC story authoring rule: data must flow via attributes, not `<script>`:**
```html
<!-- ✗ WRONG — script tag stripped, element gets no entries -->
<candor-menu id="m"></candor-menu>
<script>document.getElementById('m').entries = [...];</script>

<!-- ✓ CORRECT — JSON-encoded attribute, parsed by @property({ type: Array }) -->
<candor-menu entries='${JSON.stringify(entries)}'></candor-menu>
```

This extends to any component that accepts array or object data: `rows`, `column-headers`, `items`, etc. The `@property({ type: Array })` / `@property({ type: Object })` decorators call `JSON.parse()` on the attribute value automatically, so no extra handling is needed in the component.

---

## Trend 5 — The OKLCH tool creates AT challenges that generic solutions can't solve

**Affected component:** Slider (#11)

The Slider's `aria-valuetext` issue surfaced something specific to this design system: axes whose min/max values are dynamically constrained by the selected hue cannot be meaningfully described by any auto-computed formatter. `"55%"` is correct for a lightness axis — but the same formula applied to a chroma axis with a dynamic ceiling would be meaningless.

The fix (`valueTextFn = input<(v: number) => string>()` in Angular; `@property({ type: Object }) valueTextFn` in WC) was the right call because the component cannot know what it is measuring. This pattern — where domain knowledge lives at the consumer level, not the component level — will apply again as the CPQI tool integrates live color-picking workflows.

**Established convention:** when a component's values are semantically opaque (units depend on context), expose a formatter callback input rather than attempting auto-computation. Applies to both the Angular and WC slider implementations.

---

## Trend 6 — Landmark pollution is a browser specification edge case

**Affected component:** Modal (#4)

`<header>` inside `<dialog>` gets `role="banner"` in Chrome — not because anyone put it there, but because the HTML spec only suppresses the implicit `banner` landmark for `<header>` when it is inside `article`, `aside`, `main`, `nav`, or `section`. Dialog is not on that list. `<footer>` similarly becomes `role="contentinfo"`.

These are correct-looking markup choices that produce wrong AT structure. They are invisible to visual inspection and will not appear in linting. They only surface in the AT tree.

**Fix pattern:** `role="none"` on `<header>` inside dialogs/panels; `<div>` instead of `<footer>` in slotted content.

**WC-era status:** The WC Modal port had both fixes in place from the first commit — the Angular audit's findings were carried forward directly. No regression. The same trap exists for any future overlay or panel component; the fix must be applied proactively at authoring time, not discovered in a post-hoc audit.

---

## Trend 7 — The clean components share a common property: they don't fight the platform

**Angular-era clean components:** Checkbox, Accordion, Breadcrumb, Toast, Progress, Heading, Badge, Card, Chip, Button, Stat

**WC-era clean on first pass:** DataGrid, Checkbox, Radio (SR pass), Switch, Slider, ChatInput, Alert, Toast, Progress, Navigation, Breadcrumb, Tooltip, Chip, Button, Badge, Stat, Table, Card, Heading, AccessibleText/Text/Article — 20 of 26.

In both audits, all clean components use native HTML semantics as the primary mechanism:
- Checkbox: `<label>` + `<input type="checkbox">`
- Accordion: `<details>`/`<summary>` — zero issues in both audits across both libraries
- Breadcrumb: `<nav>` + `<ol>` + `<a>` + `aria-current`
- Progress: native `role="progressbar"` attributes

The components that required remediation in both audits are the ones that built custom interaction models from generic elements. That is not a criticism — a grid picker or keyboard-navigable menu genuinely requires custom ARIA — but it confirms that every component stepping away from native semantics takes on explicit accessibility debt that must be paid at design time, not discovered in a post-hoc audit.

**Shadow DOM nuance:** native elements inside shadow roots still provide their native semantics (a `<button>` inside shadow DOM is a button, `<input type="checkbox">` is a checkbox). The platform-fighting penalty for ARIA constructs built from generic elements is the same in shadow DOM as in light DOM — and is compounded by shadow-DOM-specific limitations described in Trends 8 and 9 below.

---

## Trend 8 — Native browser form grouping fails across shadow-DOM sibling boundaries (WC-era, new)

**Affected component:** Radio (`candor-radio`) — KB-1

Each `<candor-radio>` lives in its own shadow root. The browser's native radio grouping — mutual exclusion by shared `name`, ArrowDown/Up navigation — only works for `<input type="radio">` elements that share the same form context in light DOM. Inputs across separate shadow roots are invisible to each other.

**What breaks:**
1. **Mutual exclusion** — clicking one `<candor-radio>` does not uncheck its siblings. After user interaction, multiple radios in the same group can be simultaneously checked.
2. **Arrow-key navigation** — the native single-Tab-stop, ArrowDown-to-next-option keyboard pattern is inoperative. Keyboard users must Tab into each radio separately and press Space to check it, which is both non-standard and much slower.

**The fix:** the component must implement the APG Radio Group keyboard model itself, without relying on the browser.

candor-radio's implementation (commit `5df1ba5`):
- **Discovery:** on ArrowDown/Right/Up/Left, Home, End — walk up to the nearest `<fieldset>` (falling back to the parent element) and query `candor-radio[name="..."]` to collect siblings.
- **Navigation:** ArrowDown/Right → next sibling (wraps to first); ArrowUp/Left → previous (wraps to last); Home → first; End → last. Disabled siblings are skipped in all directions.
- **Selection:** navigation moves focus AND selection together (checked state updates, `change` event fires, host `checked` property syncs).
- **Mutual exclusion** (commit `016dc87`): when a radio is checked, all discovered siblings have their `checked` property set to `false` before the new one is set to `true`.

**General rule:** any WC form control that relies on browser-native grouping behavior across sibling elements (radio mutual exclusion, checkbox-group selection, select option navigation) must implement that behavior manually when each instance is in its own shadow root. The `<fieldset>` walk pattern is the established convention for sibling discovery in this codebase.

---

## Trend 9 — Stateful form-element bindings need property syntax, not attribute syntax (WC-era, new)

**Affected components:** Checkbox, Switch, Accordion (discovered during WC keyboard audit — commit `551f2d8`)

Native form controls (`<input checked>`, `<details open>`, `<option selected>`, etc.) have a divergent state model: the HTML attribute seeds the *initial* state, but once the user interacts, the live **IDL property** (`input.checked`, `details.open`) becomes the source of truth. The attribute and the property drift apart after first interaction.

Lit's `?attr="${expr}"` binding writes the **attribute**. For non-stateful elements this is correct. For stateful form controls:

1. User clicks a checkbox → `input.checked = true` (live property).
2. Host re-renders with `?checked="${false}"` (e.g. parent state resets it).
3. Lit removes the `checked` attribute. But `input.checked` stays `true` — removing the attribute does not reset post-interaction live state.

The component appears stuck on-screen, and reads from `input.checked` return the wrong value.

**The fix: use Lit's property binding syntax for all stateful form controls:**

```html
<!-- ✗ WRONG — attribute binding, diverges from live state after user interaction -->
<input type="checkbox" ?checked="${this.checked}" />
<details ?open="${this.open}">

<!-- ✓ CORRECT — property binding, always overrides live state -->
<input type="checkbox" .checked="${this.checked}" />
<details .open="${this.open}">
```

Apply `.prop` syntax to: `<input>.checked`, `<input>.value`, `<select>.value`, `<option>.selected`, `<details>.open`, `<dialog>.open`.

**Also required: sync user-driven changes back to host state.** Property binding only fixes the host→DOM direction. For the DOM→host direction (user clicks/types, host property must update), listen to the appropriate change event:

| Element | Event | Property to sync |
|---|---|---|
| `<input type="checkbox\|radio">` | `change` | `this.checked = e.target.checked` |
| `<input type="text\|email\|…">` / `<textarea>` | `input` | `this.value = e.target.value` |
| `<select>` | `change` | `this.value = e.target.value` |
| `<details>` | `toggle` | `this.open = e.target.open` |

Without the event listener, the host's property silently desyncs whenever the user interacts — the DOM updates, but the host state is stale, so the next render reverts the UI to the (wrong) host value.

---

## Recommendations for future work

These are discussed further in CLAUDE.md and design system documentation:

1. **Live-region checklist** — the pre-establishment pattern is now a CLAUDE.md convention. For any new component producing feedback (form errors, confirmations, activation results): region element unconditional in the template, conditional content inside it.

2. **Host-element ARIA trap** — fully documented for both libraries. Angular: expose `ariaLabel = input<string>()` bound to the inner element. WC: use `observeHostAriaLabel` from `src/web-components/utils/host-aria.ts`. `@property({ attribute: 'aria-label' })` is not a valid shortcut.

3. **Weight review effort toward composite widgets.** A new custom picker or overlay warrants a screen-reader walkthrough at PR time, not just visual review. The Phase 1 dominance (13/26 Angular, 6/8 WC) is stable data, not noise.

4. **Stories are AT documentation** — two failure modes to avoid:
   - Angular / shared pattern: grouping, labelling, and table semantics must be demonstrated at the consumer level (`<fieldset>`/`<legend>`, `<caption>`, `<label for>`).
   - WC-specific: `<script>` blocks in story `template:` strings are stripped. Always inject component data via JSON-encoded attributes.

5. **Shadow-DOM form groups need manual grouping shims.** The `candor-radio` implementation (fieldset-walk discovery, APG arrow-key model, explicit mutual exclusion) is the reference pattern. Reuse the pattern for any future WC grouped control (checkbox-group, segmented button, etc.).

6. **Property binding for stateful form controls.** `.checked`, `.open`, `.selected`, `.value` — always `.prop` syntax in Lit, never `?attr`. Pair with the appropriate `change` / `input` / `toggle` event listener. This is now documented in CLAUDE.md's Common Pitfalls and in the "Stateful form-element bindings" authoring section.

7. **Run a real NVDA + Chrome session.** The current audits relied on Playwright's AT snapshot and DOM probing. Playwright's snapshot reports `<summary>` as `generic` (not the disclosure button NVDA reads), and the `aria-hidden` rendering of SVGs differs from what NVDA's IAccessible2 layer sees. A real NVDA pass would validate the Accordion `<summary>` announcements and confirm the BL-1 host-attribute removal behavior.

8. **Expand to additional AT personas.** Current scope: screen-reader (NVDA + Chrome) + keyboard-only. Still out of scope: voice-control, switch-control, magnification, low-vision-without-SR. Each is a distinct audit lens requiring a distinct walkthrough method.
