# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Candor is a design system distributed as three layers, all developed in a single Storybook so the same stories validate every layer:

1. **`@candor-design/tokens`** — the CSS custom-property layer (OKLCH colors, spacing, typography). Everything else is built on top of this.
2. **`@candor-design/web-components`** — the primary consumer-facing component library: 34 Lit 3 custom elements. Framework-agnostic; the WC stories under `Components/`, `Typography/`, `Design Tokens/`, and `Examples/` are the canonical surface.
3. **Angular component library** (`src/app/`) — the same component API expressed as Angular standalone components, for teams already on Angular. Stories live under `Angular Components/` in the Storybook tree.

The workflow targets AI-assisted design iteration with real-time accessibility validation: receive art-direction specs, implement them in design tokens, validate accessibility using the klar CLI for color contrast, and inspect visually with Playwright MCP. Token changes propagate to both component layers because both consume the same CSS custom properties.

## Design Philosophy

### Candor is a humanist design system

Candor's typefaces and OKLCH color system model human vision and the humanist typographic tradition. Every element — including technical, data-heavy, or machine-generated content — should feel like a considered, human-authored artifact.

- Clinical harshness is not "appropriate for technical content" — it is a failure of the system's character.
- Maximum contrast is not automatically correct. 19.4:1 white-on-dark is a machine default, not a design decision.
- **Flag proactively:** when implementing components where clinical defaults would be easy (code blocks, tables, form inputs, data displays), name the humanist/legibility tension rather than silently resolving it.

---

## Essential Commands

### Development
```bash
npm run storybook          # Start Storybook on http://localhost:6006
npm start                  # Start Angular dev server on http://localhost:4200
```

### Testing
```bash
npm run test:playwright    # Run all Playwright tests (auto-starts Storybook)
npm run test:playwright:ui # Run Playwright in UI mode
npx playwright show-report # View test results
npm test                   # Run Angular unit tests (Karma)
```

### Building
```bash
npm run build              # Build Angular app
npm run build-storybook    # Build static Storybook
```

### Playwright Browser Setup
```bash
npx playwright install chromium  # Install Chromium browser for tests
```

## Architecture

### Design Token System (Core Concept)

All visual styling flows from design tokens in `src/design-tokens/`:
- **colors.scss**: OKLCH color definitions (not hex/RGB)
- **typography.scss**: Font families, sizes (Major Third 1.25 ratio), weights, line heights
- **spacing.scss**: 8px grid system
- **index.scss**: Aggregates and exports all tokens

**Critical**: Always modify tokens first, never hard-code values in components. Components import tokens via `@use '../../../design-tokens'`.

### OKLCH Color Space

Colors use OKLCH format: `oklch(L C H)` where:
- L = lightness (0-1)
- C = chroma/saturation
- H = hue (degrees)


### Component Structure

Two parallel component libraries share the token layer:

**Web components** (`src/web-components/components/`, the primary surface):
- Each component has a `candor-{name}.ts` (Lit class) + `candor-{name}.stories.ts`. Styles live inside the class via `static styles = css\`...\``.
- Stories use the same `@storybook/angular` Meta type but render via `template:` literal strings containing custom-element markup.
- Components register themselves on import via `@customElement('candor-{name}')` — pulling `src/web-components/index.ts` is enough to register all 34 tags.
- Shadow DOM by default. CSS custom properties pierce shadow boundaries, so tokens reach inner styles without per-component injection.

**Angular components** (`src/app/components/`):
- Each component has: `.ts`, `.scss`, `.stories.ts` files
- Stories demonstrate all variants and states
- Components use `:host` selector for scoping
- All components are standalone (no NgModule)

When porting a new feature: implement it in both libraries unless explicitly scoped to one. The WC version is canonical for consumers; the Angular version exists for parity with the Angular library's history. Mirror the API names (props, events) across the two so docs stay valid for both.

**Component categories** (same shape in both libraries):
- `typography/`: heading, text, accessible-text, article
- `button/`: button with variants (primary, secondary, tertiary, ghost)
- `form/`: input, checkbox, radio, switch, slider, select, listbox, combobox, chat-input
- `data/`: table, data-grid, tone-picker
- `overlays/`: modal, drawer, tooltip, toast
- `examples/`: composed stories (color-iterator, settings, article, chat, editor, etc.)

### Storybook Configuration

- Config in `.storybook/main.ts`
- Stories auto-discovered from `src/**/*.stories.ts`
- Accessibility addon enabled (`@storybook/addon-a11y`)
- Runs on port 6006

### Playwright Testing

