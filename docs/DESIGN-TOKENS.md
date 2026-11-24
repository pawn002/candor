# Design Tokens Guide

Candor's design tokens are the single source of truth for color, typography, spacing, and shape. This guide explains **how the token system is structured** and **how to work with it**. It deliberately does not re-list every token value. Those live in the source files and the Storybook "Design Tokens" stories, which are the authoritative reference. A prose doc that duplicates values drifts out of date; this one points at the files instead.

> **Source of truth:** `src/design-tokens/primitives.scss` and `src/design-tokens/semantics.scss`. Both are heavily commented with the contrast rationale behind each value. When this guide and the SCSS disagree, the SCSS is correct. Open an issue.

---

## Format: CSS custom properties, not SCSS variables

Tokens are **CSS custom properties** (`--color-bg-action-primary`), not SCSS variables (`$color-primary`). SCSS is used only as a light authoring convenience: to wrap the light/dark token sets in mixins (`light-color-tokens` / `dark-color-tokens`) and emit them under the right selectors. Every token is a runtime `var(--…)` reference.

Custom properties:

- **Pierce the Shadow DOM.** Candor ships as Lit web components with shadow roots. Custom properties inherit through shadow boundaries; SCSS variables (resolved at build time) cannot. Loading the token stylesheet once on the page reaches every component's internals.
- **Switch themes at runtime.** Light/dark is a matter of which `--color-*` values are in scope, toggled by `[data-theme]` or `prefers-color-scheme`, with no rebuild.

```css
/* ✅ How components and consumers reference tokens */
.button {
  background: var(--color-bg-action-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
```

Never hard-code an `oklch(…)` value or a raw px inside a component. Reference the token.

---

## Two layers: primitives → semantics

Tokens are split into two files with a strict one-way dependency.

```
src/design-tokens/
├── primitives.scss   ← raw values: color ramps, scales. No meaning, no context.
├── semantics.scss    ← named roles that map primitives to usage. Components use THESE.
├── colour-ramp-rules.json ← the ladder, curves and in-between steps every ramp derives from
├── colour-ramp-curve.mjs  ← the curve maths, shared by audit:tokens and Design Tokens/Ramps
├── article.scss      ← long-form prose styles (candor-article)
├── syntax.scss       ← code syntax-highlighting tokens
├── blog.scss         ← blog example styles
└── index.scss        ← aggregates and exports everything
```

### Primitives (`primitives.scss`)

Raw, context-free values under `:root`. Color **ramps** (each family is a 50–900 scale derived from stated rules in `src/design-tokens/colour-ramp-rules.json`, drawn in Storybook under *Design Tokens/Ramps*: one lightness ladder shared by every family, and a chroma curve per family. A ramp can also carry a step between two ladder steps, such as `navy-670`, whose number fixes its lightness by interpolation, so a needed colour is derived from the curve rather than invented), the spacing scale (`--space-1` … `--space-12`, 8px base), the type scale (`--type-xs` … `--type-3xl`, Major Third 1.25 ratio), typefaces (`--typeface-sans`, `--typeface-mono`, …), weights, line heights, tracking, and border/radius primitives.

**Two vocabularies, one rule.** A primitive is named after its scale: `--space-*`, `--type-*`, `--typeface-*`, `--weight-*`, `--leading-*`, `--tracking-*`. A semantic token is named after the CSS property it sets: `--spacing-*`, `--font-size-*`, `--font-family-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`, and the colour tokens' property-first `--color-{bg|text|…}-*`. So `--leading-tight` is a step on a scale and `--line-height-tight` is the role that uses it; the different words are deliberate. `--type-*` and `--typeface-*` replaced `--text-*` and `--font-sans` (and its siblings) in 7.0.0, because `--text-` read as the `--color-text-*` family and `--font-` as the semantic `--font-*` tokens (#367); the old names resolve as deprecated aliases until the next major.

Color families: **navy** (primary brand anchor, `navy-800` = `#082840`), **burgundy** (secondary), **azure** (links/accent), **indigo** (visited links, decorative accent), **teal** (a quiet grey-green fitted through the code-block backgrounds, `teal-115` and `teal-870`), the status ramps **red**, **gold** and **green**, and three grey ramps, neutral **gray**, **gray-cool** and **gray-warm**. Key ramp steps are annotated with their contrast behaviour, in OKCA with the WCAG 2.x figure alongside. For example, `azure-400` is the original brand blue but only OKCA 2.5 on white, and even `azure-500` (4.2) misses the 4.5 text floor, which is why `--color-text-link` uses `azure-600`, the step that also clears the floor on a card.

> **Components must never reference a primitive directly.** `var(--navy-800)` in a component is a bug. It bypasses the semantic layer and breaks dark mode. Always go through a `--color-*` role.

