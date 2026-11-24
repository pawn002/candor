# Candor Design Tokens

**This package ships design tokens only: CSS custom properties, a JSON map, and nothing else.**
It does not include component markup, component JavaScript, icon assets, or font files.
See the [Candor Storybook](https://main--69c25e2492ad056c24329876.chromatic.com) for the live token
reference (color ramps, semantic swatches, spacing, type scale) and component examples.

## Quickstart

```bash
npm install @candor-design/tokens
```

Import the fonts, then the tokens, once at your app's entry (a bundler such as Vite or webpack
is assumed, since it resolves the bare specifiers):

```css
@import "@candor-design/tokens/candor-fonts.css";   /* optional but recommended, or fonts fall back silently */
@import "@candor-design/tokens/candor-tokens.css";
```

Every token is now a CSS custom property, in scope everywhere, including inside any shadow root:

```css
.card {
  color: var(--color-text-default);
  background: var(--color-bg-surface);
  font-family: var(--font-family-base);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

Dark mode is built in. It follows the OS preference automatically, or force it with
`data-theme="dark"` / `data-theme="light"` on `<html>`. No extra stylesheet, no JS.

That's the whole setup. The sections below are reference; the **"Using the tokens correctly"**
rules just under here are worth two minutes before you start.

## Using the tokens correctly

If you use the tokens without the components, these five rules keep your output consistent with
Candor. The [Storybook](https://main--69c25e2492ad056c24329876.chromatic.com) shows them in use.

1. **Reach for semantic roles, not primitives.** Use `--color-text-default`, not `--navy-800`;
   `--spacing-md`, not `--space-3`. The semantic layer (`--color-*`, `--spacing-*`, `--font-*`,
   `--radius-*`, `--motion-*`) carries meaning *and* dark-mode behaviour. The primitives (`--navy-*`,
   `--gray-*`, `--space-*`, `--type-*`, `--typeface-*`) are raw values with no mode-awareness, so a
   component built on them breaks in dark mode.
2. **14px is the readable-text floor.** Don't set readable text below `--font-size-sm` (14px).
   `--font-size-xs` / `--type-xs` (12px) is for decorative, non-text chrome only (badge frames,
   icon sizing), never body, labels, or values.
3. **Read the first word of a colour token: it is what the token paints.** `bg-` is a
   background, `text-` is text, and `icon-`, `border-`, `fill-` and `ring-` are non-text: they
   meet the 3:1 non-text floor, not a text floor. For coloured text use the `text-` token of the
   same role (`--color-text-error`, not `--color-icon-error`). In the JSON, non-text tokens carry
   `"$extensions": { "usage": "non-text" }`. Names from before 7.0.0 still resolve as deprecated
   aliases until the next major.
4. **Keep the tuned values.** Text is a deep near-black, dark mode is a deep navy, and the
   primaries sit below maximum chroma. Each colour is measured against a contrast floor, so a
   token that looks soft already passes. Overriding one to `#000` or pure black adds contrast the
   text doesn't need and loses the humanist tuning.
5. **Monospace is for content where character position is load-bearing**: code, IDs, version
   strings, timestamps, coordinates. It is not a flavour to signal "technical". `--font-family-mono`
   with `font-variant-numeric: tabular-nums`.

---

Auto-generated distribution artifacts. Do not edit these files directly. Run `npm run build:tokens` to regenerate from source (`src/design-tokens/`).

## Files

| File | Description |
|---|---|
| `candor-tokens.css` | Full expanded CSS, readable, for dev / CDN use |
| `candor-tokens.min.css` | Minified CSS for production `<link>` |
| `candor-tokens.json` | Structured JSON for Figma plugins / tooling |
| `candor-fonts.css` | Optional font convenience imports. Pulls the five Fontsource faces so text doesn't fall back silently (bundler required) |

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

### Peer dependencies: fonts and icons

`candor-tokens.css` *names* the font families but doesn't load them. Without the font
imports, text falls back to Georgia or system-ui, with no error to tell you.
Candor uses [Fontsource](https://fontsource.org/) self-hosted packages (no Google Fonts CDN
link needed), which ship as runtime dependencies of this package.

**Recommended: the convenience stylesheet.** `candor-fonts.css` does the five Fontsource
`@import`s for you. Import it once, before the tokens, and you're done:

```css
@import "@candor-design/tokens/candor-fonts.css";
@import "@candor-design/tokens/candor-tokens.css";
```

This requires a bundler that resolves bare `node_modules` specifiers in CSS `@import`
(Vite, webpack, etc.). The Fontsource packages are installed automatically as deps of this
package, so there's nothing extra to add. It loads exactly the faces the design system was
validated against.

**Manual alternative.** If you'd rather control the imports yourself (e.g. to subset
weights or add italics), install the packages and import them directly:

```bash
npm install @fontsource-variable/roboto-flex @fontsource-variable/noto-sans \
            @fontsource-variable/noto-serif \
            @fontsource-variable/atkinson-hyperlegible-next \
            @fontsource-variable/atkinson-hyperlegible-mono
```