- Config: `playwright.config.ts`
- Tests in `tests/` directory
- Auto-starts Storybook via webServer config
- Base URL: http://localhost:6006
- Screenshot on failure, trace on first retry

## Design Iteration Workflow

### Typical Session Flow

1. **Receive art direction**: Colors (hex), fonts, spacing requirements
2. **Convert to OKLCH**: Run `klar meta <hex>` on each color to get exact OKLCH values
3. **Update tokens**: Modify `src/design-tokens/semantics.scss` (or `primitives.scss`). After any change, re-export the DTCG artifact: `npm run audit:tokens`
4. **Visual check**: Use Playwright MCP to screenshot Storybook stories
5. **Mobile check**: Switch Storybook's viewport toolbar to **mobile1 (320 × 568)** and verify: no horizontal overflow, no clipped interactive elements, no layout broken by a fixed column count
6. **Accessibility validation**: Run `klar contrast <fg> <bg> -q` to check contrast ratios. For each token you changed, grep `audit/pairings.json` for its DTCG name (e.g. `color.text.subtle`) to find every pairing that references it — then validate each with klar. The `min` field in each pairing entry is the Candor-policy OKCA floor for that pairing.
7. **Iterate**: If violations found, run `klar find <bg> <color> --target 4.5 -q` for compliant alternatives
8. **Report**: Document original specs vs. final implementation, constraints identified

### Audit Artifacts

Two machine-readable files in `audit/` serve as the canonical inputs for contrast audits. Keep them current as tokens and components evolve.

**`audit/tokens.dtcg.json`** — auto-generated, do not edit by hand.
- Produced by `npm run audit:tokens` (runs `scripts/export-tokens-dtcg.js`).
- Contains all `--color-*` tokens with resolved `oklch()` values in W3C DTCG format, split into `light` and `dark` mode objects.
- Tokens annotated "icon/border use" in `semantics.scss` carry `$extensions.usage: "non-text"` — these are the tokens that must NOT be used as CSS `color:` values for text.
- Re-run whenever `src/design-tokens/semantics.scss` or `src/design-tokens/primitives.scss` changes.

**`audit/pairings.json`** — hand-authored, update alongside component changes.
- 87 foreground/background pairings covering all 34 WC components.
- Each entry: `{ id, fg, bg, size, weight, min }` using DTCG token references (`{color.status.error-text}`) and an explicit pixel size and weight.
- `min` is the Candor-policy OKCA floor for that specific pairing — it encodes the tier table from the "OKCA Contrast Thresholds" section above. It is **not** a klar/OKCA standard; it belongs to this design system.
- When you change a color token: grep `audit/pairings.json` for the token name → find every affected pairing → re-validate those pairs with `klar contrast`.
- When you add a new component: add entries for every unique `color:` declaration in the component's CSS, following the tier classification rules above.
- When you add a new semantic token or rename one: update both `tokens.dtcg.json` (re-run the script) and any pairings that reference the old token name.

### Integration Points

**klar CLI** (`klar --version` to confirm availability):
```bash
klar meta <hex>                                      # Convert hex → OKLCH + color metadata
klar contrast <fg> <bg> -q                           # Check contrast ratio (OKCA, WCAG-compatible)
klar contrast <fg> <bg> --type deltaE -q             # Perceptual drift between two colors
klar contrast <fg> <bg> --type apca -q               # APCA Lc score
klar find <bg> <color> --target 4.5 -q               # Find lightness-adjusted compliant color
klar variants <hex>                                  # Generate a perceptually-spaced tonal grid
klar match <color1> <color2>                         # Match chroma of two colors for palette harmony
klar lightness <hex>                                 # Min/max lightness range for a color in sRGB gamut
klar pair                                            # Random accessible color pair (seed for exploration)
klar plugins list                                    # List installed contrast algorithm plugins
```

**klar key rules:**
- **OKCA is the default** — WCAG 2.x-compatible ratio on the 1–21 scale, no `--type` flag needed
- **OKCA is polarity-aware** — argument order matters: `klar contrast <foreground> <background>`. Light-on-dark caps near 21; dark-on-light caps near 20; the same chromatic pair returns different numbers when swapped
- **deltaE is the art director's metric** — answers "did it change much?"; < 3 imperceptible, 5–10 acceptable drift, 11+ clearly different
- **Installed plugins** (available via `--type`): `apca` (APCA Lc), `bpca` (Bridge-PCA WCAG ratio), `min-dimension` (minimum px size for non-text UI elements)

See `docs/KLAR-INTEGRATION.md` for full command reference (local file, not in repo).