### Semantics (`semantics.scss`)

Named **roles** that map primitives to meaning. A role never types its own colour: when it needs a lightness the ladder lacks, add an in-between ramp step (`extraSteps` in `src/design-tokens/colour-ramp-rules.json`) and point the role at it. `npm run audit:tokens` fails on a typed colour anywhere outside `primitives.scss` and stories, in tokens and components alike. Its one named exception, the overlay scrim, is listed with its reason in `scripts/export-tokens-dtcg.js`. The syntax-highlighting palette in `syntax.scss` is derived from the ramps too. This is the layer components and consumers reference:

Every colour token is named property first (#367): `--color-{bg|text|icon|border|fill|ring}-{role}[-{variant}][-{state}][-on-{context}]`. The first word says what the token paints, which also says its contrast floor: `text` takes a text floor, and `icon`, `border`, `fill` and `ring` the non-text 3:1. `npm run audit:tokens` fails on a current name outside the grammar and on a token painted by a property its name does not allow. The names from before 7.0.0 resolve as deprecated aliases until the next major.

- **Backgrounds**: depth `--color-bg-page`, `--color-bg-surface`, `--color-bg-elevated`, `--color-bg-muted`, `--color-bg-inverse`; layout `--color-bg-content` (warm, the region a screen leads with) and `--color-bg-chrome` (cool, chrome that steps back); interaction `--color-bg-hover`, `--color-bg-active`
- **Text**: `--color-text-default`, `--color-text-subtle`, `--color-text-subtle-on-surface`, `--color-text-on-inverse`, `--color-text-on-action`, …
- **Borders**: `--color-border-default`, `--color-border-strong`, `--color-border-control`, …
- **Accent**: the brand navy as a mark, `--color-text-accent`, `--color-border-accent`, `--color-fill-indicator`; burgundy as `--color-bg-accent-secondary` / `--color-border-accent-secondary`
- **Buttons**: named after the variant that uses them, `--color-bg-action-primary` (the filled button), `--color-text-action-secondary` / `--color-border-action-secondary` (the outlined one), `--color-bg-action-tertiary`, `--color-bg-action-ghost-hover`, `--color-bg-action-destructive`, with `-hover` / `-active`
- **Form controls**: `--color-border-control` and its `-hover`, `-focus` and `-error` states; `--color-fill-track`, `--color-fill-on-action`
- **Status**: `--color-icon-error`, `--color-bg-error`, `--color-text-error`, `--color-border-error`, and the same for success and warning
- **Link / blockquote / callout / code / tooltip**: role-specific color sets
- **Spacing**: `--spacing-2xs` … `--spacing-3xl`. Component padding is a `--candor-*` hook on the component; the `--spacing-button-padding-*`, `--spacing-input-padding-*` and `--spacing-card-*` tokens are deprecated in 7.0.0 and read as each hook's fallback until the next major
- **Typography**: `--font-family-*` (with role comments), `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`
- **Shape / interaction**: `--radius-*`, `--border-width-*`, `--focus-ring-*`, `--hit-target-aaa`/`-aa`
- **Elevation**: `--shadow-sm` … `--shadow-modal`
- **Motion** (#368): `--motion-duration-instant` / `-fast` / `-base` / `-slow` (100 to 250ms), `--motion-ease-standard` / `-enter` / `-exit`, and the distances things travel, `--motion-distance` and `--motion-travel`. Arrivals decelerate and take a little longer; departures accelerate and are quicker. Under `prefers-reduced-motion: reduce` the two distances are zero, so nothing travels and fades remain, decided once in the tokens rather than in each component. `npm run audit:tokens` fails on a transition or animation with a literal duration; the looping progress indicators are its named exceptions.

Many semantic tokens carry an inline OKCA contrast note (e.g. `// OKCA 11.4 on page ✅`). Those notes are load-bearing. They record *why* a value is what it is. Preserve them when editing, and keep them in the form `[<fg>] OKCA <n> on <bg>` so `npm run audit:contrast` can re-measure them; a figure written any other way is reported as `UNCHECKED`. Prefix a superseded figure with `was` (`// … gray-500 was OKCA 3.8`) to mark it historical.

---

## Color: OKLCH

All colors are authored in **OKLCH**, `oklch(L C H)`:

- **L**: lightness, 0 (black) → 1 (white)
- **C**: chroma, 0 (gray) → ~0.4 (vivid)
- **H**: hue, 0–360°

OKLCH is perceptually uniform (equal L steps look equally different across hues), which is what lets the ramps be evenly spaced and lets the klar CLI adjust a color's lightness for contrast without shifting its hue. Convert an art-direction hex with `klar meta "#…"`.

---

## Fonts

Candor uses five typefaces, each with a defined role (see the primitive `--typeface-*` stacks and the semantic `--font-family-*` roles):

| Role token | Typeface | Use |
|---|---|---|
| `--font-family-base` / `-display` | Roboto Flex (variable) | UI workhorse; headings via the weight/`opsz` axes |
| `--font-family-accessible` | Atkinson Hyperlegible Next | Instructional UI text the user must read precisely |
| `--font-family-reading` | Noto Sans | Conversational / long-form UI prose |
| `--font-family-serif` | Noto Serif | Authored & AI-generated articles (candor-article) |
| `--font-family-mono` | Atkinson Hyperlegible Mono | Code, and cells where character position is load-bearing |

The typeface roles are not interchangeable. See the "Typography Usage Rules" in `CLAUDE.md` for the instruction-vs-comprehension decision and the Roboto Flex variable-axis guidance. Fonts are delivered via Fontsource packages (deps of the tokens package); see #169 for the optional `candor-fonts.css` convenience import.

---

## Consuming the tokens

Consumers install `@candor-design/tokens` and load the built stylesheet once:

```css
@import "@candor-design/tokens/candor-tokens.css";
```

That single import puts every `--color-*`, `--spacing-*`, `--font-*`, `--radius-*` (etc.) in scope for the whole page, including inside any web component's shadow root. The built artifacts live in `tokens/` (`candor-tokens.css`, `candor-tokens.min.css`, and the DTCG `candor-tokens.json`) and are produced by `npm run build:tokens`.

### Light and dark

Color tokens ship in both modes. Dark is applied two ways, kept in sync because both include the same `dark-color-tokens` mixin:

- `@media (prefers-color-scheme: dark)` follows the OS/browser preference automatically.
- `[data-theme="dark"]` on `<html>` is a manual override via JS.

Spacing, typography, and shape tokens are **mode-invariant**: they are defined once and not repeated per theme. Only color changes between modes.

---

## Maintainer workflow: changing a token

1. **Edit the right layer.** Adjusting a role (e.g. making the primary button darker on hover) → `semantics.scss`. Adding or reshaping a raw ramp → `primitives.scss`. Never hard-code a value in a component.
2. **Keep it OKLCH.** Convert any incoming hex with `klar meta`.
3. **Re-export the DTCG artifact.** Run `npm run audit:tokens` after any change to `primitives.scss`/`semantics.scss`. It regenerates `audit/tokens.dtcg.json` (the canonical input for contrast audits).
4. **Validate contrast.** Run `npm run audit:contrast`. It re-measures every pairing in `audit/pairings.json` in both modes against that pairing's `min` floor, and re-measures every OKCA figure recorded in a token comment against the current value. Anything its claim parser can't interpret is printed as `UNCHECKED` rather than passed silently. See the "OKCA Contrast Thresholds" section in `CLAUDE.md` for the two-axis (size × use-case tier) threshold table.
5. **Preview in Storybook.** The "Design Tokens" stories render the colour and grey ramps with the rules behind them, semantic swatches, spacing, and type scale live, which is the best visual check. Every component picks up the change automatically because they all consume the same custom properties.

New semantic tokens should earn their place: a token with no previewable consumer in Storybook is hard to justify.

---

## Governance & naming

- **Token names are public API.** Adding a token is a minor release; renaming or removing one is a major (breaking) change. See `docs/BREAKING-CHANGES.md`. Rename in `primitives.scss`/`semantics.scss`, re-run `npm run audit:tokens`, and update any `audit/pairings.json` references.
- **Naming pattern:** `--color-{bg|text|icon|border|fill|ring}-{role}[-{variant}][-{state}][-on-{context}]` (e.g. `--color-text-subtle-on-surface`), `--spacing-{scale}`, `--font-{property}-{name}`, `--radius-{size}`. Roles describe *why* a value is used, not what it looks like.
- **Non-text tokens are named for it.** `icon-`, `border-`, `fill-` and `ring-` tokens are contrast-validated only for non-text use and are exported with `$extensions.usage: "non-text"` in the DTCG file. For coloured text, use the `text-` token of the same role. See pitfall #3a in `CLAUDE.md`.

---

## Reference

- **Live token reference:** Storybook → *Design Tokens* (color ramps, semantic swatches, spacing, type scale)
- **Source of truth:** `src/design-tokens/primitives.scss`, `src/design-tokens/semantics.scss`
- **Contrast workflow:** `npm run audit:contrast`; `CLAUDE.md` → "OKCA Contrast Thresholds"; klar [README](https://github.com/pawn002/klar/blob/main/README.md) for the command reference
- **Typography roles:** `CLAUDE.md` → "Typography Usage Rules"; `docs/LESSONS-LEARNED.md`
- **External:** [OKLCH Color Picker](https://oklch.com/), [Type Scale Calculator](https://typescale.com/)
