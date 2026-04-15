# Visual Design in Candor

Candor is a humanist design system. That word is load-bearing. It is not a mood, a color palette, or a stylistic preference — it is a commitment that every surface in the system, including the technical and machine-generated ones, should feel like part of a considered, human-authored artifact.

The typefaces make this concrete. Roboto Flex, Noto Serif, and Atkinson Hyperlegible are all drawn from the humanist tradition: letterforms shaped by the hand, designed for reading by people. OKLCH is used because it models human vision rather than machine arithmetic. These are not incidental choices, and they set the terms for everything built on top of them.

## The core tension

Technical content has real legibility requirements. Code must be scannable. Data tables must differentiate rows. Form errors must be impossible to miss. The humanist position is not to ignore these requirements — it is to meet them while preserving warmth, coherence, and the sense that a human made deliberate choices about every surface.

The failure mode is always the same: reaching for the clinical default because it is the easy answer. Pure white on pure black. `font-weight: bold` on every state that needs attention. A single 1px hairline between rows. Maximum contrast. These choices are legible, but they are not designed. They interrupt the system's character and betray that no one stopped to think.

**The working question is never "is this legible enough?" alone. It is "is this legible and does it belong to the rest of the artifact?"** Both answers must be yes. If you can only get one, the component is not finished.

Candor navigates the tension by making the humanist choice the default path and requiring a reason to deviate from it. The type scale, color tokens, spacing grid, and contrast tiers are all pre-tuned so that a developer assembling components from the library produces humane output without having to think about it. The traps appear when someone reaches outside the token system — picking a raw color, setting a weight manually, choosing a size off-scale — and the clinical default comes back through the gap.

---

## 1. Grid and alignment

A grid is not a visual style. It is the promise that every element on a screen was placed with reference to every other element. Without that promise, a layout feels accidental no matter how polished the individual pieces are.

Candor's grid is the 8px spatial system defined in `src/design-tokens/spacing.scss`. Every gap, padding, margin, and component dimension resolves to a multiple of 8px. This is not an arbitrary rule — it is what allows a card, a form, a table, and a dialog built independently to sit next to each other and feel related. The eye reads the shared rhythm before it reads the content.

### What this means in Candor

- **Use spacing tokens, always.** `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`. Never `padding: 12px` or `margin: 10px 14px`. An off-grid value in one component propagates: the next developer copies it, and the rhythm is gone.
- **Alignment is a first-class design decision.** Numeric columns right-align. Text columns left-align. Form labels align consistently (top or left, not mixed within a single form). Iconography aligns to text baselines or cap heights, not eyeballed centers.
- **Optical corrections are allowed, but named.** If a glyph needs a 1px nudge to look centered, that is optical correction — acceptable, but it should be obvious in the code that it is intentional and not a grid violation.

### Traps

| Trap | What it looks like | Fix |
|---|---|---|
| Reaching for an odd value | `padding: 10px` or `gap: 14px` | Pick the nearest spacing token. If none fit, the composition is wrong, not the token scale. |
| Inconsistent gutter at different breakpoints | Desktop uses `--space-6`, mobile uses a bespoke `16px` | Define responsive spacing with tokens at both ends |
| Content-width drift | Each page picks its own max-width | Use a shared container width; prose columns should cap around 65–75ch for readability |
| Stacking without rhythm | Everything uses `--space-4` because it is "safe" | Hierarchy needs variation — tighter spacing for related elements, looser for section breaks |

### Do / don't