**When Playwright MCP is connected**:
- Navigate to stories: `browser_navigate`
- Screenshot components: `browser_take_screenshot`
- Test interactions: `browser_click`, `browser_type`, `browser_press_key`

**AT snapshot workflow** (for accessibility audits):
1. Navigate to the story iframe directly: `http://localhost:6006/iframe.html?id={story-id}&viewMode=story`
   - Story ID format: `{title-path-kebab}--{story-name-kebab}` (e.g. `components-form-switch--default`)
2. Call `browser_wait_for time:2` — snapshot on first navigation is empty without this wait
3. Call `browser_snapshot` to get the accessibility tree
4. For ARIA attributes not shown in the snapshot (e.g. `aria-valuetext` on sliders), verify with `browser_evaluate`: `document.querySelector('input[type=range]').getAttribute('aria-valuetext')`

## Typography Usage Rules

### Roboto Flex (`--font-family-display`, `--font-family-base`)

Roboto Flex is a **variable font** with axes beyond `font-weight`:
- `opsz` (optical size): stroke weight adapts to text size — larger text gets heavier strokes naturally
- `GRAD` (grade): subtle weight adjustment without changing letterform width
- `wdth` (width): condensed to expanded

**Before adjusting `font-weight` for hierarchy, ask whether the variable axes can do it better:**
- `font-optical-sizing: auto` — browser automatically maps `opsz` to computed font size, creating a natural optical weight gradient across heading levels. Use this on all heading contexts.
- `font-variation-settings: 'GRAD' -50` — fine-tune apparent weight for a specific element without touching the weight axis

**The trap:** Reaching for `font-weight: semibold` feels natural but produces an artificial numeric step. The `opsz` axis creates hierarchy that feels designed, not engineered.

See `docs/LESSONS-LEARNED.md` for the full rationale.

### Atkinson Hyperlegible (`--font-family-accessible`)

Atkinson is the designated typeface for **instructional UI text** — text the user must read precisely to know what to do next.

#### Instruction vs. comprehension — the core authoring decision

The question is not "is this text important?" All text in a well-designed UI is important. The question is: **does the user need to read this precisely to know what to do next?**

- **Use Atkinson (`candor-accessible-text`)** for instructional text: form field labels, validation errors, status changes, action-required hints. The user must read these correctly to take the right action.
- **Use Roboto Flex (`--font-family-base`)** for comprehension text: data values, classification results, section headings that organise data, body prose. The user reads these to form a judgment, not to follow an instruction.

**Examples of the distinction:**
```html
<!-- ✓ Instructional — user must read this to know what to fix -->
<candor-accessible-text role_="status" color="error">Enter a valid National Insurance number.</candor-accessible-text>

<!-- ✗ Not instructional — user reads this to understand data -->
<candor-accessible-text role_="annotation">87% confidence</candor-accessible-text>
<!-- ✓ Correct for comprehension data -->
<span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">87%</span>
```

**Section headings that label data** (e.g. "Classification breakdown") are comprehension text — they organise data, they don't instruct. Use `<candor-text variant="label">` (Roboto Flex uppercase) not `<candor-accessible-text role_="label">`.

#### The four roles

| Role | Use case | Size | Weight | Style |
|---|---|---|---|---|
| `label` | Form field labels, structural anchors in instructional contexts | 14px | bold | uppercase |
| `message` | System messages, body-length guidance the user must act on | 16px | regular | — |
| `status` | Validation errors, live counters, state changes | 14px | regular | — |
| `annotation` | Hints, constraints, legal small print that guide an action | 14px | regular | italic |

#### Bold weight rules

- **Use bold only for hierarchy/labeling** — `role_="label"` renders bold automatically
- **Do NOT use bold for urgency** — error messages and status text use regular weight; the error color carries urgency. Bold on top of error color is double-emphasis and disrupts hierarchy
- The `bold` attribute exists for intentional overrides but should rarely be needed outside of `role_="label"` contexts

```html
<!-- ✓ Regular for status — color carries urgency -->
<candor-accessible-text role_="status" color="error">Enter a valid number.</candor-accessible-text>

<!-- ✗ Wrong — bold + error color is double-emphasis -->
<candor-accessible-text role_="status" color="error" bold>Enter a valid number.</candor-accessible-text>
```

### Atkinson Tracking

Atkinson Hyperlegible requires positive letter-spacing to prevent glyph clustering (adjacent glyphs like "rr" reading as "m"). Apply `letter-spacing` based on context:

| Context | Value | Reason |
|---|---|---|
| Badges | `0.06em` | Small size (14px) needs more air |
| Body roles (message, status, annotation) | `0.02em` | 16px has more natural spacing |
| Labels (uppercase) | `var(--letter-spacing-wide)` = `0.05em` | Uppercase already benefits from tracking |

