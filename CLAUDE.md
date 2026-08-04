# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Candor is a design system distributed as two layers, both developed in a single Storybook so the same stories validate every layer:

1. **`@candor-design/tokens`** — the CSS custom-property layer (OKLCH colors, spacing, typography). Everything else is built on top of this.
2. **`@candor-design/web-components`** — the primary, canonical consumer-facing component library: 37 Lit 3 custom elements. Framework-agnostic; the WC stories under `Components/`, `Typography/`, `Design Tokens/`, and `Examples/` are the only component surface.

> An Angular standalone-component library (`src/app/`) previously mirrored this API as a feature-parity benchmark. It was **removed in 3.0.0** and was never published as a package. The Storybook toolchain itself ran on `@storybook/angular` (rendering the framework-agnostic web-component stories) until **4.1.0**, when #143 migrated it to `@storybook/web-components-vite` and retired the Angular build harness entirely — `angular.json`, the `src/app/` bootstrap shell, `src/main.ts`, and the `@angular/*`, `zone.js`, and `rxjs` dependencies are all gone. Both the components and the harness are now Angular-free.

The workflow targets AI-assisted design iteration with real-time accessibility validation: receive art-direction specs, implement them in design tokens, validate accessibility using the klar CLI for color contrast, and inspect visually with Playwright MCP. Token changes propagate to the components because they consume the same CSS custom properties.

## Design Philosophy

### Candor is a humanist design system

Candor's typefaces and OKLCH color system model human vision and the humanist typographic tradition. Every element — including technical, data-heavy, or machine-generated content — should feel like a considered, human-authored artifact.

- Clinical harshness is not "appropriate for technical content" — it is a failure of the system's character.
- Maximum contrast is not automatically correct. 19.4:1 white-on-dark is a machine default, not a design decision.
- **Flag proactively:** when implementing components where clinical defaults would be easy (code blocks, tables, form inputs, data displays), name the humanist/legibility tension rather than silently resolving it.

---

## Essential Commands

### Development
```bash
npm run storybook          # Start Storybook on http://localhost:6006 (primary dev environment)
```

### Testing
```bash
npm run test:playwright    # Run all Playwright tests (auto-starts Storybook)
npm run test:playwright:ui # Run Playwright in UI mode
npx playwright show-report # View test results
```

### Building
```bash
npm run audit:tokens       # Re-export audit/tokens.dtcg.json from the SCSS
npm run audit:contrast     # Re-measure every pairing + every recorded OKCA figure (needs klar 3.x)
npm run build:tokens       # Build @candor-design/tokens → tokens/
npm run build:wc           # Build @candor-design/web-components → web-components/dist/
npm run build-storybook    # Build static Storybook
```

### Playwright Browser Setup
```bash
npx playwright install chromium  # Install Chromium browser for tests
```

## Architecture

### Design Token System (Core Concept)

All visual styling flows from design tokens in `src/design-tokens/`:
- **colors.scss**: OKLCH color definitions (not hex/RGB)
- **typography.scss**: Font families, sizes (Major Third 1.25 ratio), weights, line heights
- **spacing.scss**: 8px grid system
- **index.scss**: Aggregates and exports all tokens

**Critical**: Always modify tokens first, never hard-code values in components. Component `static styles` reference tokens as CSS custom properties (`var(--color-...)`), which pierce the Shadow DOM automatically — never redeclare or hard-code token values inside a component.

### OKLCH Color Space

Colors use OKLCH format: `oklch(L C H)` where:
- L = lightness (0-1)
- C = chroma/saturation — **bounded by the sRGB gamut, and the bound moves with L and H**
- H = hue (degrees)

#### The sRGB gamut is an invariant

**Every authored Candor colour must be renderable in sRGB.** sRGB is the baseline gamut for digital products, and Candor is practical accessibility — a colour the delivery target cannot render is not a specification.

OKLCH's chroma axis is unbounded in notation but bounded in reality, and it accepts an out-of-gamut value silently. Such a value is not a specification — it is a request that some other party will resolve. Two consequences:

1. **Candor stops controlling its own colours.** The authored value delegates the final decision to whatever consumes it, and different consumers decide differently. The token is then not one colour but a family of them.
2. **Every contrast figure recorded against it is undefined.** OKCA is established across the sRGB gamut; a colour outside that gamut is outside the algorithm's domain, so a score for it is not a permissive number — it is a meaningless one. This is how five real contrast failures sat inside a passing audit for months (#222).

**Candor does not model, predict, or track how out-of-gamut colours get resolved.** That is an arms race across engines and versions, and it is not one this project enters. The invariant is what makes the question moot: when every authored value is inside sRGB, nothing is left to resolve, and the colour Candor specifies is the colour Candor delivers. Any documentation or tooling here that reasons about substitution behaviour is a bug — the correct response to "what happens when it's out of gamut" is "it isn't."

**Authoring rule.** When a colour needs more saturation than sRGB allows at that lightness, hold L and H and pull chroma down to the boundary — never trade lightness for chroma, because lightness is what carries contrast. **Round chroma inward, never to nearest**: the in-gamut maximum sits exactly *on* the boundary, so 2dp nearest-rounding pushes roughly half of these values straight back out.

Note that the bound moves with **both** L and H: `--azure-400` holds C=0.18 at L=0.65, while the same hue at L=0.53 tops out at 0.15 and at L=0.77 at 0.12. A ramp at constant chroma will leave the gamut at its ends even though its middle is fine.

**The gate.** `npm run audit:tokens` fails if any `oklch()` literal in `src/design-tokens/*.scss` is out of gamut, and prints the in-gamut value to use. It covers every stylesheet in that directory, including ones absent from the DTCG artifact. Check a single colour with `klar contrast <c> "#000" --allow-out-of-gamut --json` → `.gamut.outOfGamut`. **Never use culori's `clampChroma`/`toGamut`** for this — they answer a different question (what to substitute) rather than the only one Candor asks (is this value renderable at all).

**In-gamut is not a ban on wide gamut.** The clean form is sRGB as the authored base value, with any P3 treatment layered additively behind `@media (color-gamut: p3)` — never as the base.


### Component Structure

The component library is the Lit 3 web components in `src/web-components/components/`:
- Each component has a `candor-{name}.ts` (Lit class) + `candor-{name}.stories.ts`. Styles live inside the class via `static styles = css\`...\``.
- Stories use the `@storybook/web-components-vite` `Meta` type and render via lit-html — `render: (args) => html\`…\`` returning custom-element markup (no `template:` strings, no `component:` field).
- Components register themselves on import via `@customElement('candor-{name}')` — pulling `src/web-components/index.ts` is enough to register all 37 tags.
- Shadow DOM by default. CSS custom properties pierce shadow boundaries, so tokens reach inner styles without per-component injection.

**Component categories**:
- `typography/`: heading, text, accessible-text, article
- `button/`: button with variants (primary, secondary, tertiary, ghost)
- `form/`: input, checkbox, radio, switch, slider, select, listbox, combobox, chat-input
- `data/`: table, data-grid, tone-picker
- `overlays/`: modal, drawer, tooltip, toast
- `examples/`: composed stories (color-iterator, settings, article, chat, editor, etc.)

### Storybook Configuration

- Config in `.storybook/main.ts`
- Stories auto-discovered from `src/**/*.stories.ts`
- Accessibility addon enabled (`@storybook/addon-a11y`)
- Runs on port 6006

### Playwright Testing

- Config: `playwright.config.ts`
- Tests in `tests/` directory
- Auto-starts Storybook via webServer config
- Base URL: http://localhost:6006
- Screenshot on failure, trace on first retry

## Design Iteration Workflow

### Typical Session Flow

1. **Receive art direction**: Colors (hex), fonts, spacing requirements
2. **Convert to OKLCH**: Run `klar meta <hex>` on each color to get exact OKLCH values
3. **Update tokens**: Modify `src/design-tokens/semantics.scss` (or `primitives.scss`). After any change, run `npm run audit:tokens` — it gates the sRGB gamut invariant and re-exports the DTCG artifact. If a colour is out of gamut it fails and prints the in-gamut value; take that value before measuring anything, since a figure measured on an unrenderable colour describes a colour nobody sees
4. **Visual check**: Use Playwright MCP to screenshot Storybook stories
5. **Mobile check**: Switch Storybook's viewport toolbar to **mobile1 (320 × 568)** and verify: no horizontal overflow, no clipped interactive elements, no layout broken by a fixed column count
6. **Accessibility validation**: Run `npm run audit:contrast`. It re-measures every pairing in `audit/pairings.json` in both modes against that pairing's `min` (the Candor-policy OKCA floor), and re-measures every OKCA figure recorded in a token comment against the token's current value. For one-off checks outside the audit set, `klar contrast <fg> <bg> -q` still applies.
7. **Iterate**: If violations found, run `klar find <bg> <color> --target 4.5 -q` for compliant alternatives — **gate the capture on the exit code** (`if ADJUSTED=$(klar find …); then … fi`). Exit `1` means no color meets the target on that background, and `$ADJUSTED` then holds the closest *non-compliant* color — an unchecked `$(…)` capture would silently apply a failing value
8. **Report**: Document original specs vs. final implementation, constraints identified