```scss
// Do — tokens, grid-aligned, hierarchy expressed through spacing variation
.card {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);

  &__header {
    margin-bottom: var(--spacing-sm);
  }
}

// Don't — hard-coded values, uniform spacing that flattens hierarchy
.card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

---

## 2. Typographic system

Typography in Candor is not decoration. It is the primary mechanism by which hierarchy, tone, and reading mode are communicated. Before color does any work, the type has already told the reader what they are looking at.

Candor uses four families, each with a defined role. Mixing them carelessly produces noise; using them deliberately produces voice.

| Token | Family | Role |
|---|---|---|
| `--font-family-display` / `--font-family-base` | Roboto Flex | Headings, UI text, general-purpose. Variable axes (`opsz`, `GRAD`, `wdth`) carry hierarchy beyond weight. |
| `--font-family-serif` | Noto Serif | Long-form editorial prose in `Article` and similar reading contexts. Not a decorative flourish — it signals "this is written to be read." |
| `--font-family-accessible` | Atkinson Hyperlegible | Form labels, status messages, annotations, badges. Critical UI text where glyph distinction matters at small sizes. |
| `--font-family-mono` | Noto Sans Mono | Code, technical values, anything where character position carries meaning. |

### The variable-font discipline

Roboto Flex is a variable font. The `opsz` (optical size) axis is the single most important feature and the one most often ignored. With `font-optical-sizing: auto`, the browser maps stroke weight to computed font size — larger headings get heavier, smaller text gets lighter, and the result is a hierarchy that feels drawn rather than assembled.

**The trap:** reaching for `font-weight: 600` to make a heading feel stronger. Numeric weight steps create artificial jumps. The `opsz` axis creates graduated hierarchy that feels inevitable. Always ask whether the variable axis can do the work before adding weight.

```scss
// Do — optical sizing carries the hierarchy
.heading {
  font-family: var(--font-family-display);
  font-optical-sizing: auto;
  font-size: var(--font-size-xl);
}

// Don't — stacking weight on top of size, flattening the axis
.heading {
  font-family: var(--font-family-display);
  font-weight: 600;
  font-size: var(--font-size-xl);
}
```

### Atkinson discipline

Atkinson Hyperlegible carries critical UI text because its glyph differentiation survives at 14px where other typefaces begin to blur. Two rules:

- **Bold has two distinct jobs in Atkinson contexts — hierarchy and contrast — and they must not be confused.** As a hierarchy signal, bold marks structural anchors: form field labels, section headings. As a contrast call, bold is applied at 14px when the OKCA Tier 2 threshold requires it — bold drops the required score from 6.5 to 4.5, which `--color-text-subtle` (4.6) clears. Error messages are a specific case: they are Tier 1 reading text and must either use `--color-text-default` or be bumped to 16px — not bolded as a workaround. Bold on a red error message reads as double-emphasis and does not substitute for a genuine contrast fix.
- **Positive letter-spacing is mandatory.** Without it, adjacent glyphs like "rr" cluster into "m." Use `0.06em` for 14px badges, `0.02em` for 16px body roles, `var(--letter-spacing-wide)` for uppercase labels. Never zero.

### The 14px floor and the tier system

No readable text in Candor falls below 14px. 12px (`--font-size-xs`) is for decorative chrome only — never for content a user is expected to read. At 14px, the OKCA contrast tiers (Reading / Functional UI / Supplementary) determine the threshold. See the main `CLAUDE.md` for the tier table.

### Traps

| Trap | What it looks like | Fix |
|---|---|---|
| Weight inflation | Every card title is `font-weight: 600` | Let `opsz` do the work; reserve weight for genuine structural emphasis |
| Atkinson bold on errors | `[bold]="true"` on a `role="status" color="error"` message | Remove bold; Tier 1 errors need 16px or `--color-text-default`, not a bold workaround |
| Mono in UI chrome | Timestamps or labels set in `--font-family-mono` for a "technical" feel | Mono is for content where character position is load-bearing, not for flavor |
| Serif in forms | Noto Serif on an input's helper text | Helper text is Atkinson; serif is for editorial reading contexts |
| Off-scale sizes | `font-size: 15px` because 14px felt small and 16px felt big | The scale is the hierarchy. If nothing fits, the layout needs to change, not the scale |

---

## 3. Strategic color palette

Candor's palette is deliberately limited. The whole system resolves to a small set of semantic tokens: page, surface, elevated, inverse for backgrounds; default, subtle, subtle-on-surface, disabled for text; primary, secondary, tertiary, destructive for actions; success, warning, error, info for status. That is the entire working vocabulary. If a design needs a color that is not in that list, the first question is always whether the design is wrong, not whether the palette is insufficient.

### OKLCH as a design tool, not a format

OKLCH is not just a more accurate color space. It is a reasoning tool. Because lightness is perceptually uniform, you can manipulate it predictably: dropping L by 0.1 produces a predictable darkening regardless of hue. Because chroma is independent of lightness, you can mute a color without making it darker. This is why Candor uses OKLCH everywhere and why `cpqi` is the canonical tool for checking and adjusting values.

**Always check gamut.** OKLCH describes a wider space than sRGB. A color that is out of the sRGB gamut will be silently clamped by the browser, and the result will not match the token. `cpqi meta` flags this.

### Semantic tokens, not raw values

The strict rule is: components consume semantic tokens, never primitive colors. A card uses `--color-bg-surface`, not `oklch(0.98 0 0)`. An error message uses `--color-status-error-text`, not the error primitive. This is what allows dark mode, theme variants, and future palette changes to work without touching component code.

```scss
// Do
.alert--error {
  background: var(--color-status-error-bg);
  color: var(--color-status-error-text);
  border: 1px solid var(--color-status-error);
}