**Never use `letter-spacing: 0` or `--letter-spacing-normal` with Atkinson** — always apply positive tracking.

### Text Size Floor

No readable text in the system should fall below **14px** (`--font-size-sm` = `0.875rem`). This is enforced at the primitive token level. `--text-xs` (12px) is for decorative/non-text use only (icons, badges chrome).

### OKCA Contrast Thresholds — Two Axes

Contrast requirements have **two axes**: font size and use-case tier. **Never apply a single threshold to all 14px text.**

**Size axis (Tier 1 baseline):**

| Size | Regular | Bold |
|---|---|---|
| ≥ 24px | 3.0 | 3.0 |
| 19–23px | 4.5 | 3.0 |
| 16–18px (`--font-size-md`) | 4.5 | 4.5 |
| **14px (`--font-size-sm`)** | **9.5** | **6.5** |
| 12px (`--font-size-xs`) | decorative only | decorative only |

**Use-case tier axis — 14px adjustments:**

| Tier | Perceptual task | 14px regular | 14px bold | Candor components |
|---|---|---|---|---|
| **1 — Reading** | Sequential decoding — must read to act | **9.5** | **6.5** | Alert body, toast message, modal prose, form error messages, article body |
| **2 — Functional UI** | Recognition — sole channel for meaning | **6.5** | **4.5** | Pagination numbers, breadcrumb links, table cell data, chip labels, button labels |
| **3 — Supplementary** | Pattern match — meaning redundantly coded | **4.5** | **4.5** | Badge text, hint text, figcaptions, stat labels, table metadata, breadcrumb separators, pagination ellipsis |

**Key audit rules:**
- `--color-text-subtle` (OKCA 4.6 on page) passes Tier 2 bold and Tier 3 at any weight — **do not "fix" these**.
- Tier 2 regular (6.5) is the threshold where text-subtle fails — the fix is **bold weight**, not a color change or size bump.
- Tier 1 failures at 14px are genuine and typically require bumping to 16px (e.g. alert body, toast).
- Tier 3 requires a **redundant non-color channel** (shape, icon, spatial position) — it is assigned by the system, not a consumer opt-in.

## Responsive Layout Patterns

### Two-column grid

Never use `grid-template-columns: 1fr 1fr` — it forces two columns even when the container is too narrow. Use the intrinsic grid idiom instead:

```css
/* Two columns that stack gracefully at narrow viewports — no media query needed */
grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
```

`min(100%, 240px)` prevents any column from exceeding the container width, so the grid degrades to single-column at small sizes automatically.

### Flex children containing long text

Flex children have `min-width: auto` by default, which prevents them from shrinking below their intrinsic content width. This causes text containing long unbreakable tokens (email addresses, URLs, IDs) to overflow the container. Fix:

```css
/* Allow a flex child to shrink below its content width */
.text-container {
  min-width: 0;
  overflow-wrap: break-word;
}
```

Apply whenever a flex child holds user-supplied content that may include long unbreakable strings.

## File Modifications Guidelines

### Modifying Design Tokens

**colors.scss**:
```scss
$color-primary: oklch(0.55 0.18 250); // Always use OKLCH format
```

**typography.scss**:
- Base size: `$font-size-md: 1rem` (16px)
- Scale follows Major Third ratio (1.25)
- Font stacks use system fallbacks

**spacing.scss**:
- All values are multiples of 8px
- Use `rem` units for scalability

### Creating New Components

1. Use Angular CLI or manual creation in `src/app/components/`
2. Create standalone component with SCSS
3. Import design tokens: `@use '../../../design-tokens' as tokens;`
4. Create `.stories.ts` file showcasing all variants
5. Export stories using CSF3 format
6. Add entries to `audit/pairings.json` for every unique `color:` declaration in the component — one entry per distinct fg/bg pairing. Classify each by tier (see "OKCA Contrast Thresholds") to determine the correct `min` value.

### Storybook Stories Format

Use Component Story Format 3 (CSF3):
```typescript
import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta<ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ComponentName>;

export const Default: Story = {
  args: {},
};
```

## Angular Configuration Notes

- Angular 21 (latest stable)
- Standalone components by default (configured in angular.json schematics)
- TypeScript 5.9
- SCSS for styling
- Component prefix: `app`
- Storybook builders configured in angular.json architect section
- **Zoneless mode enabled** - Zone.js is NOT included in polyfills (Angular 21+ zoneless change detection)

