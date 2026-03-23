# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular + Storybook design system playground built for AI-assisted design iteration with real-time accessibility validation. The primary workflow involves receiving art direction specs, implementing them in design tokens, and validating accessibility using the CPQI CLI for color contrast and Playwright MCP for visual inspection.

## Design Philosophy

### Candor is a humanist design system

Candor's typefaces — Roboto Flex, Noto Serif, Atkinson Hyperlegible — are all drawn from the humanist tradition: letterforms shaped by the hand, designed for reading by people. The color system uses perceptual uniformity (OKLCH) precisely because it models human vision, not machine arithmetic. These are not incidental choices.

**The principle:** Every element in Candor — including technical, data-heavy, or machine-generated content — should feel like it belongs to a considered, human-authored artifact. No component escapes this. Code blocks, data tables, monospace text, status indicators, and form chrome all exist within the humanist frame.

**What this means in practice:**
- Clinical harshness is not "appropriate for technical content" — it is a failure of the system's character. A code block in dark mode should not be a stark white rectangle interrupting a warm layout.
- Maximum contrast is not automatically correct. 19.4:1 white-on-dark is a machine default, not a design decision.
- When a component feels cold, flat, or mechanical, the question is not "is this the right aesthetic for this content type?" — it is "how do we bring this inside the system's character without losing its function?"

**The tension to navigate:** Technical content has real legibility requirements — monospace, high contrast, clear delineation. The humanist position is not to ignore these. It is to meet them while preserving warmth, coherence, and the sense that a human made considered choices about every surface.

**Flag this tension proactively.** When implementing any component where clinical defaults would be the easy choice — code blocks, tables, form inputs, data displays — name the humanist/legibility tension explicitly rather than silently resolving it one way or the other.

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

**Why OKLCH**:
- Perceptually uniform (unlike hex/RGB)
- Predictable lightness manipulation
- CPQI CLI works natively with OKLCH
- Easier for AI to generate/manipulate programmatically

### Component Structure

Angular standalone components in `src/app/components/`:
- Each component has: `.ts`, `.scss`, `.stories.ts` files
- Stories demonstrate all variants and states
- Components use `:host` selector for scoping
- All components are standalone (no NgModule)

**Component categories**:
- `typography/`: heading, text
- `button/`: button with variants (primary, secondary, tertiary, ghost)
- `form/`: input, checkbox, radio
- `spacing/`: spacing-showcase
- `examples/`: composed component examples (card-example, form-example)

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
2. **Convert to OKLCH**: Run `cpqi meta <hex>` on each color to get exact OKLCH values
3. **Update tokens**: Modify `src/design-tokens/colors.scss` and other token files
4. **Visual check**: Use Playwright MCP to screenshot Storybook stories
5. **Accessibility validation**: Run `cpqi contrast <fg> <bg> -q` to check contrast ratios
6. **Iterate**: If violations found, run `cpqi find <bg> <color> --target 4.5 -q` for compliant alternatives
7. **Report**: Document original specs vs. final implementation, constraints identified

### Integration Points

**CPQI CLI** (`cpqi --version` to confirm availability):
```bash
cpqi meta <hex>                        # Convert hex → OKLCH + color metadata
cpqi contrast <fg> <bg> -q             # Check contrast ratio (WCAG/APCA)
cpqi find <bg> <color> --target 4.5 -q # Find lightness-adjusted compliant color
cpqi variants <hex>                    # Generate a tonal palette
cpqi match <hex>                       # Find nearest named/brand color
```

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

Atkinson is the designated typeface for **critical UI text** — form labels, error messages, status indicators, annotations, and badges. Its wider letterforms, open counters, and distinctive glyphs provide strong legibility at small sizes without needing weight support.

**Bold weight rules for Atkinson:**
- **Use bold only for hierarchy/labeling** — form field labels, section headings, structural anchors where a clear visual break is needed
- **Do NOT use bold for urgency or emphasis** — error messages, warnings, status text, and annotations should use regular weight (400). The typeface's inherent legibility and the semantic color (red for error, etc.) carry the urgency signal. Bold on top of Atkinson reads as double-emphasis and disrupts hierarchy
- The `--bold` modifier on `AccessibleTextComponent` exists for intentional overrides but should rarely be needed outside of `role="label"` contexts

**Why this matters:** Atkinson performs so well at regular weight that bold becomes a hierarchy signal, not a legibility aid. Overusing bold flattens the hierarchy and makes everything feel heavy.

