# Candor Design Tokens

**This package ships design tokens only — CSS custom properties, a JSON map, and nothing else.**
It does not include component markup, component JavaScript, icon assets, or font files.
See the [Candor Storybook](https://main--69c25e2492ad056c24329876.chromatic.com) for component documentation and usage examples.

---

Auto-generated distribution artifacts. Do not edit these files directly — run `npm run build:tokens` to regenerate from source (`src/design-tokens/`, `src/app/components/typography/article/`).

## Files

| File | Description |
|---|---|
| `candor-tokens.css` | Full expanded CSS — readable, for dev / CDN use |
| `candor-tokens.min.css` | Minified CSS — for production `<link>` |
| `candor-tokens.json` | Structured JSON — for Figma plugins / tooling |
| `candor-article.css` | Article prose styles — framework-agnostic, readable |
| `candor-article.min.css` | Minified article prose styles — for production `<link>` |

## Usage

### Any HTML page (no framework required)

```html
<link rel="stylesheet" href="path/to/candor-tokens.css">
```

All tokens are then available as CSS custom properties:

```css
.my-component {
  color: var(--color-text-default);
  background: var(--color-bg-surface);
  font-family: var(--font-family-base);
  padding: var(--spacing-md);
}
```

### CSS / SCSS import

```css
@import url("candor-tokens.css");
```

### Peer dependencies — fonts and icons

The tokens reference several font families that must be installed separately. Candor uses
[Fontsource](https://fontsource.org/) self-hosted packages — no Google Fonts CDN link needed:

```bash
npm install @fontsource-variable/roboto-flex @fontsource-variable/roboto-mono \
            @fontsource-variable/noto-sans @fontsource-variable/noto-serif \
            @fontsource/atkinson-hyperlegible
```

Then import the font CSS in your global stylesheet (once, at the root level):

```css
@import '@fontsource-variable/roboto-flex';
@import '@fontsource-variable/roboto-mono';
@import '@fontsource-variable/noto-sans';
@import '@fontsource-variable/noto-serif';
@import '@fontsource/atkinson-hyperlegible/400.css';
@import '@fontsource/atkinson-hyperlegible/700.css';
```

For icon support (used by Candor components), install Phosphor Icons:

```bash
npm install @phosphor-icons/web
```

```css
@import '@phosphor-icons/web/bold/style.css';
@import '@phosphor-icons/web/fill/style.css';
@import '@phosphor-icons/web/regular/style.css';
```

> **Font name note:** The Fontsource variable packages register the font as `'Roboto Flex Variable'`
> (with the word "Variable" appended). The `--font-family-base` token lists both names —
> `'Roboto Flex Variable', 'Roboto Flex'` — so the stack resolves correctly in all environments.

### Article prose styles (framework-agnostic)

`candor-article.css` is a standalone prose stylesheet compiled from the same source as the Angular `<app-article>` component. It works in any framework — 11ty, Astro, Next.js, or plain HTML.

```html
<link rel="stylesheet" href="path/to/candor-tokens.min.css">
<link rel="stylesheet" href="path/to/candor-article.min.css">
```

Wrap post content in a `div` with the `.article` class:

```html
<div class="article article--font-reading">
  <h1>Post title</h1>
  <p>Body copy...</p>
</div>
```

**Font variants:**
- `article--font-reading` — Noto Serif; human or AI-authored prose (default)
- `article--font-sans` — Noto Sans; utility or syndication contexts

The stylesheet covers headings (h1–h6), paragraphs, lists, blockquotes, inline code, fenced code blocks (`<pre><code>`), figures with captions, tables, links with `:visited` double-underline indicator, and horizontal rules. All values resolve from `candor-tokens.css` — dark mode is inherited automatically.

> **Syntax highlighting:** `candor-article.css` styles the code block *container* (background, border, font) but does not include language-aware token colors. For syntax highlighting, add a compatible theme stylesheet after `candor-article.css`. A Candor-themed syntax highlight stylesheet (`candor-syntax.css`) is planned for a future release.

---

### Dark mode

Tokens include automatic dark mode support via two mechanisms:

1. **OS preference** — respects `@media (prefers-color-scheme: dark)` automatically
2. **Manual override** — set `data-theme="dark"` or `data-theme="light"` on `<html>` to force a theme

```html
<!-- Force dark mode -->
<html data-theme="dark">

<!-- Force light mode (overrides OS preference) -->
<html data-theme="light">
```

## Token structure

### Primitives (in `:root`)

Raw values — color ramps, type scale, spacing scale. Prefixed by family:

- `--navy-{50–900}`, `--burgundy-{50–900}`, `--azure-{50–900}`, `--purple-{50–900}`, `--gray-{0–900}`
- `--space-{1–12}`, `--text-{xs–3xl}`
- `--font-{sans,accessible,mono,reading,serif}`, `--weight-{light–bold}`, `--leading-{tight–relaxed}`

### Semantics (in `:root`, override-friendly)

Role-based aliases that components consume. Always prefer these over primitives:

- **Color** — `--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-action-*`, `--color-status-*`, `--color-link`, `--color-focus`
- **Spacing** — `--spacing-{xs–3xl}`, `--spacing-button-*`, `--spacing-input-*`, `--spacing-card-*`
- **Shape** — `--radius-{sm,md,lg,full}`, `--border-width-{thin,medium,thick}`, `--focus-ring-*`
- **Typography** — `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`
- **Elevation** — `--shadow-{sm,md,lg,modal}`

### JSON format

```json
{
  "root": { "--color-bg-page": "var(--gray-0)", ... },
  "dark":  { "--color-bg-page": "var(--gray-900)", ... }
}
```

`root` contains all primitives plus light-mode semantic values. `dark` contains only the overrides applied in dark mode.