// Don't
.alert--error {
  background: oklch(0.96 0.02 25);
  color: oklch(0.35 0.18 25);
  border: 1px solid oklch(0.55 0.2 25);
}
```

### The separation of base and text status colors

A status color at its base lightness — the color you use for an icon, a chip background, a left-edge accent — is not the color you use for text at 14px. They live in separate tiers because the contrast math is different. `--color-status-error` is for non-text use; `--color-status-error-text` is for text. Never substitute one for the other. This is one of the most common sources of a failed contrast audit.

### The link-color discipline

Links must be hue-distinct from body text, not just contrast-compliant. A dark-blue link next to dark-gray body text at the same lightness is technically accessible and practically invisible. `--color-link` is azure (well-separated from the near-black body text hue) and visited links shift to purple. Underlines stay on for inline links in prose regardless.

### Dark mode specifics

Dark mode is where clinical defaults are most tempting and most destructive.

- **Status backgrounds at identical lightness are indistinguishable.** Differentiating success, warning, error, and info requires varying both L and hue. A four-color row all at L=0.25 will read as one color with different tints.
- **High L plus high chroma equals neon glow.** A saturated status color that looked muted on a light page glows uncomfortably on a dark one. Reduce L and C together.
- **Dark surface delineation needs borders, not just L-steps.** The WCAG contrast formula compresses at the dark end; a 0.05 L difference that reads clearly on white vanishes on near-black. Use `--color-border-*` tokens on elevated surfaces.
- **H=347 (crimson) has no in-gamut medium that reads as dangerous.** The outlined pattern (thin border, transparent fill, colored text) is the working solution for destructive affordances in dark mode.

### Traps

| Trap | What it looks like | Fix |
|---|---|---|
| Using `--color-status-error` for 14px text | A small error label fails contrast | Use `--color-status-error-text` |
| Two AA-compliant colors, no separation | Link text and body text both pass contrast against white, but blend against each other | Links must differ by hue, not just lightness |
| Pure white on pure black | `color: white; background: black;` or equivalent near-values | Use `--color-text-default` on `--color-bg-page` — both pre-tuned away from the extremes |
| Dark surfaces that disappear into each other | Card on page with only a 0.03 L-step | Add `--color-border-default` or step L by ≥0.06 |
| Out-of-gamut OKLCH | A chroma value the browser silently clamps | Run `cpqi meta` before committing new colors |

---

## 4. Useful imagery

Candor is primarily a UI system, so "imagery" here covers the full visual-substance category: photography, illustration, iconography, data visualization, and even decorative shapes. The principle is the same across all of them: if an image is not doing work, it is doing harm.

Work, in this context, means one of four things:

1. **Conveying information** that text cannot convey efficiently (a chart, a diagram, a product photo showing a detail).
2. **Establishing the character of a surface** (an editorial header image that sets the tone for long-form reading).
3. **Providing navigation or recognition** (an avatar, a product thumbnail, an icon that speeds wayfinding).
4. **Expressing brand presence** where a page would otherwise be uncharacterized.

An image that does none of these is filler, and filler erodes the sense that every element was chosen.

### What this means in Candor

- **Icons are functional, not decorative.** The icon system is semantic: a checkmark means success, an exclamation means warning. Decorative icons (a sparkle next to a heading for "flair") dilute the semantics and should be removed.
- **Iconography should pair with text wherever the icon's meaning is not universal.** An icon-only button without an accessible name fails both a11y and comprehension. A status indicator that uses only color (no icon, no text) fails Tier 3 contrast by definition, because color is the sole channel.
- **Photography and illustration inherit the humanist frame.** A page of warm serif prose with a harsh, desaturated stock photo is incoherent. If photography is used in an Article or editorial surface, it should sit visually inside the system's palette — either through the image selection itself, or through treatment (warm overlay, border, aspect ratio on the spatial grid).
- **Data visualization is a specific case.** Charts must use the status and action tokens, not a parallel chart palette. A "chart red" that differs from `--color-status-error` means the system has two reds, and a user has to learn which means what. If charts need more colors than the semantic palette provides, the colors should be generated from the same OKLCH foundation (`cpqi variants`).

### Traps

| Trap | What it looks like | Fix |
|---|---|---|
| Decorative icons on headings | A trophy icon next to "Results" | Remove it; the heading level is the signal |
| Color-only status dots | A red circle with no label, no icon | Add a label or shape; color cannot be the sole channel |
| Stock imagery disconnected from palette | Cool-tone hero photo on a warm-neutral page | Recolor, overlay, or replace |
| Chart palette drift | Bar chart uses `#e74c3c` for "error" | Use `--color-status-error` or OKLCH-derived chart tokens |
| Aspect ratios off-grid | A hero image at `16:9` in a layout where everything else resolves to 8px units | Use aspect ratios that land on the spacing grid |

