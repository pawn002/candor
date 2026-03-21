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

Any two colors that both meet WCAG AA (4.5:1) on white are mathematically capped at roughly 3:1 contrast between themselves. This makes visited/unvisited link differentiation fundamentally color-only in CSS — `text-decoration-style` and other non-color properties are silently blocked on `:visited` by browsers for privacy reasons.

**Implication:** Visited state differentiation is a known limitation of CSS. Document it, use the best available hue shift, and track the issue for future JS-assisted solutions.

---

### Status colors: separate icon/border colors from text-on-bg colors

The status color palette needs two tiers:
- **Base color** (`--color-status-*`): for icons, borders, indicators — not necessarily AA on white
- **Text color** (`--color-status-*-text`): contrast-validated against the paired status-bg

Success and warning base colors (3.1–3.3:1 on white) are non-text use only. Using them as text on their light backgrounds fails AA. Always use the `-text` variant for text inside status panels and badges.

---

### Dark mode: status backgrounds at identical lightness are indistinguishable

Setting all dark mode status backgrounds to `L=0.20` with only hue variation creates backgrounds that are perceptually near-identical — especially error (red, H=25) and warning (amber, H=53) which are only 28° apart. At low lightness, hue differences collapse.

**The fix:** Differentiate by lightness AND hue. Drop error darker, raise warning lighter, and widen the hue gap. Target deltaE 2000 > 11 between each status background and the page background, and > 11 between each other.

---

### deltaE 2000 is the right measure for background distinguishability

WCAG contrast ratio is luminance-based and useful for text-on-background legibility. For distinguishing two non-text backgrounds from each other, deltaE 2000 is more appropriate — it accounts for hue, chroma, and lightness interactions perceptually. The threshold of deltaE > 11 represents "clearly different" to a typical observer.

`cpqi variants` uses deltaE 2000 internally with a default minimum of 11 — use this as the reference standard for background differentiation throughout the system.

---

## Angular / Implementation

### ViewEncapsulation.None + host class for projected content styling

Angular's emulated encapsulation only adds scoping attributes to a component's own template elements — not to content projected from outside (e.g., string literals in stories, or `<ng-content>` from a parent). Using `::ng-deep` is deprecated and will be removed. The correct pattern is `ViewEncapsulation.None` with the component's SCSS scoped under a host class set via the `host` binding.

---

### em double-scaling in nested code elements

`pre { font-size: 0.875rem }` combined with a global `.article code { font-size: 0.875em }` rule results in code inside pre receiving both — scaling to `0.875em × 14px = ~12px`. Always reset `font-size: 1em` on nested elements inside blocks that set an explicit font size.