```css
@import '@fontsource-variable/roboto-flex/opsz.css';  /* not index.css, which has the weight axis only */
@import '@fontsource-variable/noto-sans/index.css';
@import '@fontsource-variable/noto-serif/index.css';
@import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
@import '@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css';
@import '@fontsource-variable/atkinson-hyperlegible-mono/wght.css';
@import '@fontsource-variable/atkinson-hyperlegible-mono/wght-italic.css';
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

> **Shadow-DOM caveat:** the Phosphor font classes are global CSS and do not cross shadow
> boundaries. They work for icons in the main document (including content you slot into a
> Candor component from the document), but **not** for icons you author inside your own web
> component's shadow root, where the `<i>` renders blank. If you build your own components,
> render icons as inline `<svg>` with `fill="currentColor"` instead. See Storybook →
> Design Tokens → Icons ("Using icons inside shadow DOM") for the full pattern.

> **Font name note:** The Fontsource variable packages register each family with a "Variable" suffix
> in its `font-family` name (`'Roboto Flex Variable'`, `'Noto Serif Variable'`, `'Atkinson Hyperlegible
> Next Variable'`). Every Candor typeface lists that name first and the plain name second, so either
> loading route works: the Fontsource imports above, or your own `@font-face` declarations under the
> plain names (`'Noto Serif'`, `'Roboto Flex'`). A name that matches neither produces a silent fallback
> to Georgia or system-ui with no console error. Before 7.0.0 the two Noto stacks listed only the plain
> names, so loading them through `candor-fonts.css` fell back silently.

### Prose, syntax and blog styles

This package contains only the files listed above. The class-based stylesheets that earlier releases
shipped alongside the tokens (`candor-article`, `candor-syntax` and `candor-blog`) were removed in 4.0.0,
because they styled markup rather than defining tokens.

- **Long-form prose:** use `<candor-article>` from `@candor-design/web-components`. It carries the same
  prose styling, works in any framework, and adds the `font` and `justify` attributes.
- **Prism syntax colours and blog post listings:** the source SCSS still lives in the repository
  (`src/design-tokens/syntax.scss` and `src/design-tokens/blog.scss`). Copy it into your own build if you
  need it. It reads the same custom properties this package defines, so dark mode follows automatically.

### Dark mode

Tokens include automatic dark mode support via two mechanisms:

1. **OS preference**: respects `@media (prefers-color-scheme: dark)` automatically
2. **Manual override**: set `data-theme="dark"` or `data-theme="light"` on `<html>` to force a theme

```html
<!-- Force dark mode -->
<html data-theme="dark">

<!-- Force light mode (overrides OS preference) -->
<html data-theme="light">
```

## Token structure

### Primitives (in `:root`)

Raw values: color ramps, type scale, spacing scale. Prefixed by family:

- Colour ramps, each derived from rules: `--navy-*`, `--burgundy-*`, `--azure-*`, `--indigo-*`, `--teal-*`, `--red-*`, `--gold-*`, `--green-*` (`50`–`900`, plus in-between steps such as `--navy-670`), and the grey ramps `--gray-*`, `--gray-cool-*`, `--gray-warm-*`
- `--space-{1–12}`, `--type-{xs–3xl}`
- `--typeface-{sans,accessible,mono,reading,serif}`, `--weight-{light–bold}`, `--leading-{display–relaxed}`, `--tracking-{minus-20,0,5,20,25,30,35,40,50}` (thousandths of an em)
- Primitives are named after their scale, semantic tokens after the CSS property they set; `--text-*` and `--font-{sans,…}` from before 7.0.0 resolve as deprecated aliases

### Semantics (in `:root`, override-friendly)

Role-based aliases that components consume. Always prefer these over primitives:

- **Color**: named property first, `--color-bg-*`, `--color-text-*`, `--color-icon-*`, `--color-border-*`, `--color-fill-*` and `--color-ring-*`, so the first word says what a token paints and whether a text or non-text floor applies
- **Spacing**: `--spacing-{2xs–3xl}`. Component padding is set through each component's `--candor-*` hook; `--spacing-button-*`, `--spacing-input-*` and `--spacing-card-*` are deprecated in 7.0.0
- **Shape**: `--radius-{sm,md,lg,full}`, `--border-width-{thin,medium,thick,indicator}`, `--focus-ring-*`
- **Typography**: `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`
- **Elevation**: `--shadow-{sm,md,lg,modal}`
- **Motion**: `--motion-duration-{instant,fast,base,slow}`, `--motion-ease-{standard,enter,exit}`, `--motion-distance`, `--motion-travel`

### JSON format

```json
{
  "root": { "--color-bg-page": "var(--gray-cool-25)", ... },
  "dark":  { "--color-bg-page": "var(--gray-cool-900)", ... }
}
```

`root` contains all primitives plus every light-mode and mode-invariant semantic token. `dark` contains only the overrides applied in dark mode. Values are the declarations as written (`var()` references), not resolved colours. Before 7.0.0, `root` held the primitives only: the semantic tokens were missing from it.