---

## Signals of a well-designed screen

A checklist a reviewer can run on any new screen or component. These are compositional and aesthetic signals — they sit alongside the contrast and a11y audits, not inside them. If more than two or three of these are failing, the screen is not finished regardless of what the automated tools say.

1. **Rhythm is visible.** Squint at the screen. Can you see consistent vertical spacing between sections? If everything runs together or the gaps are erratic, the spacing tokens are being used inconsistently.
2. **Type hierarchy is legible without color.** Turn the screen grayscale. Can you still tell which element is the page title, which is a section heading, and which is body? If not, the hierarchy is being carried by color rather than type.
3. **No more than three type families are visible.** Display/UI, one reading family (serif or Atkinson depending on context), and optionally mono. A fourth family is almost always a mistake.
4. **Headings feel drawn, not bolded.** If every heading reads as "the same font, heavier," the `opsz` axis is not working. Optical sizing should produce a hierarchy that feels graduated, not stepped.
5. **Color is doing one job per token.** Errors are `--color-status-error-*`, links are `--color-link`, primary actions are `--color-action-primary`. If a color is being used for two unrelated purposes on the same screen, the semantics are leaking.
6. **Backgrounds delineate by more than luminance alone.** Cards, panels, and elevated surfaces are distinguishable even on a dark theme. Borders are present where the L-step is subtle.
7. **Edges and corners feel intentional.** Border radii are consistent within a scale. No component has three different radii (4px on a button, 6px on a card, 8px on a modal) unless the system defines them that way.
8. **Interactive affordances are distinct from static text.** Links are visibly links. Buttons are visibly buttons. A user can tell what is clickable without hovering.
9. **Nothing is at maximum.** No pure white text, no pure black backgrounds, no saturated primary at full chroma used as body color. If a value is at the extreme, there is almost always a humanist alternative one step in.
10. **Content feels read-at, not displayed-at.** Especially for prose surfaces, line length sits in the 65–75ch range, leading is comfortable, and the eye does not bounce. If the layout feels like a database export, it probably is one.
11. **Icons have meaning.** Every icon on the screen is doing semantic or navigational work. None are decorative flourish.
12. **A reviewer could describe the screen's tone in a sentence.** "Calm, editorial, focused." "Dense, functional, legible." If the tone is unnameable or contradictory, the composition is inconsistent.