### Angular Control Flow Syntax (Zoneless Compatibility)

**CRITICAL**: This project uses Angular's modern built-in control flow syntax and runs in **zoneless mode**. You MUST use the following:

- **`@if` / `@else`** - NEVER use `*ngIf` or `NgIf` directive (requires Zone.js)
- **`@for`** - NEVER use `*ngFor` or `NgFor` directive (requires Zone.js)
- **`@switch` / `@case`** - NEVER use `[ngSwitch]`, `*ngSwitchCase`, or NgSwitch directives (requires Zone.js)

**Correct examples**:
```typescript
// ✓ CORRECT - Use @if
@if (condition) {
  <div>Content</div>
}

// ✓ CORRECT - Use @for
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

// ✓ CORRECT - Use @switch
@switch (value) {
  @case ('option1') {
    <div>Option 1</div>
  }
  @case ('option2') {
    <div>Option 2</div>
  }
}
```


### Angular Signal Types — Binding Behaviour

| Signal type | Bindable from parent template? | Use when |
|---|---|---|
| `signal<T>(value)` | No — internal state only | Value is owned by this component, never set from outside |
| `input<T>()` | Yes — one-way `[prop]="value"` | Read-only input from parent |
| `model<T>()` | Yes — two-way `[(prop)]="value"` | Value can flow in and out (selected item, toggle state) |

**The trap:** Using `signal()` where `model()` is needed silently breaks parent template bindings — no error is thrown and the binding is silently ignored. If a story or parent needs to set an initial value or react to changes, the component signal must be `model()`, not `signal()`.

### Zoneless + setTimeout

`setTimeout` callbacks do not trigger change detection in zoneless mode. If you mutate a signal inside `setTimeout`, call `cdr.markForCheck()` immediately after:

```typescript
private cdr = inject(ChangeDetectorRef);

onSend() {
  this.statusMessage.set('');
  setTimeout(() => {
    this.statusMessage.set('Message sent');
    this.cdr.markForCheck(); // required — zoneless doesn't detect setTimeout mutations
  }, 0);
}
```

### View Encapsulation and Projected Content

**NEVER use `::ng-deep`** — it is deprecated by the Angular team and will be removed.

When a component needs to style projected content (i.e., elements passed via `<ng-content>` or as string literals in stories), use `ViewEncapsulation.None` instead:

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-article',
  encapsulation: ViewEncapsulation.None,
  // ...
})
```

With `ViewEncapsulation.None`, Angular does not add scoping attributes, so descendant selectors in the component's SCSS reach projected elements. Scope the styles manually using the host element's class (set via the `host` binding) to prevent leakage:

```scss
// article.component.scss — scoped via host class, no ::ng-deep needed
.article {
  h1, h2, h3, h4 { ... }
  p { ... }
}
```

**Why `::ng-deep` fails for projected content**: Angular's emulated encapsulation adds a unique attribute (e.g. `_ngcontent-xxx`) to elements in the component's own template. Elements projected from outside (string literals in stories, or content from a parent template) receive the *parent's* scoping attribute, not the component's — so `:host h1 { }` never matches them. `ViewEncapsulation.None` sidesteps this entirely.

## Web Components Authoring Conventions

The WC library is the primary consumer-facing distribution. It is built on **Lit 3**, ships as `@candor-design/web-components`, and runs in any framework (or none).

### Component shape

```typescript
import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('candor-foo')
export class CandorFoo extends LitElement {
  static override styles = css`
    :host { display: block; }
    /* shadow-DOM-scoped CSS — design tokens reach inside via custom properties */
  `;

  @property() label = '';                                            // string attribute
  @property({ type: Boolean, reflect: true }) open = false;          // bool, reflected to DOM
  @property({ type: Array, attribute: 'menu-items' }) items = [];    // JSON-parsed from attribute
  // For aria-label: don't use @property — use observeHostAriaLabel (see "aria-label host-trap" below)
  @state() private _internal = 0;                                    // reactive but not part of public API

  override render() {
    return html`<button @click=${this._onClick}>${this.label}</button>`;
  }

  private _onClick = () => {
    this.dispatchEvent(new CustomEvent('foo-select', {
      detail: { value: this.label },
      bubbles: true,
      composed: true,
    }));
  };
}

