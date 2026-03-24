# Candor

A humanist design system built with OKLCH colors, variable-font typography, and WCAG 2.1 AA accessibility baked in.

## Install

```bash
npm install @candor-design/tokens
```

## Usage

### CSS (recommended)

Link the stylesheet and use the custom properties directly:

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.css">
```

```css
.button {
  background: var(--color-action-primary);
  color: var(--color-text-on-action);
  font-family: var(--font-family-base);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### CSS import

```css
@import url('@candor-design/tokens/tokens/candor-tokens.css');
```

### Bundler (Vite / webpack / PostCSS)

```css
@import '@candor-design/tokens/tokens/candor-tokens.css';
```

The bundler resolves the bare specifier and inlines the file at build time. This is not Sass `@use` — `@use` is for importing Sass modules (`.scss` source files with variables and mixins). `candor-tokens.css` is pre-compiled CSS with no Sass members to import.

### Minified (production)

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.min.css">
```

### JSON (Figma / tooling)

```js
import tokens from '@candor-design/tokens/tokens/candor-tokens.json';

tokens.root['--color-action-primary']; // oklch(0.27 0.06 245.34)
tokens.dark['--color-action-primary']; // oklch(0.76 0.05 245.34)
```

---

## What's included

### Colors

Five OKLCH color families, each with 10 tonal steps (50–900):

| Family | Role |
|---|---|
| `--navy-*` | Primary action, headings, inverse surfaces |
| `--burgundy-*` | Secondary action, accents |
| `--azure-*` | Links, focus rings, interactive highlights |
| `--purple-*` | Code highlights, visited links, decorative |
| `--gray-*` | Text, borders, backgrounds |

Semantic aliases map primitive ramps to roles:

```css
/* Backgrounds */
--color-bg-page
--color-bg-surface
--color-bg-elevated
--color-bg-inverse

/* Text */
--color-text-default      /* 12.6:1 on page — primary body text */
--color-text-subtle       /*  4.6:1 on page — secondary text */
--color-text-on-action    /* white on primary/secondary buttons */

/* Action */
--color-action-primary
--color-action-primary-hover
--color-action-secondary
--color-action-secondary-hover
--color-action-destructive
--color-action-destructive-text

/* Status */
--color-status-error
--color-status-error-bg
--color-status-error-text
--color-status-success
--color-status-success-bg
--color-status-success-text
--color-status-warning
--color-status-warning-bg
--color-status-warning-text

/* Other */
--color-link
--color-link-visited
--color-focus
--color-border-default
--color-border-control
```

All semantic color pairs are contrast-validated to WCAG 2.1 AA (4.5:1 text, 3:1 UI components).

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
--font-family-base        /* Roboto Flex — variable font, UI workhorse */
--font-family-display     /* Roboto Flex — headings */
--font-family-accessible  /* Atkinson Hyperlegible — form labels, error messages, critical UI */
--font-family-mono        /* Roboto Mono */
--font-family-serif       /* Noto Serif */
--font-family-reading     /* Noto Sans — long-form content */
```

Type scale (Major Third, 1.25 ratio):

```css
--font-size-sm    /* 14px — system floor for readable text */
--font-size-base  /* 16px */
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

--focus-ring-width   /* 2px */
--focus-ring-offset  /* 2px */
```

---

## Design philosophy

Candor is a **humanist** design system. Every decision — OKLCH colors, variable-font typography, perceptual spacing — is oriented toward human vision and reading experience, not machine defaults.

**OKLCH colors** use a perceptually uniform color space, so lightness values reliably map to visual weight across hues. This makes it practical to derive accessible color pairs programmatically and to build predictable tonal scales.

**Roboto Flex** is a variable font with an optical size axis (`opsz`) that automatically adjusts stroke contrast at different sizes — creating natural typographic hierarchy without artificial weight jumps.

**Atkinson Hyperlegible** is reserved for critical UI text (form labels, error messages, status indicators) where legibility under stress matters most.

---

## Development

This repository contains the full design system, including the Angular + Storybook component library that the tokens power.

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
- `candor-tokens.css` — expanded CSS with comments
- `candor-tokens.min.css` — minified for production
- `candor-tokens.json` — structured JSON (`root` + `dark` keys)

### Storybook

```bash
npm run storybook
```

Opens at http://localhost:6006

### Tests

```bash
npm run test:playwright   # Visual regression + a11y tests
npm test                  # Angular unit tests
```

---

## License

ISC
