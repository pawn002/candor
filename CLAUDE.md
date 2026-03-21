# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular + Storybook design system playground built for AI-assisted design iteration with real-time accessibility validation. The primary workflow involves receiving art direction specs, implementing them in design tokens, and validating accessibility using the CPQI CLI for color contrast and Playwright MCP for visual inspection.

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

## Common Pitfalls

1. **Don't hard-code colors**: Always use design tokens
2. **Don't use hex colors in tokens**: Use OKLCH format
3. **Don't skip accessibility validation**: Check contrast before finalizing
4. **Don't create components without stories**: Every component needs a story
5. **Don't modify node_modules**: This is obvious but worth stating
6. **Never use `::ng-deep`**: It is deprecated. Use `ViewEncapsulation.None` with a host class for scoping when styling projected content (see "View Encapsulation and Projected Content" above)

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

## Git Information

- Main branch: `main`
- Recent focus: Angular v21 upgrade, Storybook v10 upgrade
- Component prefix: `app`

## Node Version Requirements

- Node.js 20.16+, 22.19+, or 24+
- Required for Storybook 10 ESM support
- Check with `node --version`
