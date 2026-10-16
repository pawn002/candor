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

This package is the *only* thing that travels to a tokens-only consumer. The design rationale
in the repo's `docs/` doesn't. These five rules are the ones that keep output on-system; the
[Storybook](https://main--69c25e2492ad056c24329876.chromatic.com) is the visual companion.

1. **Reach for semantic roles, not primitives.** Use `--color-text-default`, not `--navy-800`;
   `--spacing-md`, not `--space-3`. The semantic layer (`--color-*`, `--spacing-*`, `--font-*`,
   `--radius-*`) carries meaning *and* dark-mode behaviour. The primitives (`--navy-*`, `--gray-*`,
   `--space-*`, `--text-*`) are raw values with no mode-awareness, so a component built on them
   breaks in dark mode.
2. **14px is the readable-text floor.** Don't set readable text below `--font-size-sm` (14px).
   `--font-size-xs` / `--text-xs` (12px) is for decorative, non-text chrome only (badge frames,
   icon sizing), never body, labels, or values.
3. **Don't use non-text color tokens as text colour.** `--color-status-error`,
   `--color-status-success` and `--color-status-warning` are
   contrast-validated for icons/borders only; their contrast is below every text threshold. For
   coloured text use the paired `-text` variants: `--color-status-error-text`, etc. (In the JSON,
   these carry `"$extensions": { "usage": "non-text" }`.)
4. **The values are already tuned. Don't drag them back to extremes.** Colours sit deliberately
   off the raw extremes: text is a deep near-black, not `#000`; dark mode is deep navy, not pure
   black; primaries aren't at max chroma. Overriding a token to a raw extreme undoes the contrast
   and humanist tuning baked in. If a value looks "not contrasty enough," it was measured. Trust it.
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

`candor-tokens.css` *names* the font families but does not load them. A consumer who
forgets to import the faces gets a silent fallback to Georgia / system-ui with no error.
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
npm install @fontsource-variable/roboto-flex @fontsource-variable/roboto-mono \
            @fontsource-variable/noto-sans @fontsource-variable/noto-serif \
            @fontsource/atkinson-hyperlegible
```

```css
@import '@fontsource-variable/roboto-flex/index.css';
@import '@fontsource-variable/roboto-mono/index.css';
@import '@fontsource-variable/noto-sans/index.css';
@import '@fontsource-variable/noto-serif/index.css';
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

> **Shadow-DOM caveat:** the Phosphor font classes are global CSS and do not cross shadow
> boundaries. They work for icons in the main document (including content you slot into a
> Candor component from the document), but **not** for icons you author inside your own web
> component's shadow root, where the `<i>` renders blank. If you build your own components,
> render icons as inline `<svg>` with `fill="currentColor"` instead. See Storybook →
> Design Tokens → Icons ("Using icons inside shadow DOM") for the full pattern.

> **Font name note:** The Fontsource variable packages register fonts with a "Variable" suffix in their
> internal `font-family` name (e.g. `'Roboto Flex Variable'`). Candor's tokens handle this for Roboto
> Flex by listing both names in the stack: `'Roboto Flex Variable', 'Roboto Flex'`.
>
> For **Noto Serif and Noto Sans**, the tokens reference `"Noto Serif"` and `"Noto Sans"` (no "Variable"
> suffix). If you are writing your own `@font-face` declarations, you **must** use these exact names,
> not `'Noto Serif Variable'` or `'Noto Sans Variable'`. A mismatch produces a silent fallback to Georgia
> or system-ui with no console error. The Fontsource `@import` path approach above avoids this entirely.

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

- `--navy-{50–900}`, `--burgundy-{50–900}`, `--azure-{50–900}`, `--indigo-{50–900}`, `--gray-{0–900}`
- `--space-{1–12}`, `--text-{xs–3xl}`
- `--font-{sans,accessible,mono,reading,serif}`, `--weight-{light–bold}`, `--leading-{tight–relaxed}`

### Semantics (in `:root`, override-friendly)

Role-based aliases that components consume. Always prefer these over primitives:

- **Color**: `--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-action-*`, `--color-status-*`, `--color-link`, `--color-focus`
- **Spacing**: `--spacing-{xs–3xl}`, `--spacing-button-*`, `--spacing-input-*`, `--spacing-card-*`
- **Shape**: `--radius-{sm,md,lg,full}`, `--border-width-{thin,medium,thick}`, `--focus-ring-*`
- **Typography**: `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`
- **Elevation**: `--shadow-{sm,md,lg,modal}`

### JSON format

```json
{
  "root": { "--color-bg-page": "var(--gray-cool-25)", ... },
  "dark":  { "--color-bg-page": "var(--gray-cool-900)", ... }
}
```

`root` contains all primitives plus light-mode semantic values. `dark` contains only the overrides applied in dark mode.
