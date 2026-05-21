# Lessons Learned

Insights collected from working sessions between Claude and the designer. These are hard-won decisions — moments where the obvious implementation turned out to be wrong, or where a constraint forced a better solution.

---

## Typography

### Variable fonts afford richer hierarchy than weight alone

Roboto Flex is a variable font with multiple axes beyond `font-weight`: optical size (`opsz`), grade (`GRAD`), width (`wdth`), and more. Setting `font-optical-sizing: auto` tells the browser to automatically match the `opsz` axis to the computed font size — meaning h1 at 39px, h2 at 31px, and h3 at 25px each get stroke weights that are optically appropriate for their size without any manual weight tuning.

**The trap:** Reaching for `font-weight: semibold` on h3 to create hierarchy feels natural but produces an artificial, numeric step. The optical size axis creates a gradient that feels designed, not engineered.

**Rule:** Before adjusting `font-weight` to create hierarchy in Roboto Flex, first ask whether `font-optical-sizing: auto` or `font-variation-settings` on `opsz` or `GRAD` would produce a more natural result.

---

### Atkinson Hyperlegible — bold weight is a hierarchy signal, not a legibility tool

Atkinson's wider letterforms, open counters, and distinctive glyphs already provide strong legibility at regular weight (400). Using bold (700) on top of that is double-emphasis — it works for labels and structural anchors, but applying it to error messages or status text reads as too heavy and disrupts hierarchy.

**The trap:** Error messages feel urgent, so the instinct is to bold them. But the error color already carries urgency. Bold + red together overpowers the surrounding context.

**Rule:** In Atkinson contexts, bold is for hierarchy (labels, section anchors). Color, size, and the typeface's inherent legibility handle everything else.

---

### Positive letter-spacing is mandatory with Atkinson Hyperlegible

Atkinson's glyph shapes prevent clustering better than most typefaces, but at zero letter-spacing, adjacent similar glyphs still merge — most visibly "rr" reading as "m". The fix is positive tracking, tuned by context:

| Context | Value | Reason |
|---|---|---|
| Badges (14px) | `0.06em` | Small size needs more air — err toward too much |
| Body roles (16px) | `0.02em` | Sufficient at normal reading size |
| Uppercase labels | `0.05em` (`--letter-spacing-wide`) | Uppercase already benefits from tracking |

**The trap:** `letter-spacing: 0` (or `--letter-spacing-normal`) feels like a safe default. With Atkinson it isn't.

---

### Italic text needs positive letter-spacing

Italic letterforms are slanted, which reduces the apparent inter-glyph space compared to upright text at the same tracking. At zero letter-spacing, italic body text reads more tightly than it should — most noticeable in blockquotes, figcaptions, and `em` emphasis runs. Apply `--letter-spacing-italic` (0.02em) to all italic text at body size, and increase to 0.03em at 14px.

| Context | Value | Reason |
|---|---|---|
| Italic body text (16px) | `0.02em` (`--letter-spacing-italic`) | Restores visual cadence lost to slant |
| Italic small text (14px) | `0.03em` | Small size compounds the apparent tightness |

**The trap:** Italic is often treated as a pure typographic switch with no spacing consequence. The slant is a visual spacing change — tracking must compensate.

---

### em is the correct unit for letter-spacing; ch is for container widths

`em` scales with font-size, making tracking proportional across type sizes. `ch` (width of the "0" glyph) is the right unit for measuring how many characters fit in a container (e.g., `max-width: 65ch` for article measure), not for inter-glyph spacing.

---

### 16px body text, 14px system floor

20px body text reads as juvenile in editorial contexts. 16px is the correct baseline for readable body text. Nothing in the system should fall below 14px (`--font-size-sm`) for readable text — `--text-xs` (12px) is decorative/non-text only.

---

## Color & Contrast

### Link color must be perceptually distinct from body text, not just accessible on white

The original article link color (`--color-action-primary` = navy-800) had 15:1 contrast on white — technically excellent — but only 1.2:1 against the gray-700 body text. Links and body text were visually indistinguishable without the underline doing all the work.

**The fix:** Use a mid-lightness blue (azure-500, 5.1:1 on white) that is hue-distinct from neutral gray body text. The underline satisfies WCAG 1.4.1 Path B (non-color cue always present), so the 3:1 link-to-body ratio isn't required — but perceptual distinction still matters for usability.

**Rule:** Link colors should be hue-distinct from body text, not just contrast-compliant against the page background.

---

### Two accessible colors cannot always have high contrast between each other

Any two colors that both meet WCAG AA (4.5:1) on white are mathematically capped at roughly 3:1 contrast between themselves. This is a consequence of the WCAG contrast formula, not a solvable design problem.