### Audit Artifacts

Two machine-readable files in `audit/` serve as the canonical inputs for contrast audits. Keep them current as tokens and components evolve. `npm run audit:contrast` (`scripts/check-contrast.js`) is what reads them — it re-measures every pairing against its `min`, every OKCA figure recorded in a token comment, and every OKCA figure recorded in story prose, each against the current token values, and prints `UNCHECKED` for anything it can't interpret rather than passing it silently. It exits non-zero on any enforced failure, so it currently fails on the one remaining exception tracked in #208; it is deliberately **not** wired into CI until that lands.

The two audits split by what they own: **`audit:tokens` owns gamut, `audit:contrast` owns contrast.** Gamut is a property of a token, so it is gated at export where every declaration is visible; contrast is a property of a pairing, so it is checked against `pairings.json`, which only ever contains colours someone remembered to add. Run `audit:tokens` first — it is the precondition that makes `audit:contrast`'s numbers mean anything.

**`audit:tokens` runs in CI** (the `gamut` job), so the sRGB invariant is enforced on every PR rather than depending on someone remembering. That job also re-exports the artifact and fails if it differs from the committed one, catching a token change that was never re-exported. `audit:contrast` is not in CI yet for the reason above.

**What is and is not guaranteed.** Only executable gates guarantee anything; prose and linked references do not. Currently gated: sRGB gamut (CI), stale figures in `semantics.scss` comments, stale figures in story prose, pairings below their floor, a pairing's `min` disagreeing with its `tier` (on the 14px row — see the `tier` field below for why only there), sub-14px text without a declared reason, and klar's major version — that last one is a deliberate hard stop, since it is the only mechanism that forces klar's docs to be re-read on an upgrade. **Not** gated, and therefore only as reliable as the reader: OKCA figures in `primitives.scss` comments (primitives are absent from the DTCG artifact, so nothing checks them), font sizes written in **relative units** (`0.9em` can't be resolved statically — the text-size gate reads absolute units only, and says so at the top of its section), and every judgment-level rule in this file. Treat an ungated convention as a convention.

