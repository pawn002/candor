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
| `candor-syntax.css` | Prism.js syntax highlighting theme — readable |
| `candor-syntax.min.css` | Minified syntax highlighting theme — for production `<link>` |
| `candor-blog.css` | Post card and post listing styles — for blog index pages |
| `candor-blog.min.css` | Minified post listing styles — for production `<link>` |

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

> **Syntax highlighting:** `candor-article.css` styles the code block *container* (background, border, font) but does not include language-aware token colors. Add `candor-syntax.css` after `candor-article.css` for Prism.js-based highlighting (see below).

### Syntax highlighting — Prism.js (framework-agnostic)

`candor-syntax.css` is a Prism.js token color theme built from Candor's palette. It targets the dark code-block background that `candor-article.css` sets, with all token colors meeting OKCA ≥ 4.5.

```html
<link rel="stylesheet" href="path/to/candor-tokens.min.css">
<link rel="stylesheet" href="path/to/candor-article.min.css">
<link rel="stylesheet" href="path/to/candor-syntax.min.css">
```

For 11ty, install and register the syntax highlight plugin:

```bash
npm install @11ty/eleventy-plugin-syntaxhighlight
```

```js
// .eleventy.js
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
};
```

Fenced code blocks in Markdown then output Prism-annotated HTML automatically:

````md
```js
const color = "oklch(0.49 0.18 250.80)";
```
````

**Token color palette** (all validated OKCA ≥ 4.5 on the navy-800 code block background):

| CSS variable | Color | Assigned to |
|---|---|---|
| `--syntax-comment` | Muted cool gray-blue | Comments, doctype, CDATA |
| `--syntax-keyword` | Azure | Keywords, @-rules, HTML tags |
| `--syntax-string` | Warm amber | Strings, attribute values, URLs |
| `--syntax-number` | Purple | Numbers, booleans, constants |
| `--syntax-function` | Near-white azure | Functions, class names, builtins |
| `--syntax-property` | Rose | CSS properties, selectors, attribute names |
| `--syntax-operator` | Muted cool | Operators, punctuation |
| `--syntax-deleted` | Error red | Diff removed lines |
| `--syntax-inserted` | Success green | Diff added lines |
| `--syntax-regex` | Amber | Regex literals, template expressions |

Override any role without forking the file:

```css
:root {
  --syntax-keyword: oklch(0.82 0.12 160); /* swap azure keywords to teal */
}
```

> **Shiki users:** Shiki uses inline styles or its own class system — `candor-syntax.css` does not apply. Use Shiki's theme API with the token color values above.

---

### Blog post listing (framework-agnostic)

`candor-blog.css` provides `.post-card` and `.post-list` patterns for blog index pages, tag archives, and "more posts" sections.

```html
<link rel="stylesheet" href="path/to/candor-tokens.min.css">
<link rel="stylesheet" href="path/to/candor-blog.min.css">
```

```html
<ul class="post-list" role="list">
  <li>
    <article class="post-card">
      <!-- optional cover image (tabindex="-1" aria-hidden="true" on the link) -->
      <a class="post-card__image-link" href="/slug/" tabindex="-1" aria-hidden="true">
        <img class="post-card__image" src="cover.jpg" alt="">
      </a>
      <div class="post-card__body">
        <div class="post-card__tags">
          <span class="post-card__tag">Design Systems</span>
        </div>
        <h2 class="post-card__title">
          <a href="/slug/">Post title</a>  <!-- primary keyboard focus target -->
        </h2>
        <p class="post-card__excerpt">One or two sentences...</p>
        <div class="post-card__meta">
          <time>March 2026</time>
          <span aria-hidden="true">·</span>
          <span>6 min read</span>
        </div>
      </div>
    </article>
  </li>
</ul>
```

**Modifiers:**
- `.post-list--grid` — two-column responsive grid (collapses to one column below ~28rem per column)
- `.post-card--featured` — larger title (`h2` scale) and taller image (`16/7` ratio); for the lead post
- `.post-card--compact` — no image, tighter padding, 2-line excerpt; for sidebars and dense archives

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