---

## When clinical defaults show up

When a screen or component feels cold, flat, or mechanical, the instinct is to adjust color or add warmth at the end. That almost never fixes it. Clinical feel is usually caused by a specific upstream decision, and diagnosing which decision is faster than treating the symptom.

### Symptom: "This looks like a spreadsheet"

Likely causes, in order of frequency:

- **Uniform spacing.** Every row has the same padding; there is no hierarchy between groups. Fix: vary spacing tokens between related and unrelated elements.
- **Single-weight typography.** Everything is `--font-family-base` at `--font-size-md`, regular weight. Fix: introduce scale variation; let `opsz` do the work on headings; use Atkinson for labels.
- **Hairline borders everywhere.** 1px lines separating every row. Fix: use spacing to separate where possible, reserve borders for genuine structural boundaries.

### Symptom: "This feels harsh on the eyes"

- **Pure or near-pure white background.** Check if `--color-bg-page` is being overridden. The page background is pre-tuned off from pure white.
- **Maximum contrast text.** Body text at the darkest possible value. `--color-text-default` is intentionally not at the extreme; using a custom darker value defeats that.
- **High chroma status colors in dark mode.** Saturated error or warning backgrounds glow. Reduce L and C together.

### Symptom: "The technical content sits outside the design"

This is the most common failure in components like `Code`, `Table`, and data displays.

- **Mono font used without adjustment.** A raw monospace block in the middle of serif prose is jarring. Fix: give it a background (`--color-bg-surface`), padding, and a border radius so it sits inside the visual frame.
- **Code block background is pure black in dark mode.** It interrupts a warm layout. Fix: use `--color-bg-elevated` or a slightly-warmer surface, not `#000`.
- **Tabular numerals not enabled.** Numbers wobble in columns. Fix: `font-variant-numeric: tabular-nums` on numeric columns.
- **No typographic treatment of technical content.** Function names, types, and keywords all look identical. Fix: use syntax tokens — even a two-color treatment (identifier vs. keyword) is enough to bring code inside the system.

### Symptom: "Everything is bold and nothing stands out"

- **Atkinson bold used incorrectly on Tier 1 text.** Error messages and alert body text are bold, but they are Tier 1 (reading text) — bolding does not substitute for the required 9.5 OKCA score. Fix: bump to 16px or use `--color-text-default`. Bold is legitimate at 14px for Tier 2 functional text, where it drops the threshold from 6.5 to 4.5.
- **Heading weight inflation.** Every heading reaches for `font-weight: 600`. Fix: let optical sizing do the work; remove explicit weight.
- **Label weight leaking into prose.** Body copy is inheriting a bold style from a parent. Fix: scope the bold; body prose should almost always be regular.

### Symptom: "The color palette feels cheap"

- **Raw OKLCH values in components.** A developer picked a color directly instead of using a semantic token. Fix: replace with the correct semantic token; if none fits, the component's role is unclear.
- **Status colors used decoratively.** A success-green used as a brand accent, or an error-red used for visual flair. Fix: decorative use breaks the semantics; pick a neutral or action token.
- **Out-of-gamut OKLCH being clamped.** The rendered color does not match the token because it was out of sRGB. Fix: run `cpqi meta` and bring it in-gamut.

### Symptom: "I can't tell what's clickable"

- **Links indistinguishable from body text.** Using `--color-text-default` instead of `--color-link`, or a custom dark blue with insufficient hue separation. Fix: use `--color-link`; keep underlines in prose.
- **Ghost buttons without affordance.** A button with no background and no border reads as text. Fix: give it a border, a hover state, or both.
- **Focus states missing or invisible.** Keyboard users can't see where they are. Fix: use the focus-ring tokens; never suppress `:focus-visible`.

---

The short version of all of this: Candor assumes you will do the humane thing by default, and it makes that the path of least resistance. The traps appear when someone steps off the path — picks a raw color, sets a weight by hand, chooses an off-scale size, uses a mono font as flavor. When a screen feels wrong, the fix is almost always a step back onto the path, not a new decision added on top.