**Recording a figure in a story (#223).** Story prose is now in the audit's scope, but only when the sentence says which colour it is about — a token comment gets that free from its declaration and prose does not. Write `OKCA <n> on <bg>` with a `--custom-property` or a `#rrggbb` literal somewhere to its **left** on the same line; the nearest one wins, which is what lets one line carry two claims. `<bg>` must be a name the audit knows (`page`, `bg-surface`, `white`, `bg-inverse`, `error-bg`, …), optionally mode-prefixed (`on dark page`); light is assumed. A figure the parser cannot anchor or whose background it cannot resolve is reported as `UNCHECKED`, not passed. Stating a *threshold* rather than a measurement — `OKCA 4.5 bold threshold`, `… floor` — is recognised and excluded, so tier tables need no special handling.

**Do not record a token's *value* in a story.** A figure is an argument and has to be written down; a value is a fact the artifact already holds. Stories that display token colours import `requireTokenValue` from `src/web-components/design-tokens/token-values.ts`, which reads `audit/tokens.dtcg.json` — so the swatch cannot disagree with the stylesheet, and a renamed token throws at build time instead of rendering a blank. Copying `oklch(…)` into a story is how the data-grid demo spent months painting a colour the system had stopped using, under that colour's token name, with nothing to catch it.

**A brand hex and the token derived from it are different colours.** Converting hex → OKLCH rounds, so their OKCA scores can differ by a tenth (`#082840` is 14.0 on white; `--color-action-primary` is 13.9). Both figures are correct about their own colour. Do not "reconcile" them — that necessarily makes one wrong, which is a mistake this repo has already made once.

Recorded figures are re-baselined to klar 3.0. Any figure you add must be measured with klar 3.x — prefer `npm run audit:contrast` over a bare `klar contrast`, since it measures exactly as the audit does. A number carried over from an older tool or an older note will be wrong twice over: 2.0.0 recalibrated OKCA (+0.4 in the 3–7 band), and 3.0.0 both scored at full precision (±0.1) and stopped silently substituting a different colour for out-of-gamut input.

**`audit/tokens.dtcg.json`** — auto-generated, do not edit by hand.
- Produced by `npm run audit:tokens` (runs `scripts/export-tokens-dtcg.js`).
- Contains all `--color-*` tokens with resolved `oklch()` values in W3C DTCG format, split into `light` and `dark` mode objects.
- `$extensions.usage: "non-text"` marks the tokens that must NOT be used as CSS `color:` values for text. It is derived **structurally** from what the token is, not from its prose (#218): a name containing `border`, or the existence of a `<name>-text` sibling (the system having minted a `-text` variant *is* the statement that the base is not for text), plus a short named-role list in the script for `focus` / `slider-thumb` / `highlight-decorative`. 16 of 55 tokens qualify. The export **fails** if a comment claims non-text use for a token no rule catches, so prose and rules cannot drift apart silently.
- `$description` captures a comment **above** the declaration as well as one trailing it. Several of the longest annotations sit above, and trailing-only capture was dropping 21 of 55 light tokens' descriptions — including every form-control border, which is why `--color-border-control`'s dark behaviour read as an unexplained oversight from the artifact alone (#217).
- Re-run whenever any file in `src/design-tokens/` changes.
- **The same command enforces the sRGB gamut invariant** and exits 1 with the in-gamut value to use. It scans every `.scss` in `src/design-tokens/` — a wider set than it exports from, so `syntax.scss` is covered even though its tokens are not in the artifact. `--skip-gamut` bypasses it (klar not installed); nothing in the repo passes that flag.

**`audit/pairings.json`** — hand-authored, update alongside component changes.
- 108 foreground/background pairings, each measured in both modes (216 measurements). Per-component coverage is not derivable from the entry ids — form controls share `form-*` prefixes — so treat "every component is covered" as unverified until #197 settles how coverage is counted.
- Each entry: `{ id, fg, bg, size, weight, tier, min }` using DTCG token references (`{color.status.error-text}`) and an explicit pixel size and weight. An optional `exempt` field (see below) marks pairings that carry no enforced floor.
- **`tier`** — `1`, `2`, `3`, or `"non-text"`. Required. `min` is now *derived* from `tier` + `size` + `weight` and the audit fails when the two disagree, which converts `min` from a hand-typed number into a cross-checked one (#213). `"non-text"` is not a text tier: it carries WCAG 1.4.11's 3.0 for icons and indicators, and exists because six icon pairings had a `min` no text tier could produce.

  **Its teeth are limited to the 14px row, and that is not a defect.** At 16px and above every tier collapses to one floor, and at 14px bold Tiers 2 and 3 are both 4.5 — so a wrong tier is invisible there. That is the same row where the tier axis is the only thing that changes the answer, so the check has teeth exactly where the classification matters.

  **There is deliberately no `redundant-channel` field.** It was the obvious companion and it would make things worse: a channel name is a human claim that nothing can verify, so a populated column would read as validated when it means only that someone typed something — and a half-filled one is a false-negative generator. `tier` is safe to record for the opposite reason: it is checkable against `min`, so a wrong value surfaces. Backfilling all 114 tiers found exactly two disagreements, both on `exempt` entries whose `min` was already wrong. Put channel reasoning in `note`, where it does not look machine-checked.
- `min` is the Candor-policy OKCA floor for that specific pairing — it encodes the tier table from the "OKCA Contrast Thresholds" section above. It is **not** a klar/OKCA standard; it belongs to this design system.
- **`exempt`** (optional string) — present only on pairings that are deliberately **not** held to their `min`. The value names *why*: `wcag-1.4.3` for text inside inactive/disabled components (SC 1.4.3 exempts them from contrast), `candor-supplementary` for transient/redundant text that is never the sole channel for meaning (e.g. input placeholders). When `exempt` is present, **skip the klar-vs-`min` check** — `min` then documents only the tier the pairing *would* fall under if it were active/primary content. Exempting text is legitimate only when the meaning survives elsewhere (a disabled control's required hint, a field's real label); see the disabled-label convention under "Common Pitfalls → Form authoring."
- When you change a color token: run `npm run audit:contrast` — it re-validates every affected pairing without you having to find them.
- When you add a new component: add entries for every unique `color:` declaration in the component's CSS, following the tier classification rules above. Set `tier` explicitly and let the audit tell you whether the `min` you chose agrees with it — if they disagree, one of the two is a misclassification, and deciding which is the point of the exercise.
- When you add a new semantic token or rename one: update both `tokens.dtcg.json` (re-run the script) and any pairings that reference the old token name.

### Integration Points

**klar CLI** — requires **3.x** (`klar --version`). Every contrast figure recorded in this repo assumes it. On 2.x the numbers in `audit/` and the tier tables are wrong: 2.x scored through an 8-bit hex round-trip *and* silently substituted a different color for any out-of-gamut input, reporting a figure for a color nobody had asked about. Under the sRGB invariant (#225) that substitution can no longer arise, but the precision difference still makes 2.x figures wrong.
All klar commands accept both `<hex>` and `oklch(L C H)` CSS color strings as inputs — pass OKLCH values directly without converting to hex first.

```bash
klar meta <color>                                    # Inspect a color: OKLCH axes, saturation, gamut
klar contrast <fg> <bg> -q                           # Check contrast ratio (OKCA, WCAG-compatible)
klar contrast <fg> <bg> --type deltaE -q             # Perceptual drift between two colors
klar contrast <fg> <bg> --type wcag2 -q              # WCAG 2.x ratio (cross-check against the legacy algorithm)
klar contrast <c> "#000" --allow-out-of-gamut --json # Is this color renderable in sRGB? → .gamut.outOfGamut
klar find <bg> <color> --target 4.5 -q               # Lightness-adjusted compliant color (exit 1 = unachievable; still prints closest)
klar find <bg> <color> --target 4.5 --json           # Same, with .reason / .resolvableBy / .deltaE — branch on .reason, never on prose
klar variants <color>                                # Perceptually-spaced tonal grid (adaptive; --min-delta default 11)
klar match <color1> <color2>                         # Match chroma of two colors — REBUILDS one of them, read .colors
klar lightness <color>                               # Min/max lightness range in sRGB (exit 1 = chroma renderable at no lightness)
klar pair                                            # Random accessible color pair (seed for exploration)
klar plugins list                                    # List installed contrast algorithm plugins
```

Flags worth knowing that aren't in the one-liners above: `find` takes `--tolerance <n>` (default `0.5`, the acceptable overshoot above target) and `--allow-desaturation` (off by default — `find` moves **lightness only** unless you pass it). `variants` has a fixed-step mode via `--light-steps`/`--chroma-steps`, which emits `"color": ""` for out-of-gamut cells and has no `-q`; filter those out before iterating. `--no-plugins` is global. Verified here that installed plugins do **not** alter a default `okca` result, so the audit does not need it.

**klar key rules:**
- **OKCA is the default** — WCAG 2.x-compatible ratio, no `--type` flag needed
- **OKCA is polarity-aware** — argument order matters: `klar contrast <foreground> <background>`. Light-on-dark caps at **20.9**; dark-on-light at **20**; the same chromatic pair returns different numbers when swapped. Never reuse a reversed measurement
- **deltaE is the art director's metric** — answers "did it change much?"; < 3 imperceptible, 5–10 acceptable drift, 11+ clearly different
- **Built-in `--type` values**: `okca` (default), `wcag2`, `deltaE`. Any other `--type` comes from a plugin installed in the environment — plugins are independent of klar-cli and not guaranteed present. Run `klar plugins list` to see what's registered.
- **Gate `find`/`match` captures on the exit code** — grep-style contract: `0` success, `1` soft failure (`find` target unachievable / `match` infeasible — the closest value is *still printed to stdout*), `2` usage error. An unchecked `ADJUSTED=$(klar find …)` silently assigns a non-compliant color on exit `1`. Use `if ADJUSTED=$(klar find <bg> <color> --target 4.5 -q); then …; else handle_no_compliant_color; fi`. On exit 1, read `.reason` from `--json` (`lightness-exhausted` / `unreachable` / `chroma-exhausted`) rather than the printed message — `lightness-exhausted` means the fix requires giving up chroma, which is a brand decision, and `.resolvableBy` quotes what that would cost
- **`klar match` does not preserve its first argument.** It rebuilds whichever of the two can adopt the other's chroma inside sRGB, so the "reference" may be the one that moved. Read `.colors` from `--json` instead of assuming, and re-measure contrast afterward — a pair that just cleared 4.5 can drop below it once chromas are aligned
- **`contrast` exits 1 on out-of-gamut input**, printing the value anyway. Same gating discipline applies, and note `execSync` in Node *throws* — the value is stranded in `err.stdout`. Pass `--allow-out-of-gamut` when you have already decided to accept it.
- **Don't pass `--allow-out-of-gamut` when measuring a Candor token.** klar exits 1 on out-of-gamut input; let it. That exit is the correct outcome — OKCA is not defined there, so the right response is to fix the token, not to coax a number out of the tool. `--allow-out-of-gamut` remains correct for the one-line gamut *check*, where reading the verdict is the whole point.
- **`--gamut-map` is pinned in `check-contrast.js` for reproducibility, not policy.** klar reads a `KLAR_GAMUT_MAP` environment variable that changes the mapping process-wide, so an *unpinned* command produces different figures on a machine that has it set — verified here: the same out-of-gamut colour scores 6.6 under the `css` default and 4.3 under `KLAR_GAMUT_MAP=clip`. An explicit flag beats the variable (verified), which is what makes the audit environment-independent. Note the variable does **not** waive the exit-1 failure (also verified), so it cannot be used to sneak an out-of-gamut colour past the audit. As for *which* value: it can't matter for Candor colours — under the invariant `clip` and `css` return identical values on all 216 audited measurements, so a figure that ever changes between them is a gamut bug, not a measurement choice.
- **Never use culori for gamut work** despite it being a dependency: `clampChroma`/`toGamut` answer "what should this color be replaced with", which Candor deliberately has no opinion on. The only question here is the boolean "is this value renderable at all" — `klar contrast <c> "#000" --allow-out-of-gamut --json` → `.gamut.outOfGamut`.

See the klar [README](https://github.com/pawn002/klar/blob/main/README.md) for the full [command reference](https://github.com/pawn002/klar/blob/main/README.md#command-reference) and [exit-code contract](https://github.com/pawn002/klar/blob/main/README.md#exit-codes). [`AGENT_PLAYBOOK.md`](https://github.com/pawn002/klar/blob/main/AGENT_PLAYBOOK.md) in the same repo has worked examples of the palette-building and audit workflows.

**When Playwright MCP is connected**:
- Navigate to stories: `browser_navigate`
- Screenshot components: `browser_take_screenshot`
- Test interactions: `browser_click`, `browser_type`, `browser_press_key`

**AT snapshot workflow** (for accessibility audits):
1. Navigate to the story iframe directly: `http://localhost:6006/iframe.html?id={story-id}&viewMode=story`
   - Story ID format: `{title-path-kebab}--{story-name-kebab}` (e.g. `components-form-switch--default`)
2. Call `browser_wait_for time:2` — snapshot on first navigation is empty without this wait
3. Call `browser_snapshot` to get the accessibility tree
4. For ARIA attributes not shown in the snapshot (e.g. `aria-valuetext` on sliders), verify with `browser_evaluate`: `document.querySelector('input[type=range]').getAttribute('aria-valuetext')`

## Typography Usage Rules

### Roboto Flex (`--font-family-display`, `--font-family-base`)

Roboto Flex is a **variable font** with axes beyond `font-weight`:
- `opsz` (optical size): stroke weight adapts to text size — larger text gets heavier strokes naturally
- `GRAD` (grade): subtle weight adjustment without changing letterform width
- `wdth` (width): condensed to expanded

**Before adjusting `font-weight` for hierarchy, ask whether the variable axes can do it better:**
- `font-optical-sizing: auto` — browser automatically maps `opsz` to computed font size, creating a natural optical weight gradient across heading levels. Use this on all heading contexts.
- `font-variation-settings: 'GRAD' -50` — fine-tune apparent weight for a specific element without touching the weight axis

**The trap:** Reaching for `font-weight: semibold` feels natural but produces an artificial numeric step. The `opsz` axis creates hierarchy that feels designed, not engineered.

See `docs/LESSONS-LEARNED.md` for the full rationale.

### Atkinson Hyperlegible (`--font-family-accessible`)

Atkinson is the designated typeface for **instructional UI text** — text the user must read precisely to know what to do next.

#### Instruction vs. comprehension — the core authoring decision

The question is not "is this text important?" All text in a well-designed UI is important. The question is: **does the user need to read this precisely to know what to do next?**

- **Use Atkinson (`candor-accessible-text`)** for instructional text: form field labels, validation errors, status changes, action-required hints. The user must read these correctly to take the right action.
- **Use Roboto Flex (`--font-family-base`)** for comprehension text: data values, classification results, section headings that organise data, body prose. The user reads these to form a judgment, not to follow an instruction.

**Examples of the distinction:**
```html
<!-- ✓ Instructional — user must read this to know what to fix -->
<candor-accessible-text role_="status" color="error">Enter a valid National Insurance number.</candor-accessible-text>

<!-- ✗ Not instructional — user reads this to understand data -->
<candor-accessible-text role_="annotation">87% confidence</candor-accessible-text>
<!-- ✓ Correct for comprehension data -->
<span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">87%</span>
```

**Section headings that label data** (e.g. "Classification breakdown") are comprehension text — they organise data, they don't instruct. Use `<candor-text variant="label">` (Roboto Flex uppercase) not `<candor-accessible-text role_="label">`.

#### The five roles

| Role | Use case | Size | Weight | Style | Tier |
|---|---|---|---|---|---|
| `label` | Form field labels, structural anchors in instructional contexts | 14px | bold | uppercase | 2 |
| `message` | System messages, body-length guidance the user must act on | 16px | regular | — | 1 |
| `status` | Validation errors and action-required text — what the user must **do next** | **16px** | regular | — | 1 |
| `state` | Outcomes that have **already happened** — renders a tone icon | 14px | regular | — | 3 |
| `annotation` | Hints, constraints, legal small print that guide an action | 14px | regular | italic | 3 |

The Tier column is not decoration — it determines the size. Tier 1 regular text is required to be ≥ 16px, so `message` and `status` sit there; `label`, `state` and `annotation` stay at 14px because Tier 2-bold and Tier 3 have floors 14px can actually meet.

**`status` vs `state` — the distinction that decides the size.** `status` is Tier 1 because the text is the *sole* channel for an instruction: an icon beside "Enter a valid National Insurance number" says something is wrong, but not which field or what format, so no redundant channel makes 14px sufficient. `state` is Tier 3 because the component renders an `aria-hidden` tone icon that genuinely carries the outcome — lose the text and you still know it succeeded.

The test: **could a reader who cannot resolve the glyphs still act correctly?** Yes → `state`. No → `status`.

`status` was 14px until #208, which made it the one role whose mandated size made its mandated floor unsatisfiable for the colour it most often carries.

**Do not hand-type a status glyph into the content** — `✕ Error: …`, `✓ Done`. A screen reader announces the character ("multiplication sign"), and it is invisible to the contrast audit. Carry the state in words, and use `role_="state"` when an icon is wanted: it renders an `aria-hidden` one, and colours it from the `--color-status-*` non-text tokens while the text stays `--color-text-default`. Moving the colour onto the icon is what removes the contrast constraint rather than negotiating with it — see "Contrast is bought with chroma" below.

**Counters and data readouts are not `status`.** "14 of 47 reviewed" is comprehension text — the user reads it to form a judgment, not to follow an instruction — so it belongs in `candor-text` (Roboto Flex), per the instruction-vs-comprehension rule above.

#### Label casing

Form field labels and structural UI anchors are both "labels" but follow different casing rules:

| Context | Casing | Example |
|---|---|---|
| Form field label (`<label>` inside form components) | Sentence case | "Birth month", "Email address" |
| Structural UI anchor (`candor-accessible-text role_="label"`) | Uppercase (via CSS) | "PAGE BACKGROUND", "SURFACE BACKGROUND" |

**The test:** does the user fill it in? → sentence case. Does it label a region or column of the UI? → uppercase Atkinson anchor.

#### Bold weight rules

- **Use bold only for hierarchy/labeling** — `role_="label"` renders bold automatically
- **Do NOT use bold for urgency** — error messages and status text use regular weight; the error color carries urgency. Bold on top of error color is double-emphasis and disrupts hierarchy
- The `bold` attribute exists for intentional overrides but should rarely be needed outside of `role_="label"` contexts

```html
<!-- ✓ Regular for status — color carries urgency -->
<candor-accessible-text role_="status" color="error">Enter a valid number.</candor-accessible-text>

<!-- ✗ Wrong — bold + error color is double-emphasis -->
<candor-accessible-text role_="status" color="error" bold>Enter a valid number.</candor-accessible-text>
```

### Atkinson Tracking

Atkinson Hyperlegible requires positive letter-spacing to prevent glyph clustering (adjacent glyphs like "rr" reading as "m"). Apply `letter-spacing` based on context:

| Context | Value | Reason |
|---|---|---|
| Badges, chips, breadcrumbs | `0.04em`–`0.06em` | UI signal — elevated tracking marks the element as a label or interactive UI unit |
| Body roles (message, status, annotation) | `0.02em` | Prose-like — should blend with surrounding text, not read as a UI label |
| Labels (uppercase) | `var(--letter-spacing-wide)` = `0.05em` | Uppercase already benefits from tracking |

**The underlying principle:** tracking is a UI signal, not just a legibility fix. Elevated tracking (0.04em–0.06em) tells the reader "this is a UI element." Annotation prose (disclaimers, footnotes, hints) intentionally stays at `0.02em` even at 14px — it should feel like a paragraph, not a label. Applying badge-level tracking to a footnote would make it read as a structural element when it isn't.

**Never use `letter-spacing: 0` or `--letter-spacing-normal` with Atkinson** — always apply positive tracking.

### candor-article: font and justify attributes

`<candor-article>` is the long-form prose component. Its two attributes:

- **`font="serif"` (default)** — Noto Serif. For human-authored or AI-generated articles, reports, editorial content, and deliberation summaries. Same font for both human and AI prose — the serif register signals "produced artifact, read carefully."
- **`font="sans"`** — Noto Sans. For UI paragraphs that require sentence-by-sentence reading but aren't authored content: help documentation, onboarding, release notes.
- **`justify`** — Full justification + hyphenation for `<p>` elements. **Required for AI-generated prose.** See below.

#### The `justify` attribute — AI transparency feature

```html
<candor-article font="serif" justify lang="en">
  <p>AI-generated content here.</p>
</candor-article>
```

Full justification creates clean block edges — a typographic register associated with formal produced documents. Human-authored prose has a natural ragged right edge. This visual distinction allows readers to identify AI output **immediately and without labels** in critical workflows.

This is a **systems transparency feature**, not a stylistic preference. In high-stakes contexts (planning decisions, medical summaries, legal briefs), users must never have to read carefully to determine whether content was produced by a human or a model. The typographic register makes the distinction automatic and ambient. It also aligns with the spirit of EU AI Act Article 52 disclosure requirements — a persistent designed-in transparency mechanism rather than a pop-up checkbox.

**The formal register does not make AI feel cold.** Content tone is a separate axis from typographic register. AI output can be written warmly; the justification signals origin, not personality.

**Requirements:** Always set `lang="en"` (or the appropriate BCP 47 tag) on the element or an ancestor — `hyphens: auto` requires this to look up hyphenation dictionaries. Justification applies to `<p>` only; headings remain left-aligned.

### Text Size Floor

No readable text in the system falls below **14px** (`--font-size-sm` = `0.875rem`). `--text-xs` (12px) is for decorative/non-text use only (icon glyphs, badge chrome).

**This is gated, and the gate is in `audit:contrast` rather than a typography check — because the floor is a contrast rule wearing typography clothes.** 12px is classified decorative in *both* axes of the tier table, so no OKCA floor is defined for it, so `pairings.json` holds zero size-12 entries. Setting `--font-size-xs` on text therefore removed that text from the contrast audit entirely, with nothing recording that it had happened — the #218 shape again, and the direct reason #229 went unnoticed. The check reports the audit's own blind spot (#230).

Any sub-14px `font-size` in `src/` fails the audit unless it carries a marker naming a reason the audit recognises:

```css
/* 12px-ok: badge-chrome — initials in an avatar disc, not text to read. */
font-size: var(--font-size-xs);
```

Recognised reasons are `badge-chrome` and `icon`, and free text is rejected — an unrecognised reason fails exactly like a missing one. This is an author assertion, the same shape as `exempt` in `pairings.json`, because chrome cannot be told from content by looking at CSS. The marker may sit on the declaration or up to three lines above it. Absolute literals (`font-size: 0.75rem`) are caught as well as the token, so hard-coding is not a way around it.

**`candor-text` has no `xs` size** (removed in 5.0.0). A component whose purpose is readable text should not offer a size at which text is not permitted; the story demonstrating `xs` was rendering a full sentence at 12px to explain that 12px is not for sentences. Reach for the token directly when you genuinely need chrome.

### OKCA Contrast Thresholds — Two Axes

Contrast requirements have **two axes**: font size and use-case tier. **Never apply a single threshold to all 14px text.**

**Size axis (Tier 1 baseline):**

| Size | Regular | Bold |
|---|---|---|
| ≥ 24px | 3.0 | 3.0 |
| 19–23px | 4.5 | 3.0 |
| 16–18px (`--font-size-md`) | 4.5 | 4.5 |
| **14px (`--font-size-sm`)** | **9.5** *(Tier 1 regular not permitted — see below)* | **6.5** |
| 12px (`--font-size-xs`) | decorative only | decorative only |

The 14px regular figure is retained as the *size-axis* baseline because it is what a neutral-coloured reading passage would need at that size. No Candor component may rely on it: Tier 1 regular text is required to be ≥ 16px, and Tiers 2 and 3 carry their own lower floors. It is the reason 14px regular reading text is disallowed, not a target to build against.

**Use-case tier axis — a 14px-only adjustment.** Be precise about what this axis is: it modifies the 14px row and nothing else. At 16px and above, every tier carries the same floor, because the size axis has already done the work. Do not read the tier table as a general second dimension — `pairings.json` has exactly two distinct floors above 14px (3 and 4.5), both from the size axis.

| Tier | Perceptual task | 14px regular | 14px bold | Candor components |
|---|---|---|---|---|
| **1 — Reading** | Sequential decoding — must read to act | **not permitted at 14px** | **6.5** | Alert body, toast message, modal prose, form error messages, article body |
| **2 — Functional UI** | Recognition — sole channel for meaning | **6.5** | **4.5** | Pagination numbers and position readouts, breadcrumb links, table cell data, chip labels, button labels |
| **3 — Supplementary** | Pattern match — meaning redundantly coded | **4.5** | **4.5** | Badge text, hint text, figcaptions, stat labels, table metadata, breadcrumb separators, pagination ellipsis, accordion quiet headings (wght 500 — structural nesting is the redundant channel) |

#### Tier 1 regular text must be ≥ 16px

This replaces the former 9.5 floor at 14px, which was **unreachable by any coloured text in the system** and so functioned as an unintended ban on chromatic must-read text (#240). Measured against white, every chromatic text token returns `lightness-exhausted` at that target — there is no lightness at that hue and chroma reaching 9.5 inside sRGB:

| token | measures | to reach 9.5 |
|---|---|---|
| `--color-status-error-text` | 6.4 | chroma 0.18 → 0.146, deltaE 8 |
| `--color-status-warning-text` | 8.1 | chroma 0.10 → 0.092, deltaE 3 |
| `--color-status-success-text` | 6.1 | chroma 0.14 → 0.116, deltaE 9 |
| `--color-link` | 5.3 | chroma 0.14 → 0.104, deltaE 12 |

The floor did not ask coloured text to be darker; it asked it to stop being coloured. Only near-neutral text could satisfy it (`--color-text-default` is 11.5).

Stated as a size requirement it becomes actionable and self-consistent: **a Tier 1 element at 14px is a sizing bug, and the fix is the size.** At 16px the floor is 4.5 and every status colour clears it with margin. The system already worked this way in practice — `candor-input` renders its validation errors at 16px (`form-error-message`, floor 4.5, measures 6.4 ✅) while the generic `candor-accessible-text role_="status"` rendered identical content at 14px and could not pass (#208).

Tier 1 **bold** at 14px keeps its 6.5 floor: bold is a genuine perceptual compensation, and 6.5 is reachable by chromatic text.

#### Contrast is bought with chroma — a floor is a saturation budget

The reason a floor can be unreachable is geometric, and it is worth understanding before setting any threshold.

On a light background, more contrast means lower lightness. The sRGB gamut narrows as it descends toward black, so the chroma available falls with it. **Contrast and saturation are therefore not independent axes**: past a hue's ceiling, every increment of contrast is paid for in colour, and the limit of that trade is pure black — OKCA 20, chroma exactly 0.

Maximum OKCA on white at each chroma, measured at the darkest lightness sRGB permits for that chroma (`*` marks the chroma the token is authored at):

| hue | C=0.18 | C=0.14 | C=0.10 | C=0.06 | C=0.03 | C=0 |
|---|---|---|---|---|---|---|
| error (red, H 25) | **6.6\*** | 10.3 | 15.0 | 18.7 | 20.0 | 20 |
| warning (amber, H 53.5) | 1.9 | 3.9 | **8.2\*** | 15.4 | 19.3 | 20 |
| success (green, H 144.2) | 3.8 | **6.9\*** | 11.9 | 17.5 | 20.0 | 20 |
| link (blue, H 250.8) | 2.9 | **5.4\*** | 10.3 | 16.7 | 19.5 | 20 |

Three consequences for anyone setting or meeting a threshold:

1. **A contrast floor is a saturation budget.** Requiring 9.5 does not only say "make it darker" — it says "spend most of your chroma." Read the row before choosing a number.

2. **The same floor is a different demand at every hue.** At C=0.18 red reaches 6.6 while amber reaches 1.9, because the gamut is far larger in red at low lightness. A uniform floor silently taxes yellows and oranges hardest — which is why `--color-status-warning-text` is authored at C=0.10 while `--color-status-error-text` sits at 0.18. That was discovered by hitting the boundary, not by choice.

3. **Past roughly OKCA 15 the text is achromatic in practice.** Chroma is under 0.06 there, which at those lightnesses reads as black with a cast rather than as a colour.

This is the quantitative form of the design philosophy at the top of this file. "Maximum contrast is not automatically correct" is not only an aesthetic claim: at OKCA 20 the chroma is exactly zero, so maximum contrast is not a strict colour decision but the absence of one. A number chosen without reading the table above may be deleting the colour system rather than validating it.

**Authoring rule when a floor cannot be met.** Ask first whether the text should be coloured at all.

- **The colour carries meaning** (status, link affordance) → keep the colour and change the *size*. This is the Tier 1 rule above.
- **The colour is decorative** → drop to `--color-text-default` and the contrast is free.

Desaturating a semantic colour to buy contrast is the option to reach for last: it keeps the number and discards the thing the number was protecting. If it is genuinely the right call, it is a brand decision, and `klar find --json` reports its exact cost in `.resolvableBy` — take that to the decision rather than nudging chroma until the audit passes.

The same geometry applies inverted on dark backgrounds: contrast there means *higher* lightness, the gamut narrows toward white, and the limit is pure white. Light-on-dark caps at 20.9 rather than 20, but the trade is identical.

#### The corollary for tinted backgrounds: a pale tint may not be a colour at all

The same narrowing that limits dark text limits *pale* fills, and there it has a consequence the contrast floors never see, because nothing in this file measures whether two variants of a component look different from each other.

Candor's status background tokens sit at L 0.95. The maximum chroma sRGB permits there is strongly hue-dependent — measured with `klar lightness`, reading off the highest chroma whose max lightness still reaches 0.95:

| hue | max chroma at L 0.95 | authored |
|---|---|---|
| error (red, H 25) | ~0.02 | 0.02 |
| warning (amber, H 53) | ~0.02 | 0.02 |
| success (green, H 145) | >0.05 | 0.05 |

Red and amber are pinned to near-white; green has room. The result is that **`--color-status-error-bg` and `--color-status-warning-bg` are deltaE 4 apart in normal vision** — at the edge of imperceptible, and closer than Candor's own "acceptable drift" band starts. Not a CVD edge case: nobody can reliably tell them apart.

Two things follow:

1. **It cannot be fixed by adding chroma.** There is none to add at that lightness and hue. Making those two tints distinguishable means lowering their lightness, which is a different design (tinted fills become mid-tones) and a change to every pairing measured against them.
2. **Therefore a pale tinted background is not a variant channel**, and a component must not be credited with one for having it. `candor-badge` was: its recorded justification claimed "badge shape always provides redundant coding", which is true of *badge vs. surrounding text* and false of *error badge vs. warning badge* — two different jobs, conflated in one note (#214).

Worth noting **this got worse in #225 and nobody measured it**: error-bg was authored at C 0.05, out of gamut at L 0.95, and pulling it to the boundary halved the separation from deltaE 8 to 4. The re-authoring was correct — the old value never named a deliverable colour — but "every pairing was re-measured and nothing regressed" was a statement about *contrast*, and this is not a contrast property. It is the same lesson as the rest of this release: a guard reports what it measures, and silence outside its scope is not a pass.

**Key audit rules:**
- `--color-text-subtle` (OKCA 5.0 on page) passes Tier 2 bold and Tier 3 at any weight — **do not "fix" these**.
- Tier 2 regular (6.5) is the threshold where text-subtle fails — the fix is **bold weight (wght ≥ 700)**, not a color change or size bump.
- **Tier 1 regular at 14px is not a contrast failure to fix with colour — it is a size to change.** Bump to 16px.
- Tier 3 requires a **redundant non-color channel** (shape, icon, spatial position). The channel must be **non-optional** — something the reader cannot end up without. There are two ways to achieve that, and only the first was recognised until #214:
  - **The component renders it.** `candor-alert`, `candor-toast` and `candor-accessible-text role_="state"` each assign a distinct icon *shape* per variant, with no way to turn it off.
  - **The component cannot render without it.** A text-bearing component whose label states the condition — a badge reading "Overdue", "Failed", "Active" — carries the meaning in text that is structurally mandatory, since a badge with no content is not a badge. This is not a consumer opt-in in the sense the rule was written to forbid; the consumer chooses the words, not whether there are any.

  **The precondition, which is what makes this a real distinction rather than a loophole:** the label must *name the condition*, not merely be present. `<candor-badge variant="error">3</candor-badge>` has no channel — "3" says nothing about being an error, so colour is carrying it alone. `<candor-badge variant="error">3 failed</candor-badge>` does. Candor cannot enforce this, so it is a documented authoring rule, taught by worked example in the badge story rather than only asserted here.

  What does **not** count: variant differentiation carried by colour alone. `candor-stat` is the case — `.stat__value` is a number and the label names what is measured, not whether the value is good. "847 ms" in amber and "847 ms" in green differ only in hue. Stat's `<slot>` is where the channel goes; `<candor-accessible-text role_="state" tone="warning">` is the intended occupant, since its icon is component-rendered and therefore non-optional.
- **Classify by what the text does, not by which component renders it.** A validation error is Tier 1 whether it comes from `candor-input`'s built-in slot or from a hand-placed `candor-accessible-text`. Two pairings with the same fg, bg, size and purpose must carry the same floor; where they differ, one of them is misclassified.
- **Variable font weight axis**: "bold" means `wght ≥ 700`. Non-`wght` axes — `GRAD`, `opsz`, `wdth` — affect perceived stroke weight visually but do not change the compliance column. A component at `font-weight: 500` with `GRAD: -150` is regular for compliance purposes regardless of visual appearance.

## Responsive Layout Patterns

### Two-column grid

Never use `grid-template-columns: 1fr 1fr` — it forces two columns even when the container is too narrow. Use the intrinsic grid idiom instead:

```css
/* Two columns that stack gracefully at narrow viewports — no media query needed */
grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
```

`min(100%, 240px)` prevents any column from exceeding the container width, so the grid degrades to single-column at small sizes automatically.

### Flex children containing long text

Flex children have `min-width: auto` by default, which prevents them from shrinking below their intrinsic content width. This causes text containing long unbreakable tokens (email addresses, URLs, IDs) to overflow the container. Fix:

```css
/* Allow a flex child to shrink below its content width */
.text-container {
  min-width: 0;
  overflow-wrap: break-word;
}
```

Apply whenever a flex child holds user-supplied content that may include long unbreakable strings.

## File Modifications Guidelines

### Modifying Design Tokens

**colors.scss**:
```scss
$color-primary: oklch(0.55 0.18 250); // Always use OKLCH format — and always in sRGB gamut
```

After changing any colour, run `npm run audit:tokens` (gamut gate + DTCG re-export) then `npm run audit:contrast` (re-measures every affected pairing and every recorded figure). The gamut gate runs first for a reason: a contrast figure measured on an out-of-gamut colour is meaningless, so gamut must be settled before contrast is worth checking.

**typography.scss**:
- Base size: `$font-size-md: 1rem` (16px)
- Scale follows Major Third ratio (1.25)
- Font stacks use system fallbacks

**spacing.scss**:
- All values are multiples of 8px
- Use `rem` units for scalability

### Creating New Components

1. Create a Lit element in `src/web-components/components/<category>/candor-<name>.ts` — extend `LitElement`, register with `@customElement('candor-<name>')`
2. Put scoped CSS in `static styles = css\`...\``; reference tokens as `var(--...)` custom properties — never redeclare or hard-code token values
3. Create `candor-<name>.stories.ts` showcasing all variants, including a `Default` story
4. Re-export from `src/web-components/index.ts` so the `@customElement()` side effect registers the tag
5. Add entries to `audit/pairings.json` for every unique `color:` declaration in the component — one entry per distinct fg/bg pairing. Classify each by tier (see "OKCA Contrast Thresholds") to determine the correct `min` value. If the component needs a colour the system doesn't have, add it as a **token** rather than a literal in `static styles` — a literal in a component is invisible to both the gamut gate and the contrast audit.
6. Expose consumer style hooks per the "Consumer style hooks (`::part` + custom properties)" convention below — a `part` on each meaningful internal, and `--candor-<name>-<knob>` custom properties (token-defaulted) for the bounded density/shape knobs. Document them in the component's story and the Introduction "Styling & overriding" table.

See "Web Components Authoring Conventions" below for the full conventions.

### Storybook Stories Format

Use Component Story Format 3 (CSF3). The Storybook renderer is `@storybook/web-components-vite`, so the `Meta`/`StoryObj` types come from there, and WC stories render custom-element markup via lit-html — `render: (args) => html\`…\``. There is no `component:` field:
```typescript
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Badge',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'success'] },
  },
  args: { variant: 'primary' },
  render: (args) => html`<candor-badge variant="${args['variant']}">Badge</candor-badge>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
```

## Toolchain Notes

The component library is web components (Lit 3) — see "Web Components Authoring Conventions" below for all authoring guidance. Storybook runs on the `@storybook/web-components-vite` framework (configured in `.storybook/main.ts`), rendering stories via lit-html:

- Story files import `Meta`/`StoryObj` from `@storybook/web-components-vite` and render with `render: (args) => html\`…\`` (lit-html) — not Angular `template:` strings.
- As of **4.1.0** (#143) the Angular build harness is fully retired: `angular.json`, the `src/app/` bootstrap shell, `src/main.ts`, the Angular tsconfigs, and the `@angular/*`, `zone.js`, and `rxjs` dependencies were all removed. There is no `src/app/` — do not add anything there.
- TypeScript ~5.9. Tokens are authored in SCSS under `src/design-tokens/` and compiled to CSS by `npm run build:tokens`. (The #143 migration lifted the old TypeScript 5 / Angular < 22 version ceiling that had blocked #141.)

> The Angular standalone-component library was removed in 3.0.0, and the Angular toolchain in 4.1.0. Authoring patterns that were Angular-specific (built-in control flow, signals/`model()`, zoneless change detection, `ViewEncapsulation`) do not apply. The web-component equivalents (Shadow DOM scoping, `.prop` bindings, the `aria-label` host-trap) are documented below.

## Web Components Authoring Conventions

The WC library is the primary consumer-facing distribution. It is built on **Lit 3**, ships as `@candor-design/web-components`, and runs in any framework (or none).

### Component shape

```typescript
import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('candor-foo')
export class CandorFoo extends LitElement {
  static override styles = css`
    :host { display: block; }
    /* shadow-DOM-scoped CSS — design tokens reach inside via custom properties */
  `;

  @property() label = '';                                            // string attribute
  @property({ type: Boolean, reflect: true }) open = false;          // bool, reflected to DOM
  @property({ type: Array, attribute: 'menu-items' }) items = [];    // JSON-parsed from attribute
  // For aria-label: don't use @property — use observeHostAriaLabel (see "aria-label host-trap" below)
  @state() private _internal = 0;                                    // reactive but not part of public API

  override render() {
    return html`<button @click=${this._onClick}>${this.label}</button>`;
  }

  private _onClick = () => {
    this.dispatchEvent(new CustomEvent('foo-select', {
      detail: { value: this.label },
      bubbles: true,
      composed: true,
    }));
  };
}

declare global {
  interface HTMLElementTagNameMap { 'candor-foo': CandorFoo; }
}
```

Register the component in `src/web-components/index.ts` via `export * from './components/foo/candor-foo';`. The `@customElement()` call runs at import time, so a bare side-effect import registers the tag.

### Attribute / property naming

Lit's `@property()` lowercases the property name when computing the default HTML attribute name. So `columnHeaders` → attribute `columnheaders`, but the **JS property remains camelCase**.

**Always set an explicit kebab-case attribute on multi-word properties** so HTML markup is readable:

```typescript
@property({ type: Array, attribute: 'column-headers' }) columnHeaders: string[] = [];
//                       ^^^^^^^^^^^^^^^^^^^^^^^^^^ — without this, attribute is "columnheaders"
```

**Pass JSON via attributes** (matches the data-grid story pattern):

```html
<candor-data-grid
  rows='${JSON.stringify(rows)}'
  column-headers='${JSON.stringify(headers)}'>
</candor-data-grid>
```

`@property({ type: Array })` calls `JSON.parse()` on the attribute value automatically. JS-side setters use the camelCase name (`el.columnHeaders = [...]`), not the lowercased attribute name.

### Custom events

Outputs are DOM `CustomEvent`s. Always set `bubbles: true, composed: true` so the event crosses the shadow boundary; otherwise listeners on light-DOM ancestors never see it. Use kebab-case event names (`color-select`, `cell-activate`) to match HTML convention.

Add the event to the global event map if consumers need typed listeners — though most projects bind via `@event-name=...` in templates and don't need this.

### aria-label host-trap

ARIA attributes on the custom element host (`<candor-input aria-label="Email">`) do **not** propagate to the inner `<input>` inside the shadow DOM — browsers treat the host as a generic container for ARIA purposes — AND if you simply mirror the attribute inward, the host also gets a named generic in the AT tree, so screen readers hear the name **twice**.

The fix is two-step: mirror the value inward AND strip the attribute off the host. `role="none"` on the host is **not** sufficient — ARIA's presentational-role conflict resolution preserves the host's accessible name when `aria-label` is set. The attribute itself must be removed.

Use the shared `observeHostAriaLabel` helper from `src/web-components/utils/host-aria.ts` — it installs a MutationObserver, mirrors the value into your state, and strips the attribute off the host:

```typescript
import { observeHostAriaLabel } from '../../utils/host-aria';

@state() private _ariaLabel = '';
private _stopObservingAriaLabel?: () => void;

override connectedCallback() {
  super.connectedCallback();
  this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
}

override disconnectedCallback() {
  this._stopObservingAriaLabel?.();
  super.disconnectedCallback();
}

render() {
  return html`<input aria-label=${this._ariaLabel || nothing} />`;
}
```

**Don't** use `@property({ attribute: 'aria-label' })` for this — Lit's attribute observer would re-clear your cached value the moment you strip the attribute, defeating the fix. Manual observation via the helper avoids the reflection loop.

### Storybook templates: data must flow via attributes, not `<script>`

The Storybook stories render through `@storybook/web-components-vite` (lit-html). A `<script>` tag written inside a lit `html\`…\`` template is **inert** — lit-html instantiates markup from a `<template>` element, and scripts cloned from a template never execute — so this pattern silently leaves elements empty:

```html
<!-- ✗ WRONG — script never runs, element gets no rows -->
<candor-data-grid id="my-grid"></candor-data-grid>
<script>document.getElementById('my-grid').rows = [...];</script>
```

Use attribute injection instead:

```html
<!-- ✓ CORRECT -->
<candor-data-grid rows='${JSON.stringify(rows)}' column-headers='${JSON.stringify(headers)}'></candor-data-grid>
```

### Stateful form-element bindings: use `.prop`, not `?attr`

Native form controls (`<input checked>`, `<input value>`, `<select value>`, `<option selected>`, `<details open>`, …) have a divergent state model: the HTML attribute (`checked`, `open`, …) seeds the *initial* state, but once the user interacts, the live **IDL property** (`input.checked`, `details.open`, …) is the source of truth. The attribute and the property drift apart.

Lit's `?attr` binding writes the HTML attribute, which diverges from the live IDL property (`input.checked`, `details.open`) after user interaction. The bug is invisible on screen and only surfaces programmatically.

**Use property binding for these cases** (Lit `.prop` syntax assigns the JS property each render, overriding the live state):

```html
<!-- ✗ WRONG — attribute binding, diverges from live state after user click -->
<input type="checkbox" ?checked="${this.checked}" />

<!-- ✓ CORRECT — property binding, always reflects host state -->
<input type="checkbox" .checked="${this.checked}" />
```

Apply to: `<input>.checked`, `<input>.value`, `<select>.value`, `<option>.selected`, `<details>.open`, `<dialog>.open`. (Dialog also wants `showModal()` / `close()` methods rather than `open` set directly — see candor-modal.)

**Mirror state back from user interactions.** Property binding only fixes the "host → DOM" direction. For the "DOM → host" direction (user clicks/types, host state needs to update), listen to the appropriate change event:

| Element | Event | Property to sync back |
|---|---|---|
| `<input type="checkbox\|radio">` | `change` | `this.checked = e.target.checked` |
| `<input type="text\|email\|…">` / `<textarea>` | `input` | `this.value = e.target.value` |
| `<select>` | `change` | `this.value = e.target.value` |
| `<details>` | `toggle` | `this.open = e.target.open` |

Without the toggle listener on `<details>`, the host's `open` property silently desyncs whenever the user clicks the `<summary>`.

### Shadow DOM scoping

All components use the default shadow DOM. Token CSS custom properties (`--color-…`, `--font-…`, `--spacing-…`) pierce shadow boundaries automatically — loading `candor-tokens.css` once in the consumer page is enough. Do **not** redeclare tokens inside `static styles` or hard-code OKLCH values.

For projected content (`<slot>`), use `::slotted()` selectors:

```css
::slotted(svg) { width: 1em; height: 1em; }
```

`::slotted()` only matches direct children of the slot, not descendants. For deeper styling, expose CSS custom properties consumers can set from outside.

### Consumer style hooks (`::part` + custom properties)

Tokens re-theme the whole system but can't reach *one* component's internals. Every component exposes two opt-in hooks so consumers can override without forking (#165). Both must leave default rendering identical — set nothing, nothing changes.

**1. Custom properties — the blessed density/shape knobs.** Name them `--candor-<component>-<knob>` and default each to the existing token so the override is purely additive:

```css
/* thread the knob through the declaration, token as the fallback */
min-height: var(--candor-button-min-height, var(--hit-target-aaa));
padding: var(--candor-button-padding-y, var(--spacing-button-padding-y)) var(--candor-button-padding-x, var(--spacing-button-padding-x));
```

Expose these for the bounded knobs consumers most often nudge: padding, font-size, min-height, radius, gap. When a component has per-size declarations (button), thread the *same* knob through every size with that size's token as the fallback — so one override wins regardless of `size`, which is what lets a consumer go denser than the smallest size (the #165 case) without a new size rung.

**2. `::part` — the escape hatch.** Put a `part="<role>"` on each meaningful internal (`part="button"`, `part="input"`, `part="label"`, `part="trigger"`, `part="icon"`, `part="error-message"`, `part="panel"`). Parts cover the arbitrary restyle a custom property can't express — e.g. asymmetric padding (`::part(trigger){padding-top:0}`), text-transform, letter-spacing. One part per internal a consumer might reasonably target.

**Rule of thumb:** custom property when the intent is bounded (density, radius); part when the consumer might do anything.

**Governance.** Part names and custom-property names are **public API** — adding is a minor release, renaming/removing is major (note it in `BREAKING-CHANGES.md`). Document every component's hooks in its story and in the Introduction "Styling & overriding" table. Precedent to match: `candor-drawer` (`--candor-drawer-size`/`-height`), `candor-button`, `candor-input`, `candor-disclosure`.

### Lit lifecycle quick reference

| Hook | When | Use for |
|---|---|---|
| `connectedCallback()` | Element inserted into DOM | Subscribing to global events; remember to call `super.connectedCallback()` |
| `willUpdate(changed)` | Before each render | React to property changes that should affect this render |
| `updated(changed)` | After DOM is updated | Focus management, querying the shadow root |
| `disconnectedCallback()` | Element removed | Cleanup; remember `super.disconnectedCallback()` |

`willUpdate` is the equivalent of Angular's `effect()` for reacting to input changes — check `changed.has('propName')` to gate the work.

## Accessibility Authoring Conventions

These patterns emerged from the 26-component A11Y audit. See `docs/A11Y-AUDIT.md` for per-component findings (currently transitioning to a WC-focused, screen-reader-persona scope; historical Angular findings preserved in the same file) and `docs/archive/A11Y-ANALYSIS.md` for cross-cutting trend analysis from the Angular-era audit.

### Live region pre-establishment

A live region must exist in the DOM **before** content arrives. The conditional belongs *inside* the region, not wrapping it:

```typescript
// ✓ Region always in DOM — empty when unused
html`
  <div role="status" aria-live="polite" aria-atomic="true">
    ${this.message ? this.message : nothing}
  </div>
`

// ✗ Region removed from DOM — AT misses the change
html`
  ${this.message
    ? html`<div role="status" aria-live="polite">${this.message}</div>`
    : nothing}
`
```

### Landmark pollution in dialogs/panels

`<header>` inside `<dialog>` gets implicit `role="banner"` in Chrome (HTML spec only suppresses this inside `article`, `aside`, `main`, `nav`, `section`). `<footer>` similarly becomes `role="contentinfo"`.

Fix: `role="none"` on `<header>` inside dialogs/panels; use `<div>` instead of `<footer>` in slotted content.

### Stories as AT documentation

A story that demonstrates wrong usage is as harmful as a component bug — stories are what developers copy. Every story involving grouped controls, tables, or form elements should demonstrate the consumer-level markup that the component cannot enforce:

- Radio groups: `<fieldset>`/`<legend>` (not `<div>`/`<p>`)
- Tables: `<caption>`, `<th scope="row">` for key/value rows
- Form fields without an explicit label: `<label for>` / `<input id>` association

---

## Common Pitfalls

### Form authoring

- **Disabled fields must have a hint.** A disabled control without explanation reads as broken. The hint is the only channel for telling the user whether the lock is a permission boundary, a system constraint, or a state they can change elsewhere. Apply to every form component (`candor-input`, `candor-select`, `candor-listbox`, `candor-combobox`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-slider`). The one exception: when the reason is unambiguously obvious from immediate visual context — e.g. a field grayed out directly beneath the off-toggle it depends on. Note: `candor-slider` has no built-in `hint` prop — the consumer supplies hint text via an adjacent `<candor-accessible-text role_="annotation">` element, which stays at full opacity (the slider's disabled state dims the host, which would also dim an internal hint).

- **A disabled label's *meaning* must survive — including on buttons (the #134 resolution).** The equity rule extends past form fields to any disabled control whose *label* is the sole cue to the unavailable action — a disabled `candor-button` reading "Delete", a disabled menu item, a disabled tab. WCAG 1.4.3 exempts the dimmed label from contrast requirements, and that dimming legitimately signals "unavailable" (state recognition) — but a low-vision user still needs the *actionable* meaning ("why / what unlocks it"), which the dim label can no longer carry. Supply it as a **readable, enabled-contrast explanation adjacent to the control**, exactly as the slider does with `<candor-accessible-text role_="annotation">`. **Do not** attach the reason via a tooltip: native `disabled` buttons are removed from the tab order, so a focus- or hover-gated tooltip is unreachable for keyboard and screen-reader users; adjacent text sits in document order and everyone encounters it. `candor-button` has no `hint` prop — the consumer supplies the adjacent element (see the button story's *Disabled with reason* example). This is deliberately a **convention, not a contrast bump**: raising `--color-text-disabled` to a readable floor (~OKCA 3) collides with the enabled `text-subtle` colour, so the disabled token stays intentionally below the floor (1.4.3-exempt) and meaning survival is carried by the adjacent hint instead.

### Tokens and visual

1. **Don't hard-code colors**: Always use design tokens
2. **Don't use hex colors in tokens**: Use OKLCH format
2a. **Don't author a colour sRGB can't render**: OKLCH accepts more chroma than the gamut allows and says nothing. The value then specifies nothing — it delegates the choice away from Candor — and every contrast figure recorded against it is undefined, since OKCA is only established across sRGB. Hold L and H, pull chroma to the boundary, and round **inward**. `npm run audit:tokens` gates this and prints the value to use — see "The sRGB gamut is an invariant" above
3. **Don't skip accessibility validation**: Check contrast before finalizing
3a. **Don't use `--color-status-*` (or any `$extensions.usage: "non-text"` token) as a CSS `color:` value for text**: These tokens — `--color-status-error`, `--color-status-success`, `--color-status-warning`, and the base icon/border variants — are contrast-validated only for non-text use (icons, borders, indicators). Their OKCA against common backgrounds is below every text threshold. Always use the paired `-text` variant: `--color-status-error-text`, `--color-status-success-text`, `--color-status-warning-text`. Check `audit/tokens.dtcg.json` — any token with `"$extensions": { "usage": "non-text" }` must not appear in a `color:` rule. That field is now derived structurally and covers all 16 qualifying tokens including every border; before #218 it matched a literal phrase in a comment, was set on 5 tokens, and flagged **no border at all** — so this check silently passed for the entire category it exists to protect. If you are reading an older branch, do not trust it.
4. **Don't create components without stories**: Every component needs a story
5. **Don't modify node_modules**: This is obvious but worth stating
6. **Don't use Atkinson bold for urgency**: Bold weight in Atkinson is for hierarchy/labels only. Error messages, status text, and warnings use regular weight — color carries the urgency signal (see "Typography Usage Rules" above)
7. **Don't put `aria-label` on component host elements without forwarding it inward**: It won't reach the inner interactive element, and if you simply mirror it inward without stripping, screen readers hear the name twice. Use the `observeHostAriaLabel` helper from `src/web-components/utils/host-aria.ts` (see "aria-label host-trap" above).
8. **Don't use `<header>`/`<footer>` inside dialogs or panels**: They inherit landmark roles (`banner`, `contentinfo`) in Chrome. Use `role="none"` or `<div>` (see "Landmark pollution" above)
9. **Don't expose formatter logic for OKLCH axes**: Axes like chroma have dynamic min/max based on hue — auto-computed formatters will be wrong. Expose a `valueTextFn` property and let the consumer supply the semantics

### Web-component-specific

10. **Don't inject data via `<script>` tags in story templates**: a `<script>` inside a lit-html story template is inert and never executes. Pass data via JSON-encoded attributes (`rows='${JSON.stringify(...)}'`) instead — see "Storybook templates: data must flow via attributes, not <script>" above.
11. **Don't rely on Lit's default attribute lowercasing for multi-word props**: `columnHeaders` becomes attribute `columnheaders` by default — unreadable in markup. Always set `attribute: 'column-headers'` explicitly on `@property()`.
12. **Don't omit `composed: true` on dispatched events**: Without it, events stop at the shadow boundary and never reach light-DOM listeners. Always set both `bubbles: true` and `composed: true`.
13. **Don't redeclare tokens inside `static styles`**: Design tokens pierce shadow DOM automatically via CSS custom properties. Hard-coding `oklch(...)` inside a component breaks dark mode and token-driven theming.
14. **Don't use `?checked` / `?open` / `?selected` on native form controls**: After user interaction, the live IDL property (`input.checked`, `details.open`, `option.selected`) diverges from the HTML attribute, and `?attr` binding only writes the attribute. Use `.checked`, `.open`, `.selected` (property binding) so the host's state always wins. Also wire the corresponding change event (`change` / `toggle`) back to the host so user-driven changes don't silently desync — see "Stateful form-element bindings" above.
15. **Don't rely on native browser radio grouping across `<candor-radio>` siblings**: Each radio is in its own shadow root, so the browser can't tie shared-`name` inputs into one mutually-exclusive group OR an arrow-navigable set. candor-radio implements both behaviors itself by querying sibling `<candor-radio name="…">` elements within the nearest `<fieldset>`. If you build another grouped form control (checkbox-group, etc.), expect to write the same shim.

## Test Files

- `tests/accessibility.spec.ts` — keyboard/focus/ARIA behaviour the visual gate can't see (focus reachability, Tab order, radio arrow-key grouping, checkbox space-toggle, `aria-invalid`). Targets the story iframe directly (`iframe.html?id=…&viewMode=story`); Playwright's CSS engine pierces the open shadow roots, so `candor-button button` reaches the inner control.

Visual coverage is Chromatic's job (run on every PR), not Playwright — the old screenshot-only specs (`visual-regression.spec.ts`, `storybook-snapshots.spec.ts`) were removed in #148 as redundant. `test:playwright` runs in CI via the `accessibility` job in `.github/workflows/ci.yml` (Playwright's `webServer` config auto-starts Storybook); run it locally the same way with `npm run test:playwright`.

## Documentation Reference

Detailed workflow documentation in `docs/`:
- `DESIGN-TOKENS.md`: Token modification guide
- `A11Y-AUDIT.md`: Per-component accessibility audit (WC primary; NVDA + Chrome baseline)
- `archive/A11Y-ANALYSIS.md`: Cross-cutting trend analysis from the Angular-era audit
- `archive/WORKFLOW.md`: Complete design iteration workflow guide
- `archive/PLAYWRIGHT-WORKFLOW.md`: Playwright MCP usage patterns
- `ACCESSIBILITY-CONFORMANCE.md`: WCAG 2.1 AA conformance statement
- `BREAKING-CHANGES.md`: Breaking change policy and migration note template

## Node Version Requirements

- Node.js 20.16+, 22.19+, or 24+
- Required for Storybook 10 ESM support
- Check with `node --version`

## Publishing

- Package: `@candor-design/tokens`
- npm publish triggered by version tags via GitHub Actions
- Uses OIDC trusted publishing — no token required
- **Before troubleshooting any CI/CD or publish failure, read `STACK.md` in the dev-notes repo first** — it documents the publish mechanism, known runner quirks, and auth approach
