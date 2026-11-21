# Candor

A humanist design system built with OKLCH colors, variable-font typography, and WCAG 2.2 AA accessibility baked in.

**[Component catalog and usage rules →](https://main--69c25e2492ad056c24329876.chromatic.com)**

## Documentation

**The published packages ship API surface only**: CSS custom properties here, type declarations in `@candor-design/web-components`. Neither carries Candor's usage rules, and several of those rules are not expressible in a stylesheet or a `.d.ts` at all. Finding nothing in `node_modules` does not establish that Candor is silent on a question; it establishes that you have not looked yet.

The rules live in the **[component catalog](https://main--69c25e2492ad056c24329876.chromatic.com)**, which is canonical. For tokens specifically, it is where to find which contrast floor applies to a given piece of text (the floor depends on font size *and* use-case tier), which tokens are validated for non-text use only, and why colours are authored in OKLCH and held inside the sRGB gamut.

## Install

### Tokens (CSS custom properties)

```bash
npm install @candor-design/tokens
```

### Web components (framework-agnostic)

```bash
npm install @candor-design/web-components @candor-design/tokens lit
```

Includes all 37 Candor components as Lit 3 custom elements, each with its own entry point (`import '@candor-design/web-components/button'`) so you ship only what you render. Lit is a peer dependency. No framework is required. It works in plain HTML, React, Vue, Svelte, or any other environment that supports web standards, and a single-file `standalone` build covers `<script>`-tag use. Version is kept in sync with `@candor-design/tokens`. See the [package README](web-components/README.md) for the import forms.

### Fonts

Candor uses five typefaces: [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex) for UI and headings, Atkinson Hyperlegible Next for instructional text, Atkinson Hyperlegible Mono for code and data, and Noto Sans and Noto Serif for reading. The tokens package ships a stylesheet that loads them all from Fontsource, which it depends on:

```css
@import '@candor-design/tokens/candor-fonts.css';  /* before candor-tokens.css */
```

> **Note:** Fontsource's variable packages register each family with a `Variable` suffix (`'Roboto Flex Variable'`), and Candor's `--typeface-*` primitives list that name first. If you load the fonts another way (Google Fonts, self-hosted), match the family names or override the `--typeface-*` primitives. The tokens README lists the individual imports.

## Usage

### CSS (recommended)

Link the stylesheet and use the custom properties directly:

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.css">
```

```css
.button {
  background: var(--color-bg-action-primary);
  color: var(--color-text-on-action);
  font-family: var(--font-family-base);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### CSS import

```css
@import url('@candor-design/tokens/candor-tokens.css');
```

### Web components

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.css">
<script type="module" src="node_modules/@candor-design/web-components/dist/candor-web-components.standalone.js"></script>

<candor-button variant="primary">Save changes</candor-button>
<candor-input label="Email" type="email" required></candor-input>
<candor-badge variant="success">Active</candor-badge>
```

CSS custom properties pierce Shadow DOM boundaries automatically, so loading `candor-tokens.css` once is all that's required. No per-component token injection needed.

#### Bundler import

```js
import '@candor-design/web-components';
// All 40 custom elements are now registered
```

Named exports are also available for direct class access (e.g. typed references, programmatic instantiation). Importing any class still triggers the package's side-effectful `customElements.define()` calls, so the corresponding tag is also registered:

```js
import { CandorButton, CandorBadge } from '@candor-design/web-components';
```

---

### Bundler (Vite / webpack / PostCSS)

```css
@import '@candor-design/tokens/candor-tokens.css';
```

The bundler resolves the bare specifier and inlines the file at build time. This is not Sass `@use`, which is for importing Sass modules (`.scss` source files with variables and mixins). `candor-tokens.css` is pre-compiled CSS with no Sass members to import.

### Minified (production)

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.min.css">
```

### JSON (Figma / tooling)

```js
import tokens from '@candor-design/tokens/candor-tokens.json';

tokens.root['--navy-800'];        // 'oklch(0.27 0.06 245.34)'
tokens.root['--color-text-link']; // 'var(--azure-600)'
tokens.dark['--color-text-link']; // 'var(--azure-250)'
```

`root` holds the primitives and every light-mode and mode-invariant semantic token; `dark` holds the dark-mode overrides. Values are the declarations as written, so a semantic token is a `var()` reference to the primitive it uses; resolve them against `root` (and `dark` over it) in your tooling.

---

## What's included

### Colors

Eight OKLCH colour ramps and three grey ramps, each derived from stated rules: one lightness ladder per kind, and a chroma curve per ramp, capped by what sRGB renders. Steps run 50–900, with in-between steps such as `--navy-670` where a token needs one. The Ramps page in the catalog draws the curves.

| Ramp | Role |
|---|---|
| `--navy-*` | Primary action, accents, the inverse surface |
| `--burgundy-*` | The second brand hue: secondary badges and chips |
| `--azure-*` | Links and focus rings |
| `--indigo-*` | Visited links |
| `--teal-*` | Code-block backgrounds |
| `--red-*`, `--gold-*`, `--green-*` | Error, warning and success |
| `--gray-*`, `--gray-cool-*`, `--gray-warm-*` | Text, borders and backgrounds, neutral, cool and warm |

Semantic tokens map ramp steps to roles. Every colour token is named after what it paints, `--color-{bg|text|icon|border|fill|ring}-…`, so its first word also says whether a text or a non-text contrast floor applies:

```css
/* Backgrounds */
--color-bg-page
--color-bg-surface
--color-bg-elevated
--color-bg-inverse

/* Text */
--color-text-default      /* OKCA 12.4 on page: primary body text */
--color-text-subtle       /* OKCA 5.0 on page: secondary text */
--color-text-on-action    /* the label on a filled action: primary button, badge */

/* Accent: the brand navy as a mark */
--color-text-accent
--color-border-accent
--color-fill-indicator

/* Buttons, named after the variant that uses them */
--color-bg-action-primary
--color-bg-action-primary-hover
--color-text-action-secondary
--color-border-action-secondary
--color-bg-action-destructive
--color-text-action-destructive

/* Status: an icon, a fill, text on the fill, a chip outline */
--color-icon-error
--color-bg-error
--color-text-error
--color-border-error
--color-icon-success
--color-bg-success
--color-text-success
--color-icon-warning
--color-bg-warning
--color-text-warning

/* Other */
--color-text-link
--color-text-link-visited
--color-ring-focus
--color-border-default
--color-border-control
```

Every colour pairing the components use is measured in both modes against a floor, in OKCA (klar), that depends on text size and on what the text is for: 4.5 for body text, 3 for icons, borders and indicators (WCAG 1.4.11), and stricter at 14px. `npm run audit:contrast` enforces it.

### Dark mode

Dark mode activates automatically via `prefers-color-scheme: dark`, or can be forced with a `data-theme` attribute:

```html
<!-- Force dark -->
<html data-theme="dark">

<!-- Force light (overrides OS preference) -->
<html data-theme="light">
```

Only color tokens change between modes. Spacing, typography, and shape tokens are invariant.

### Typography

```css
--font-family-base        /* Roboto Flex: variable font, UI workhorse */
--font-family-display     /* Roboto Flex: headings */
--font-family-accessible  /* Atkinson Hyperlegible Next: form labels, error messages, critical UI */
--font-family-mono        /* Atkinson Hyperlegible Mono */
--font-family-serif       /* Noto Serif */
--font-family-reading     /* Noto Sans: long-form content */
```

Type scale (Major Third, 1.25 ratio):

```css
--font-size-sm    /* 14px: system floor for readable text */
--font-size-md    /* 16px */
--font-size-lg    /* 20px */
--font-size-xl    /* 25px */
--font-size-2xl   /* 31px */
--font-size-3xl   /* 39px */

--font-size-h1    /* 39px */
--font-size-h2    /* 31px */
--font-size-h3    /* 25px */
--font-size-h4    /* 20px */
--font-size-h5    /* 16px */
--font-size-h6    /* 14px */
```

### Spacing

8px grid:

```css
--spacing-2xs  /*  4px */
--spacing-xs   /*  8px */
--spacing-sm   /* 16px */
--spacing-md   /* 24px */
--spacing-lg   /* 32px */
--spacing-xl   /* 48px */
--spacing-2xl  /* 64px */
--spacing-3xl  /* 96px */
```

### Shape

```css
--radius-sm    /*  4px */
--radius-md    /*  8px */
--radius-lg    /* 16px */
--radius-full  /* 9999px */

--border-width-thin    /* 1px */
--border-width-medium  /* 2px */
--border-width-thick   /* 4px */
--border-width-indicator /* 3px: the active tab's underline */

--focus-ring-width   /* 2px */
--focus-ring-offset  /* 2px */
```

### Motion

```css
--motion-duration-instant  /* 100ms: a control's own press feedback */
--motion-duration-fast     /* 150ms: hover and focus, a popup appearing, a dialog leaving */
--motion-duration-base     /* 200ms: a state changing */
--motion-duration-slow     /* 250ms: a dialog or drawer arriving */

--motion-ease-standard     /* colour and state changes */
--motion-ease-enter        /* decelerates into place */
--motion-ease-exit         /* accelerates away */
```

Under `prefers-reduced-motion: reduce`, nothing travels and fades remain; that is decided in the tokens, so components need no rule of their own.

---

## Design philosophy

Candor is a **humanist** design system. Every decision (OKLCH colors, variable-font typography, perceptual spacing) is oriented toward human vision and reading experience, not machine defaults.

**OKLCH colors** use a perceptually uniform color space, so lightness values reliably map to visual weight across hues. This makes it practical to derive accessible color pairs programmatically and to build predictable tonal scales.

**Roboto Flex** is a variable font with an optical size axis (`opsz`) that automatically adjusts stroke contrast at different sizes, creating natural typographic hierarchy without artificial weight jumps.

**Atkinson Hyperlegible Next** is reserved for critical UI text (form labels, error messages, status indicators) where legibility under stress matters most.

---

## Development

This repository contains the full design system in two distributed layers: the **`@candor-design/tokens`** CSS layer and the **`@candor-design/web-components`** Lit 3 custom-element library (the primary consumer-facing distribution) built on top of it. Both live in a single Storybook so the same stories validate every layer.

### Prerequisites

- Node.js 20.16+, 22.19+, or 24+
- npm

### Setup

```bash
git clone https://github.com/pawn002/candor.git
cd candor
npm install
```

### Build tokens

```bash
npm run build:tokens
```

Outputs to `tokens/`:
- `candor-tokens.css`: expanded CSS with comments
- `candor-tokens.min.css`: minified for production
- `candor-tokens.json`: structured JSON (`root` + `dark` keys)

### Build web components

```bash
npm run build:wc
```

Outputs to `web-components/dist/`:
- `index.js` + `components/**`: ESM, one module per source file. The per-component entry points in `web-components/package.json` point here. `lit` and `culori` stay external
- `candor-web-components.standalone.js`: every element in one ESM file, Lit and culori bundled, for `<script type="module">`
- `**/*.d.ts`: TypeScript declarations

The `exports` map is generated from `src/web-components/index.ts` by `npm run sync:wc-exports`; `npm run audit:packaging` fails if it is stale.

### Storybook

The published catalog is at **https://main--69c25e2492ad056c24329876.chromatic.com** and tracks `main`. As a consumer, that is the one to read. Nothing below is needed to browse the components or their usage rules.

To run it against local changes:

```bash
npm run storybook
```

Opens at http://localhost:6006

### Tests

```bash
npm run test:playwright   # keyboard, ARIA, axe and WCAG runtime checks (visual regression runs on Chromatic)
```

---

## License

ISC