**Implication:** When two semantically distinct colors must both be AA on white (e.g., visited vs. unvisited links, two status tones on the same background), expect limited separation. Use the widest hue shift available and accept that color alone won't do full the work. Use non-color cues (text labels, icons, underline style) wherever possible.

---

### `:visited` CSS is color-only — browser privacy blocks everything else

Browsers intentionally restrict what styles can be applied to `:visited` links. Only color properties are permitted: `color`, `background-color`, `border-*-color`, `outline-color`, `column-rule-color`, `fill`, `stroke`. All other properties — including `text-decoration-style: dotted` — are silently ignored. This is a security restriction against history-sniffing attacks, not a CSS error.

**The trap:** `text-decoration-style` on `:visited` appears to do nothing, looks like a bug, and reports no error. It just doesn't render.

**Implication:** Visited state differentiation is fundamentally color-only in CSS. The industry pattern of solid → dotted underline for visited state is blocked. Document it, use the best available hue shift, and track the issue for future JS-assisted solutions (issue #19).

---

### Status colors: separate icon/border colors from text-on-bg colors

The status color palette needs two tiers:
- **Base color** (`--color-status-*`): for icons, borders, indicators — not necessarily AA on white
- **Text color** (`--color-status-*-text`): contrast-validated against the paired status-bg

Success and warning base colors (3.1–3.3:1 on white) are non-text use only. Using them as text on their light backgrounds fails AA. Always use the `-text` variant for text inside status panels and badges.

**The deeper trap:** The token file itself was annotated `// non-text/icon use only`. The tokens were used for text anyway. When a token carries a usage contract in its comment, honor it — don't assume it can flex.

---

### Dark mode: status backgrounds at identical lightness are indistinguishable

Setting all dark mode status backgrounds to `L=0.20` with only hue variation creates backgrounds that are perceptually near-identical — especially error (red, H=25) and warning (amber, H=53) which are only 28° apart. At low lightness, hue differences collapse.

**The fix:** Differentiate by lightness AND hue. Drop error darker, raise warning lighter, and widen the hue gap. Target deltaE 2000 > 11 between each status background and the page background, and > 11 between each other.

---

### Dark surface delineation cannot rely on lightness alone

At low L values (L < 0.30), large lightness steps produce negligible WCAG contrast ratios. Moving from L=0.16 (page) to L=0.24 (surface) yields only ~1.1:1 — the backgrounds are perceptually indistinguishable even though the L difference feels meaningful in absolute terms. The WCAG contrast formula compresses heavily at the dark end of the scale.

**The fix:** Use a border to carry the zone-delineation work. A 1px `--color-border-strong` outline reliably signals "this is a distinct content zone" regardless of how close the backgrounds are in lightness. Background tint can still add atmosphere — hue distinctness (e.g., a cool navy tint vs a neutral gray page) registers perceptually even when contrast ratios are low — but the border is what makes the boundary legible.

**The trap:** Assuming that a slightly lighter or more saturated dark background will read as visually distinct. It won't, until L is high enough to escape the compressed dark range (~L > 0.35).

---

### deltaE 2000 is the right measure for background distinguishability

WCAG contrast ratio is luminance-based and useful for text-on-background legibility. For distinguishing two non-text backgrounds from each other, deltaE 2000 is more appropriate — it accounts for hue, chroma, and lightness interactions perceptually. The threshold of deltaE > 11 represents "clearly different" to a typical observer.

`klar variants` uses deltaE 2000 internally with a default minimum of 11 — use this as the reference standard for background differentiation throughout the system.

---

## Angular / Implementation

### ViewEncapsulation.None + host class for projected content styling

Angular's emulated encapsulation only adds scoping attributes to a component's own template elements — not to content projected from outside (e.g., string literals in stories, or `<ng-content>` from a parent). Using `::ng-deep` is deprecated and will be removed. The correct pattern is `ViewEncapsulation.None` with the component's SCSS scoped under a host class set via the `host` binding.

---

### em double-scaling in nested code elements

`pre { font-size: 0.875rem }` combined with a global `.article code { font-size: 0.875em }` rule results in code inside pre receiving both — scaling to `0.875em × 14px = ~12px`. Always reset `font-size: 1em` on nested elements inside blocks that set an explicit font size.

---

### Storybook's `withThemeByDataAttribute` breaks Angular rendering

Storybook's built-in `withThemeByDataAttribute` decorator from `@storybook/addon-themes` conflicts with Angular's change detection cycle, causing rendering failures when switching themes in Storybook. The fix is a lightweight custom decorator that sets `data-theme` directly on the `<html>` element without interfering with Angular.

**The trap:** It's the officially recommended Storybook pattern, so the Angular incompatibility isn't obvious until you're debugging blank stories.

---

### CSS cascade source order: `[data-theme="light"]` must come after the dark media query

When supporting manual theme overrides (`data-theme="light"`) on systems where the OS reports a dark preference, the `[data-theme="light"]` rule block must appear *after* `@media (prefers-color-scheme: dark)` in the stylesheet. CSS specificity is equal between a media query and an attribute selector — source order decides the winner.

**The trap:** Edge and Firefox on dark-OS systems will apply the dark media query and ignore `data-theme="light"` if the light override appears first in source. Chrome happened to work due to implementation differences, masking the bug.

---

### `--color-text-subtle` is not sufficient on surface backgrounds

`--color-text-subtle` (gray-500) achieves 4.5:1 on the page background but only ~3.4:1 on surface backgrounds (gray-100). A separate token, `--color-text-subtle-on-surface`, is required for secondary text inside cards, blockquotes, and elevated panels.

**Rule:** Always validate contrast against the *actual* background a token will appear on, not just the page background. Semantic tokens are only as good as the assumptions behind them.

**Convention:** Annotate every text token in `semantics.scss` with the specific background it was validated against, e.g. `// 4.5:1 on --color-bg-page ✅`. A comment that says "passes AA" without naming the background is incomplete documentation.

---

### Component-scoped token groups are safer than shared utility tokens on non-default backgrounds

When a component always renders on a specific non-page background (e.g., blockquotes on gray-100, cards on a surface), define a token group scoped to that component: `--color-blockquote-bg`, `--color-blockquote-border`, `--color-blockquote-text`. Don't reuse a global utility token like `--color-text-subtle` and assume it will pass contrast on every background it might encounter.

**Why:** Global utility tokens implicitly encode a background assumption. Scoped token groups make the background contract explicit and keep contrast validation local to that component.

---

### OKLCH colors must be gamut-checked before finalizing

OKLCH's gamut extends beyond sRGB, making it easy to author valid-looking colors that browsers clamp or shift unpredictably on sRGB displays. The warning status color (`oklch(0.66 0.16 53.54)`) was initially authored out of sRGB gamut — browsers silently shifted the hue.

**Rule:** After authoring a new OKLCH color, run `klar meta <oklch>` or check `gamut: sRGB` in the output. If out of gamut, reduce chroma until it passes.

---

### Angular: never generate IDs in template expressions

Generating element IDs with `Math.random()` (or any non-deterministic call) inside a template expression triggers `ExpressionChangedAfterItHasBeenCheckedError` — Angular evaluates expressions twice in dev mode and sees a different value each time.

**The fix:** Generate IDs once in the component constructor and store them as a property. Template expressions must be pure and stable across evaluations.

---

### Angular stories require `moduleMetadata` for external component selectors

When a Storybook story template uses another Angular component (e.g., `<app-button>` inside a card or modal story), that component must be declared in `moduleMetadata({ imports: [ButtonComponent] })` in the story file. Without it, Angular's compiler does not recognize the selector and the template renders silently empty or throws.

**The trap:** The error is easy to miss — the story loads without crashing, but the embedded component simply doesn't render.

---

### Storybook HMR does not rebuild the manager

Hot Module Replacement in Storybook only rebuilds story content. Changes to `globalTypes` in `preview.ts` (toolbar controls, theme switcher) and changes to `main.ts` (addons, builders) do not take effect on save — they require a full stop and restart of the Storybook process.

**The trap:** The story panel updates but the toolbar does not change, making it look like the config was wrong rather than just stale.

---

### Don't diagnose color issues from screenshots alone

OKLCH colors with low chroma can appear perceptually hue-tinted in screenshots, browser gamma rendering, or compressed image formats — even when the SCSS value is neutral. What looks like a color bleed (e.g., list item text appearing slightly blue) may simply be a rendering artifact, not a CSS rule.

**Rule:** Before flagging a color issue, cross-reference the SCSS token value. If the SCSS is neutral gray with no hue-tinted token, trust the code over the screenshot.

---

### H=347 (burgundy/crimson) has no in-gamut "medium" that reads as dangerous in dark mode

At H=347, the sRGB gamut only permits chroma C≤0.15 across most of the lightness range. Worse, the sRGB gamut floor at that hue sits around L=0.36 — there is no accessible mid-lightness crimson (L=0.45–0.60) that both contrasts against a dark page and reads as red/crimson rather than pink. At high lightness (L≥0.65) the same hue shifts perceptually toward magenta-pink or bubblegum, not crimson.

**The trap:** Authoring a dark-mode fill for a destructive button by brightening the light-mode fill produces a pastel pink — a color that reads as cheerful, not dangerous.

**The solution:** Use an outlined pattern for dark mode: transparent background with crimson-rose border and text. At L=0.72, C=0.15, H=347 the color is clearly rose/pink but the outline form factor communicates "caution/destructive" more reliably than a filled pink would. Contrast: 4.3:1 on dark page ✅.

**Rule:** For any hue where the light-mode fill requires dark-bg lightness (L<0.40), always prototype the dark-mode version separately rather than assuming a brightened fill will work.

---

### Tokens that vary by theme must live in the theme mixin, not just `:root`

Any token overridden in `@mixin dark-color-tokens` must also be explicitly set in `@mixin light-color-tokens` — not just in the bare `:root` block. Tokens defined only in `:root` are not re-applied when `[data-theme="light"]` is set, because the attribute selector only includes the mixin.

**The trap:** On a dark-OS system, the cascade order is: `:root` (light tokens) → `@media (prefers-color-scheme: dark)` (dark overrides) → `[data-theme="light"]` (light mixin). If the light mixin doesn't include the token, the dark override sticks — even in "light mode."

**Example:** Shadow tokens (`--shadow-md`, etc.) were defined in `:root` but not in the light mixin. Adding a dark-mode white-tinted shadow override caused white shadows to persist in `[data-theme="light"]` on dark-OS systems. Fix: move shadow tokens into the light mixin so the theme switcher correctly resets them.

**Rule:** If a token needs a dark-mode variant, it belongs in both theme mixins — not in `:root` alone.

---

### OKLCH→sRGB rounding can silently miss the contrast threshold

klar rounds OKLCH lightness to 2 decimal places, so two visually distinct hex values can report the same OKLCH L and the same contrast ratio. `oklch(0.57 0 0)` is documented as `#767676` (4.55:1 on white, passes AA) but browsers convert it to `#777777` (4.47:1 on white, fails). klar reports both as 4.5:1 — the discrepancy is invisible in the token file.

**The trap:** A token annotated `// 4.5:1 ✅` can still fail the axe accessibility scanner at runtime because the browser's OKLCH→sRGB conversion rounds differently than klar.

**Rule:** For any token sitting near a contrast threshold (4.5:1, 3:1), build in headroom — author at L=0.56 rather than L=0.57, or verify against the browser's reported hex via `getComputedStyle`. If the token is on the boundary and klar gives exactly 4.5, it may be 4.47 in practice.

---

### `app-input` in a toolbar row: use `align-items: flex-start`, not `center` or `flex-end`

`app-input` always reserves space below the input field for hint/error text — even when no hint or error is set. This makes the component host element taller than a same-height button, and it makes the extra space appear at the **bottom** of the host (not the top).

Consequence:
- `align-items: flex-end` — aligns host bottoms, but the visible input field sits ~8px above the button
- `align-items: center` — centers host midpoints, but the field is at the top half of the host so it still renders slightly above center
- `align-items: flex-start` — aligns host tops, and since the input field starts at the top of the host, the visible field and the button share the same top edge ✓

**The fix:** `align-items: flex-start` on the row container. If an absolute-positioned badge sits above the button, add `padding-top` equal to the badge overflow (typically 6px) to prevent clipping.

```html
<div style="display: flex; align-items: flex-start; gap: 0.75rem; padding-top: 6px;">
  <app-input placeholder="Search..."></app-input>
  <div style="position: relative;">
    <app-button variant="secondary">Filters</app-button>
    <app-badge style="position: absolute; top: -6px; right: -6px;">3</app-badge>
  </div>
</div>
```

**The trap:** `align-items: center` is the intuitive choice for a toolbar. It's wrong whenever `app-input` shares a row with buttons that don't have label/hint space.

---

### `aria-label` on `<span>` without a role is invalid — use `aria-hidden` for decorative markers

`aria-label` is only meaningful on elements with an ARIA role (implicit or explicit). A plain `<span>` has no implicit role, so `aria-label="required"` on a required-field asterisk is undefined behavior — axe flags it as inconclusive with severity "serious."

**The fix:** Use `aria-hidden="true"` on the decorative `*` span. The semantic signal for required state comes from `[required]` on the `<input>` itself, which screen readers announce automatically. The asterisk is a visual convention, not an accessible label.

**Rule:** Never use `aria-label` as a tooltip or annotation on a generic `<span>` or `<div>`. If the element needs accessible text, give it a role. If it's decorative, use `aria-hidden="true"`.