**Correct usage:**
```html
<!-- ✓ Bold for label — structural anchor -->
<app-accessible-text role="label" [bold]="true">National Insurance number</app-accessible-text>

<!-- ✓ Regular for status — color carries urgency -->
<app-accessible-text role="status" color="error">Enter a valid number.</app-accessible-text>

<!-- ✗ Wrong — bold + error color is double-emphasis -->
<app-accessible-text role="status" color="error" [bold]="true">Enter a valid number.</app-accessible-text>
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

**Why this matters**: Old directive-based syntax (`*ngIf`, `*ngFor`, `NgSwitch`) requires Zone.js for change detection. Built-in control flow (`@if`, `@for`, `@switch`) works perfectly in zoneless mode and is the future of Angular.

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

**Incorrect examples**:
```typescript
// ✗ WRONG - Don't use *ngIf
<div *ngIf="condition">Content</div>

// ✗ WRONG - Don't use *ngFor
<div *ngFor="let item of items">{{ item.name }}</div>

// ✗ WRONG - Don't use ngSwitch
<div [ngSwitch]="value">
  <div *ngSwitchCase="'option1'">Option 1</div>
</div>
```

**Important notes**:
- Built-in control flow does NOT require imports (no `NgIf`, `NgFor`, `NgSwitch` in component imports)
- Built-in control flow works correctly with Zone.js enabled
- When refactoring existing code, always convert old directives to built-in syntax

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

## Accessibility Authoring Conventions

These patterns emerged from the 26-component A11Y audit. See `docs/A11Y-AUDIT.md` for per-component findings and `docs/A11Y-ANALYSIS.md` for cross-cutting trend analysis.

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

1. **Don't hard-code colors**: Always use design tokens
2. **Don't use hex colors in tokens**: Use OKLCH format
3. **Don't skip accessibility validation**: Check contrast before finalizing
4. **Don't create components without stories**: Every component needs a story
5. **Don't modify node_modules**: This is obvious but worth stating
6. **Never use `::ng-deep`**: It is deprecated. Use `ViewEncapsulation.None` with a host class for scoping when styling projected content (see "View Encapsulation and Projected Content" above)
7. **Don't use Atkinson bold for urgency**: Bold weight in Atkinson is for hierarchy/labels only. Error messages, status text, and warnings use regular weight — color carries the urgency signal (see "Typography Usage Rules" above)
8. **Don't put `aria-label` on component host elements**: It won't reach the inner interactive element — use the `ariaLabel` input pattern instead (see "Host element ARIA trap" above)
9. **Don't use `<header>`/`<footer>` inside dialogs or panels**: They inherit landmark roles (`banner`, `contentinfo`) in Chrome. Use `role="none"` or `<div>` (see "Landmark pollution" above)
10. **Don't expose formatter logic for OKLCH axes**: Axes like chroma have dynamic min/max based on hue — auto-computed formatters will be wrong. Expose a `valueTextFn = input<(v: number) => string>()` and let the consumer supply the semantics

## Testing Strategy

### Visual Regression
Tests capture screenshots of component states for comparison across changes.

### Accessibility Testing
Tests verify:
- Keyboard navigation works
- Focus indicators are visible
- ARIA attributes are correct
- Color contrast meets standards

### Test Structure
- `tests/visual-regression.spec.ts`: Screenshot-based tests
- `tests/accessibility.spec.ts`: A11y interaction tests
- `tests/storybook-snapshots.spec.ts`: Automated story screenshots

## Documentation Reference

Detailed workflow documentation in `docs/`:
- `WORKFLOW.md`: Complete workflow guide
- `DESIGN-TOKENS.md`: Token modification guide
- `CPQI-INTEGRATION.md`: CPQI CLI usage patterns and commands
- `PLAYWRIGHT-WORKFLOW.md`: Playwright MCP usage patterns
- `A11Y-AUDIT.md`: Per-component accessibility audit findings (all 26 components)
- `A11Y-ANALYSIS.md`: Cross-cutting trend analysis from the audit — authoring conventions, gotchas, and review priorities
- `ACCESSIBILITY-CONFORMANCE.md`: WCAG 2.1 AA conformance statement — what the library guarantees, consumer responsibilities, known limitations
- `BREAKING-CHANGES.md`: Breaking change policy — version classification taxonomy and migration note template

## Git Information

- Main branch: `main`
- Recent focus: Angular v21 upgrade, Storybook v10 upgrade
- Component prefix: `app`

## Node Version Requirements

- Node.js 20.16+, 22.19+, or 24+
- Required for Storybook 10 ESM support
- Check with `node --version`