declare global {
  interface HTMLElementTagNameMap { 'candor-foo': CandorFoo; }
}
```

Register the component in `src/web-components/index.ts` via `export * from './components/foo/candor-foo';`. The `@customElement()` call runs at import time, so a bare side-effect import registers the tag.

### Attribute / property naming

Lit's `@property()` lowercases the property name when computing the default HTML attribute name. So `columnHeaders` → attribute `columnheaders`, but the **JS property remains camelCase**.

**Always set an explicit kebab-case attribute on multi-word properties** so HTML markup is readable:

```typescript
@property({ type: Array, attribute: 'column-headers' }) columnHeaders: string[] = [];
//                       ^^^^^^^^^^^^^^^^^^^^^^^^^^ — without this, attribute is "columnheaders"
```

**Pass JSON via attributes** (matches the data-grid story pattern):

```html
<candor-data-grid
  rows='${JSON.stringify(rows)}'
  column-headers='${JSON.stringify(headers)}'>
</candor-data-grid>
```

`@property({ type: Array })` calls `JSON.parse()` on the attribute value automatically. JS-side setters use the camelCase name (`el.columnHeaders = [...]`), not the lowercased attribute name.

### Custom events

Outputs are DOM `CustomEvent`s, not Angular `Output()`s. Always set `bubbles: true, composed: true` so the event crosses the shadow boundary; otherwise listeners on light-DOM ancestors never see it. Use kebab-case event names (`color-select`, `cell-activate`) to match HTML convention.

Add the event to the global event map if consumers need typed listeners — though most projects bind via `@event-name=...` in templates and don't need this.

### aria-label host-trap

ARIA attributes on the custom element host (`<candor-input aria-label="Email">`) do **not** propagate to the inner `<input>` inside the shadow DOM — browsers treat the host as a generic container for ARIA purposes — AND if you simply mirror the attribute inward, the host also gets a named generic in the AT tree, so screen readers hear the name **twice**.

The fix is two-step: mirror the value inward AND strip the attribute off the host. `role="none"` on the host is **not** sufficient — ARIA's presentational-role conflict resolution preserves the host's accessible name when `aria-label` is set. The attribute itself must be removed.

Use the shared `observeHostAriaLabel` helper from `src/web-components/utils/host-aria.ts` — it installs a MutationObserver, mirrors the value into your state, and strips the attribute off the host:

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

**Don't** use `@property({ attribute: 'aria-label' })` for this — Lit's attribute observer would re-clear your cached value the moment you strip the attribute, defeating the fix. Manual observation via the helper avoids the reflection loop.

### Storybook templates: data must flow via attributes, not `<script>`

The Storybook stories use `@storybook/angular`'s renderer for both WC and Angular stories (single Storybook instance). The renderer **strips inline `<script>` tags** from `template:` strings, so this pattern silently leaves elements empty:

```html
<!-- ✗ WRONG — script tag is stripped, element gets no rows -->
<candor-data-grid id="my-grid"></candor-data-grid>
<script>document.getElementById('my-grid').rows = [...];</script>
```

Use attribute injection instead:

```html
<!-- ✓ CORRECT -->
<candor-data-grid rows='${JSON.stringify(rows)}' column-headers='${JSON.stringify(headers)}'></candor-data-grid>
```

### Stateful form-element bindings: use `.prop`, not `?attr`

Native form controls (`<input checked>`, `<input value>`, `<select value>`, `<option selected>`, `<details open>`, …) have a divergent state model: the HTML attribute (`checked`, `open`, …) seeds the *initial* state, but once the user interacts, the live **IDL property** (`input.checked`, `details.open`, …) is the source of truth. The attribute and the property drift apart.

Lit's `?attr` binding writes the HTML attribute, which diverges from the live IDL property (`input.checked`, `details.open`) after user interaction. The bug is invisible on screen and only surfaces programmatically.

**Use property binding for these cases** (Lit `.prop` syntax assigns the JS property each render, overriding the live state):

```html
<!-- ✗ WRONG — attribute binding, diverges from live state after user click -->
<input type="checkbox" ?checked="${this.checked}" />

<!-- ✓ CORRECT — property binding, always reflects host state -->
<input type="checkbox" .checked="${this.checked}" />
```

Apply to: `<input>.checked`, `<input>.value`, `<select>.value`, `<option>.selected`, `<details>.open`, `<dialog>.open`. (Dialog also wants `showModal()` / `close()` methods rather than `open` set directly — see candor-modal.)

**Mirror state back from user interactions.** Property binding only fixes the "host → DOM" direction. For the "DOM → host" direction (user clicks/types, host state needs to update), listen to the appropriate change event:

| Element | Event | Property to sync back |
|---|---|---|
| `<input type="checkbox\|radio">` | `change` | `this.checked = e.target.checked` |
| `<input type="text\|email\|…">` / `<textarea>` | `input` | `this.value = e.target.value` |
| `<select>` | `change` | `this.value = e.target.value` |
| `<details>` | `toggle` | `this.open = e.target.open` |

Without the toggle listener on `<details>`, the host's `open` property silently desyncs whenever the user clicks the `<summary>`.

### Shadow DOM scoping

All components use the default shadow DOM. Token CSS custom properties (`--color-…`, `--font-…`, `--spacing-…`) pierce shadow boundaries automatically — loading `candor-tokens.css` once in the consumer page is enough. Do **not** redeclare tokens inside `static styles` or hard-code OKLCH values.

For projected content (`<slot>`), use `::slotted()` selectors:

```css
::slotted(svg) { width: 1em; height: 1em; }
```

`::slotted()` only matches direct children of the slot, not descendants. For deeper styling, expose CSS custom properties consumers can set from outside.

### Lit lifecycle quick reference

| Hook | When | Use for |
|---|---|---|
| `connectedCallback()` | Element inserted into DOM | Subscribing to global events; remember to call `super.connectedCallback()` |
| `willUpdate(changed)` | Before each render | React to property changes that should affect this render |
| `updated(changed)` | After DOM is updated | Focus management, querying the shadow root |
| `disconnectedCallback()` | Element removed | Cleanup; remember `super.disconnectedCallback()` |

`willUpdate` is the equivalent of Angular's `effect()` for reacting to input changes — check `changed.has('propName')` to gate the work.

## Accessibility Authoring Conventions

These patterns emerged from the 26-component A11Y audit. See `docs/A11Y-AUDIT.md` for per-component findings (currently transitioning to a WC-focused, screen-reader-persona scope; historical Angular findings preserved in the same file) and `docs/archive/A11Y-ANALYSIS.md` for cross-cutting trend analysis from the Angular-era audit.

### Live region pre-establishment

A live region must exist in the DOM **before** content arrives. The `@if` belongs inside the region, not wrapping it:

```html
<!-- ✓ Region always in DOM — empty when unused -->
<div role="status" aria-live="polite" aria-atomic="true">
  @if (condition) { {{ message }} }
</div>

<!-- ✗ Region removed from DOM — AT misses the change -->
@if (condition) {
  <div role="status" aria-live="polite">{{ message }}</div>
}
```

### Host element ARIA trap (Angular-specific)

`aria-label` placed on `<app-foo>` in a consumer template **does not propagate** to the inner `<input>` or other interactive element inside the component. The host element is a generic container.

Fix: expose an `ariaLabel = input<string>()` on the component class and bind it to the inner element:

```typescript
ariaLabel = input<string>(); // in component class
```
```html
<input [attr.aria-label]="ariaLabel() || null" ...> <!-- in component template -->
```

This convention is established on: Switch, Slider, Button.

### Landmark pollution in dialogs/panels

`<header>` inside `<dialog>` gets implicit `role="banner"` in Chrome (HTML spec only suppresses this inside `article`, `aside`, `main`, `nav`, `section`). `<footer>` similarly becomes `role="contentinfo"`.

Fix: `role="none"` on `<header>` inside dialogs/panels; use `<div>` instead of `<footer>` in slotted content.

### Stories as AT documentation

A story that demonstrates wrong usage is as harmful as a component bug — stories are what developers copy. Every story involving grouped controls, tables, or form elements should demonstrate the consumer-level markup that the component cannot enforce:

- Radio groups: `<fieldset>`/`<legend>` (not `<div>`/`<p>`)
- Tables: `<caption>`, `<th scope="row">` for key/value rows
- Form fields without an explicit label: `<label for>` / `<input id>` association

---

## Common Pitfalls

### Tokens and visual

1. **Don't hard-code colors**: Always use design tokens
2. **Don't use hex colors in tokens**: Use OKLCH format
3. **Don't skip accessibility validation**: Check contrast before finalizing
3a. **Don't use `--color-status-*` (or any `$extensions.usage: "non-text"` token) as a CSS `color:` value for text**: These tokens — `--color-status-error`, `--color-status-success`, `--color-status-warning`, and the base icon/border variants — are contrast-validated only for non-text use (icons, borders, indicators). Their OKCA against common backgrounds is below every text threshold. Always use the paired `-text` variant: `--color-status-error-text`, `--color-status-success-text`, `--color-status-warning-text`. Check `audit/tokens.dtcg.json` — any token with `"$extensions": { "usage": "non-text" }` must not appear in a `color:` rule.
4. **Don't create components without stories**: Every component needs a story
5. **Don't modify node_modules**: This is obvious but worth stating
6. **Don't use Atkinson bold for urgency**: Bold weight in Atkinson is for hierarchy/labels only. Error messages, status text, and warnings use regular weight — color carries the urgency signal (see "Typography Usage Rules" above)
7. **Don't put `aria-label` on component host elements without forwarding it inward** (Angular **or** WC): It won't reach the inner interactive element, and if you simply mirror it inward without stripping, screen readers hear the name twice. In Angular, use the `ariaLabel` input pattern (see "Host element ARIA trap" above). In WC, use the `observeHostAriaLabel` helper from `src/web-components/utils/host-aria.ts` (see "aria-label host-trap" above).
8. **Don't use `<header>`/`<footer>` inside dialogs or panels**: They inherit landmark roles (`banner`, `contentinfo`) in Chrome. Use `role="none"` or `<div>` (see "Landmark pollution" above)
9. **Don't expose formatter logic for OKLCH axes**: Axes like chroma have dynamic min/max based on hue — auto-computed formatters will be wrong. Expose a `valueTextFn = input<(v: number) => string>()` and let the consumer supply the semantics

### Angular-specific

10. **Never use `::ng-deep`**: It is deprecated. Use `ViewEncapsulation.None` with a host class for scoping when styling projected content (see "View Encapsulation and Projected Content" above)
11. **Don't use `signal()` where a parent template binds**: Bindings will silently break. Use `model()` for two-way or `input()` for one-way (see "Angular Signal Types — Binding Behaviour" above)

### Web-component-specific

12. **Don't inject data via `<script>` tags in story templates**: Storybook's Angular renderer strips them. Pass data via JSON-encoded attributes (`rows='${JSON.stringify(...)}'`) instead — see "Storybook templates: data must flow via attributes, not <script>" above.
13. **Don't rely on Lit's default attribute lowercasing for multi-word props**: `columnHeaders` becomes attribute `columnheaders` by default — unreadable in markup. Always set `attribute: 'column-headers'` explicitly on `@property()`.
14. **Don't omit `composed: true` on dispatched events**: Without it, events stop at the shadow boundary and never reach light-DOM listeners. Always set both `bubbles: true` and `composed: true`.
15. **Don't redeclare tokens inside `static styles`**: Design tokens pierce shadow DOM automatically via CSS custom properties. Hard-coding `oklch(...)` inside a component breaks dark mode and token-driven theming.
16. **Don't use `?checked` / `?open` / `?selected` on native form controls**: After user interaction, the live IDL property (`input.checked`, `details.open`, `option.selected`) diverges from the HTML attribute, and `?attr` binding only writes the attribute. Use `.checked`, `.open`, `.selected` (property binding) so the host's state always wins. Also wire the corresponding change event (`change` / `toggle`) back to the host so user-driven changes don't silently desync — see "Stateful form-element bindings" above.
17. **Don't rely on native browser radio grouping across `<candor-radio>` siblings**: Each radio is in its own shadow root, so the browser can't tie shared-`name` inputs into one mutually-exclusive group OR an arrow-navigable set. candor-radio implements both behaviors itself by querying sibling `<candor-radio name="…">` elements within the nearest `<fieldset>`. If you build another grouped form control (checkbox-group, etc.), expect to write the same shim.

## Test Files

- `tests/visual-regression.spec.ts` — screenshot comparisons
- `tests/accessibility.spec.ts` — keyboard navigation, focus, ARIA
- `tests/storybook-snapshots.spec.ts` — automated story screenshots

## Documentation Reference

Detailed workflow documentation in `docs/`:
- `DESIGN-TOKENS.md`: Token modification guide
- `KLAR-INTEGRATION.md`: klar CLI full command reference
- `A11Y-AUDIT.md`: Per-component accessibility audit (WC primary; NVDA + Chrome baseline)
- `archive/A11Y-ANALYSIS.md`: Cross-cutting trend analysis from the Angular-era audit
- `archive/WORKFLOW.md`: Complete design iteration workflow guide
- `archive/PLAYWRIGHT-WORKFLOW.md`: Playwright MCP usage patterns
- `ACCESSIBILITY-CONFORMANCE.md`: WCAG 2.1 AA conformance statement
- `BREAKING-CHANGES.md`: Breaking change policy and migration note template

## Node Version Requirements

- Node.js 20.16+, 22.19+, or 24+
- Required for Storybook 10 ESM support
- Check with `node --version`

## Publishing

- Package: `@candor-design/tokens`
- npm publish triggered by version tags via GitHub Actions
- Uses OIDC trusted publishing — no token required
- **Before troubleshooting any CI/CD or publish failure, read `STACK.md` in the dev-notes repo first** — it documents the publish mechanism, known runner quirks, and auth approach
