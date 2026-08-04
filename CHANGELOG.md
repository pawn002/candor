# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Breaking changes

#### Deprecated value-changed events removed: `input-change`, `value-change`, `selected-change`

**Before:**
```js
input.addEventListener('input-change', (e) => setDraft(e.detail));
slider.addEventListener('value-change', (e) => setLightness(e.detail));
chip.addEventListener('selected-change', (e) => setActive(e.detail));
```

**After:**
```js
input.addEventListener('input', (e) => setDraft(e.detail));
slider.addEventListener('input', (e) => setLightness(e.detail));
chip.addEventListener('change', (e) => setActive(e.detail));
```

**Why:** #164 converged Candor's value controls on the DOM two-event rule — `input` streams the live value mid-edit, `change` fires once on commit — and shipped the new names alongside these three bespoke ones so nothing broke at 4.2.0. Carrying both indefinitely means every consumer reading the component docs has two correct answers to choose between, and the wrong one keeps compiling.

**Migration:** Rename the listener. Each replacement has the **same semantics and the same `detail` payload** as the alias it replaces, so nothing else changes:

| Component | Removed | Use instead | Semantics |
|---|---|---|---|
| `candor-input` | `input-change` | `input` | live |
| `candor-slider` | `value-change` | `input` | live |
| `candor-chip` | `selected-change` | `change` | commit |

**This one is silent.** A listener bound to a removed event name is still valid TypeScript and still valid DOM — `addEventListener` accepts any string. It simply never fires again, so the symptom is a control that appears inert rather than a build error. Grep your codebase for the three names; there is no compile-time signal.

#### Remaining event names converged: `closed`/`dismissed`/`selected`/`tab-change`/`page-change` renamed, `clicked` removed

**Before:**
```js
button.addEventListener('clicked', onActivate);
modal.addEventListener('closed', onClose);
alert.addEventListener('dismissed', onDismiss);
menu.addEventListener('selected', onPick);
tabs.addEventListener('tab-change', onTab);
pager.addEventListener('page-change', onPage);
```

**After:**
```js
button.addEventListener('click', onActivate);   // the native event — always was
modal.addEventListener('close', onClose);
alert.addEventListener('dismiss', onDismiss);
menu.addEventListener('select', onPick);
tabs.addEventListener('change', onTab);
pager.addEventListener('change', onPage);
```

**Why:** #164 converged the *value* events on the DOM two-event rule but left seven others in three different styles — past tense (`clicked`, `closed`, `dismissed`, `selected`) alongside present (`change`, `input`, `toggle`) alongside a `-change` suffix (`tab-change`, `page-change`). 5.0.0 is already a breaking release, so this is the window to finish the job rather than spend a second major on event names later.

Two rules now govern the names:

1. **Present tense, matching the DOM's own vocabulary.** Past tense read as a different *category* of event when it was only ever a different spelling.
2. **No Candor event where a native one already arrives.** `candor-button`'s `clicked` duplicated the native `click`, which retargets from the inner button to the host and reaches consumers unaided — verified: one click delivered one `click` *and* one `clicked`. A duplicate that has to be kept in sync is worse than no event, so it is removed rather than renamed.

A selection that commits is a value change, which is why `tab-change` and `page-change` both become plain `change` rather than `select`. Neither component contains a native control that fires `change`, so nothing collides at the host (verified).

**Migration:** Rename the listener; every payload is unchanged. For `candor-button`, listen for `click` — you may already be, in which case delete the `clicked` handler rather than renaming it, or it will fire twice. A `disabled` button suppresses `click` natively, so the old `if (!disabled)` guard is not needed on your side either.

| Component | Before | After |
|---|---|---|
| `candor-button` | `clicked` | `click` *(native — remove your handler if duplicated)* |
| `candor-modal`, `candor-drawer` | `closed` | `close` |
| `candor-alert`, `candor-toast`, `candor-chip` | `dismissed` | `dismiss` |
| `candor-menu` | `selected` | `select` |
| `candor-tabs` | `tab-change` | `change` |
| `candor-pagination` | `page-change` | `change` |

Exported `detail` types renamed to match: `CandorMenuSelectedDetail` → `CandorMenuSelectDetail`, `CandorPaginationPageChangeDetail` → `CandorPaginationChangeDetail`, `CandorTabsTabChangeDetail` → `CandorTabsChangeDetail`. `CandorButtonClickedDetail` is removed. **These are the one part of this change TypeScript will catch.**

**Silent, like the alias removal above** — see the note there. `candor-button` is the sharpest case: a consumer whose only handler is on `clicked` gets a button that looks and focuses correctly and does nothing.

#### 28 color values re-authored so that every Candor color is renderable in sRGB

**Before:**
```scss
--color-status-warning-text: oklch(0.40 0.16 53.54); // sRGB cannot render this
```

**After:**
```scss
--color-status-warning-text: oklch(0.40 0.10 53.54); // same L, same H, honest C
```

**Why:** sRGB is the baseline gamut for digital products. An out-of-gamut OKLCH value is not a specification — it delegates the final color to whatever consumes it, so **the token stops naming one color**, and **every contrast figure recorded against it is undefined**, since OKCA is established across the sRGB gamut and such a value falls outside the algorithm's domain. 19 of 62 distinct colors (31%) were in that state. For a system whose product is a contrast floor that is a correctness defect, and it is the root cause behind #222, #208, and the token-layer half of #221.

**Candor does not model or track how out-of-gamut values get resolved downstream** — that is an arms race across engines and versions, and it is not one this project enters. The invariant makes the question moot rather than answering it: with every value inside the gamut, nothing is left for anyone to resolve, and Candor's conformance claims stop depending on anyone else's behavior.

Each value holds its authored lightness and hue and pulls chroma to the sRGB boundary. Lightness carries contrast, so it is never traded for chroma.

**On what changes visually:** less than the table suggests. The deltaE figures are measured against the *authored* values, which never named a deliverable color; against the nearest in-gamut form of each — the closest thing to a like-for-like baseline — the mean is 3.5, inside CLAUDE.md's own "acceptable drift" band, with 10 of the 22 semantic tokens imperceptible at deltaE < 3. The clear exception, and an improvement, is light `--color-status-warning-text`: at C=0.16 it was the furthest outside the gamut of any Candor color, deltaE 11 from its nearest in-gamut form and off-hue with it. It is unambiguously amber again.

**Migration:** No token was renamed or removed, so no find-and-replace is required and consumers using Candor tokens for their own contrast pairs are safe — every affected pairing was re-measured and **contrast improved or held on all of them; nothing regressed**. Two actions if you have built on top of these values:

1. **If you hard-coded a Candor OKLCH literal in your own CSS instead of referencing the token**, it is now out of sync — and if you copied one of the 19, it was never rendering as written. Replace literals with `var(--token-name)`.
2. **If you run screenshot regression tests**, expect diffs on links, focus rings, status text, badges, alerts, callouts, and syntax-highlighted code. Accept the new baselines.

Six previously-recorded contrast exceptions are resolved by this change: the five in #222 (which shared one cause — dark `--color-status-error-text`, specified outside the gamut) and `candor-button`'s destructive variant in #209. The audit now reports 2 failing pairings, down from 8, and the two that remain are one pairing measured in both modes — a 14px Tier 1 sizing question tracked in #208, not a color one.

Full per-token table in [#225](https://github.com/pawn002/candor/issues/225).

#### Tier 1 regular text must be ≥ 16px, replacing an unreachable 14px contrast floor

**Before:** Tier 1 (must-read-to-act) regular text at 14px carried an OKCA floor of 9.5.

**After:** Tier 1 regular text is required to be 16px or larger, where the floor is 4.5. The 9.5 figure is retained only as the size-axis baseline that explains *why* 14px regular reading text is disallowed — it is not a target to build against.

**Why:** 9.5 was unreachable by every chromatic text colour in the system. Measured against white, all four return `lightness-exhausted` from `klar find` — there is no lightness at that hue and chroma that reaches 9.5 inside sRGB:

| token | measures | what 9.5 would cost |
|---|---|---|
| `--color-status-error-text` | 6.4 | chroma 0.18 → 0.146, deltaE 8 |
| `--color-status-warning-text` | 8.1 | chroma 0.10 → 0.092, deltaE 3 |
| `--color-status-success-text` | 6.1 | chroma 0.14 → 0.116, deltaE 9 |
| `--color-link` | 5.3 | chroma 0.14 → 0.104, deltaE 12 |

The floor was not asking coloured text to be darker; it was asking it to stop being coloured. Only near-neutral text could satisfy it, so in practice it functioned as an unintended ban on chromatic must-read text — a rule the system had already been quietly violating in the direction of good design (#240).

Stated as a size requirement, it becomes actionable and self-consistent: **a Tier 1 element at 14px is a sizing bug, and the fix is the size.** The system already worked this way — `candor-input` renders its validation errors at 16px and passes, while the generic `candor-accessible-text role_="status"` rendered identical content at 14px and could not (#208).

Tier 1 **bold** at 14px keeps its 6.5 floor; bold is a genuine perceptual compensation and 6.5 is reachable.

**Migration:** `candor-accessible-text role_="status"` now renders at 16px rather than 14px. Expect screenshot diffs anywhere it appears. If the text is reporting an *outcome* rather than an instruction, use the new `role_="state"` below and it stays at 14px.

#### `candor-accessible-text` `role_="status"` split into `status` and `state`

**Before:** one role for everything about system state, at one size.

**After:**

```html
<!-- Tier 1, 16px — the user must read this to know what to do -->
<candor-accessible-text role_="status" color="error">Enter a valid National Insurance number.</candor-accessible-text>

<!-- Tier 3, 14px — an outcome; renders an aria-hidden tone icon -->
<candor-accessible-text role_="state" tone="success">All responses processed — no flags raised</candor-accessible-text>
```

**Why:** the 16px requirement above is correct for an instruction and wrong for an outcome. An icon beside "Enter a valid National Insurance number" says something is wrong but not *which field or what format*, so nothing is redundant and the text is the sole channel — Tier 1. An icon beside "All responses processed" genuinely carries the outcome; delete the text and you still know it succeeded — Tier 3, floor 4.5, which 14px meets.

The redundancy is **structural**: the component renders the icon, so it cannot be forgotten by an author. This is what the tier table has always meant by "redundantly coded", now with an instrument behind it (#213).

The design has a consequence worth knowing: **`state` text needs no colour of its own.** The icon carries the tone via `--color-status-*` — the tokens validated for non-text use — while the text stays `--color-text-default` (OKCA 11.5 on page) and clears every floor with margin. Moving the colour onto the icon removes the contrast constraint rather than negotiating with it.

**The test:** could a reader who cannot resolve the glyphs still act correctly? Yes → `state`. No → `status`.

**Migration:** existing `role_="status"` keeps working and grows to 16px. Audit each usage against the test above; anything reporting a completed outcome should become `role_="state"` with a `tone`, which restores 14px. Counters and data readouts ("14 of 47 reviewed") are neither — they are comprehension text and belong in `candor-text`.

#### `candor-text` no longer accepts `size="xs"`

**Before:** `<candor-text size="xs">` rendered at 12px.

**After:** the size scale starts at `sm` (14px). `size="xs"` is a type error, and an unrecognised attribute value at runtime.

**Why:** 12px is below the readable-text floor, and `candor-text` is the component whose entire purpose is readable text. Offering a size at which its own output is not permitted is an affordance that can only be misused — and was: the story documenting `xs` rendered a full English sentence at 12px in order to demonstrate that 12px is not for sentences, which is precisely the "a story that demonstrates wrong usage is as harmful as a component bug" case (#230).

**Migration:** use `size="sm"`. If the content is genuinely chrome — initials in an avatar, a glyph in a badge — set `--font-size-xs` directly on that element and mark it (see the audit gate below); it is not text, and it does not belong in a text component.

### Added

- **`audit:contrast` runs in CI, in the same job as `audit:tokens` and after it.** This supersedes the note on the `audit:contrast` entry further down, which recorded it as deliberately unwired while #208 and #209 were still open; both are now closed, so the reason has expired. The `gamut` job is renamed `audit` and gains the step (#211).

  **The step order is the substance of this change, not its arrangement.** `audit:contrast` reads `audit/tokens.dtcg.json` off disk, so on its own it measures the *committed* artifact rather than the tokens in the working tree — which means two parallel audit jobs would have produced a false green. Verified by tripwire rather than assumed: lightening `--color-text-subtle` to `oklch(0.70 0 0)` without re-exporting leaves `audit:contrast` printing `✓ no drift` at exit 0 while 19 real violations sit in the tree — nine pairings measuring 2.1 against a 4.5 floor, the token's own recorded figure, and the story that quotes it. Re-exporting first fails the same tree with all 19 named. So the two audits are sequential steps in one job, and the finer red/green signal that splitting them would buy is bought by breaking the check — the #218 shape one level up from the scripts: a guard that passes because it measured the wrong thing.

  **What this does not do, stated because the entry above it would otherwise overclaim.** GitHub's required-status-check list on `main` holds `build-tokens (20)` and `build-tokens (22)` and nothing else, so `audit` — like `typecheck`, `accessibility`, and `chromatic` — reports without blocking a merge. Every gate in this release is enforced against a reader of the checks page, not by the branch. Making them required is a repository-settings change, not a code one, and is left to that decision.

- **`npm run audit:tokens` now gates the sRGB gamut invariant.** The export fails, before writing anything, if any `oklch()` literal in `src/design-tokens/*.scss` falls outside sRGB — printing the offending declaration with its file and line, and the in-gamut value to use in its place. Two details that would otherwise bite are handled: it rounds chroma **inward** rather than to nearest, because the in-gamut maximum sits exactly *on* the boundary and 2dp nearest-rounding pushes roughly half of these values straight back out; and it discovers stylesheets by listing the directory rather than from a hardcoded list, so `syntax.scss` is covered despite not being in the DTCG artifact — six of its ten tokens were out of gamut. The gate lives here rather than in `check-contrast.js` because gamut is a property of a *token*, not of a pairing: this script sees every declaration, while the contrast audit only ever sees colors someone remembered to add to `pairings.json`. Pass `--skip-gamut` to export without klar installed (#225).

- **`role_="state"` on `candor-accessible-text`** — a fifth role for outcomes that have already happened. Renders an `aria-hidden` tone icon (`success` / `warning` / `error` / `info`) beside the text, coloured from the `--color-status-*` non-text tokens while the text itself stays `--color-text-default`. Screen-reader users get the outcome from the wording, so each line must still read correctly on its own — "All responses processed", not "Done" (#213).

- **`audit:contrast` now enforces the 14px text floor**, which was stated in five places and enforced in none. The check lives in the *contrast* audit rather than a typography linter for a specific reason: 12px is classified decorative in **both** axes of the tier table, so no OKCA floor is defined for it, so `pairings.json` contains zero size-12 entries. Setting `--font-size-xs` on a piece of text therefore removed it from contrast auditing altogether, silently, with nothing recording that it had happened — the #218 shape again, and the direct reason #229 sat unnoticed. The audit now reports its own blind spot.

  Any sub-14px `font-size` in `src/` fails unless it declares a reason the audit recognises (`badge-chrome`, `icon`) in a `12px-ok:` marker on the declaration or up to three lines above it. Free text is rejected exactly like a missing marker, so the assertion cannot degrade into a comment. The marker must also **open** a comment rather than merely appear in the text — because the type-scale story documents this syntax in rendered copy, and a looser match would have let that documentation authorise a real violation three lines away. Absolute literals (`font-size: 0.75rem`) are caught alongside the token, so hard-coding is not a way around it. **Known limit, stated rather than left to be assumed:** relative units cannot be resolved statically, so `0.9em` is not judged — Candor has one such site, at 14.4px (#230).

### Changed

- **`audit/pairings.json` entries carry an explicit `tier`, and `min` is now derived from it rather than trusted.** #213 asked whether a per-pairing field was the right instrument at all, and warned that a `redundant-channel` column would make things worse — a channel name is a human claim nothing can verify, so populating it converts unexamined assumptions into recorded facts and a half-filled column reads as validated.

  That argument turns on cross-checkability, and it points the opposite way for `tier`: tier + size + weight *determine* `min`, so a wrong tier surfaces as a contradiction. The audit derives the floor and fails when the two disagree. Backfilling all 114 found exactly **two** disagreements, both on `exempt` entries carrying a `min` of 3 that no tier can produce — `form-input-placeholder` and `form-input-disabled-value`, now corrected to 4.5, the floor they would carry as active content.

  A fourth value was forced by the data: **`"non-text"`**, for the six icon pairings whose 3.0 comes from WCAG 1.4.11 rather than any text tier. They had been sitting in a text-tier file with a floor no text tier explains.

  **The check's teeth are limited to the 14px row and that is stated rather than glossed:** at 16px and above every tier collapses to one floor, and at 14px bold Tiers 2 and 3 are both 4.5, so a wrong tier is undetectable there. Confirmed by tripwire — flipping `badge-default` from 3 to 2 does not fire. 14px is also the only row where the tier axis changes the answer, so the coverage lands where the classification matters. **No `redundant-channel` field was added**; that reasoning belongs in `note`, where it does not look machine-checked.

- **The Tier 3 redundant-channel rule is narrowed, and `candor-badge`'s recorded justification is corrected.** The rule said the channel must be "assigned by the system, not a consumer opt-in", which recognised only one way of being non-optional — a component rendering an icon. It now recognises two: the component renders it (`candor-alert`, `candor-toast`, `role_="state"`), **or** the component cannot render without it (a badge's label, since a badge with no content is not a badge). The second comes with a precondition the rule now states: the label must *name the condition*. `<candor-badge variant="error">3</candor-badge>` has no channel; `3 failed` does.

  `badge-default` claimed "badge shape always provides redundant coding". That is true of *badge vs. surrounding text* and false of *error badge vs. warning badge* — two jobs conflated in one note, and the five status siblings carried no note at all, taking the discount on a justification written elsewhere. All six are rewritten (#214, #213).

- **A measurement that changes what the badge fill can be credited with.** Candor's status background tokens sit at lightness 0.95, where sRGB permits only ~0.02 chroma at the red and amber hues (green reaches 0.05, which is why success looks distinct and the other two do not). `--color-status-error-bg` and `--color-status-warning-bg` are therefore **deltaE 4 apart in normal vision** — inside the band Candor's own scale calls imperceptible, and not fixable by adding chroma, because there is none to add at that lightness.

  This is not the colour-vision finding #214 was filed with; it is stronger, and it is not conditional on CVD. It also **got worse in #225 and nobody measured it**: error-bg was authored at C 0.05, out of gamut at that lightness, and pulling it to the boundary halved the separation from deltaE 8 to 4. The re-authoring was right — the old value never named a deliverable colour — but "every pairing was re-measured and nothing regressed" was a claim about contrast, and variant distinguishability is not a contrast property. Recorded in CLAUDE.md as the tint corollary to "contrast is bought with chroma".

  Note also that #214's original figures were taken before #225 and describe colours that no longer exist. They were re-measured against current values rather than carried forward.

- **`candor-stat` and `candor-badge` do not get the same answer.** Badge's label states the condition, so its text is the channel. Stat's label states *what is measured* — "Response time 847 ms" reads identically whether the number is good or alarming — so colour can be the sole signal. Stat needs no new API for this: its default slot takes `<candor-accessible-text role_="state">`, whose icon is component-rendered and therefore cannot be forgotten. Both components gain a story teaching the rule by worked contrast (`Rule: the label carries the meaning`, `Rule: colour is not the channel`).

### Fixed

- **`candor-data-grid` cell labels render at 14px and have a contrast pairing for the first time.** `.data-grid__cell-label` is consumer content — the visible text in every gridcell, and the same string the cell exposes as its accessible name — but was set at 12px, which meant it could not meaningfully be audited at all. It is the text #229 found unreadable at OKCA 2.7, and it had no pairing while the three headers around it did. Note the boundary the new pairing records: it measures the component's **defaults**; a consumer supplying `--cell-fg`/`--cell-bg` leaves Candor's control, and Candor cannot audit that result (#230, #229).
- **Token names in the colour and typography showcases are readable.** Both rendered token names — the thing a developer reads precisely in order to copy it — as sub-floor text: 12px in the typography showcase and 0.65rem (10.4px) in the colour swatch grid. Both are now 14px. The swatch labels also break at hyphens rather than mid-word; `break-all` was splitting `--color-border-default` as `--color-border-defaul / t`, which for a string whose purpose is to be copied is worse than a wrap (#230).
- **A truncated `style` attribute in the colour showcase.** The comment explaining the wrap fix above was written *inside* `style="…"` and contained a double quote, which closed the attribute early and silently dropped the two declarations after it — `overflow-wrap: break-word` and `margin: 0`. Nothing errored: lit-html rendered the attribute, the browser parsed what it received, and the wrap looked fixed because removing `word-break: break-all` was the load-bearing half. Caught by reading the computed style during visual review rather than by trusting the screenshot. The declarations now live in a `SWATCH_LABEL_STYLE` const so the prose sits in TypeScript, where quoting it is free; the repo was swept for the same shape and the four remaining in-attribute comments contain no quotes.
- **The type scale now states 12px's two conditions.** The row was labelled "Decorative / non-text only" but said nothing about *how* to use it legitimately — that it is not reachable through `candor-text`, and that the audit fails the build without a `12px-ok:` marker. A designer reading the scale is the person most likely to reach for 12px, so that is where the conditions belong.

### Fixed (tooling)

- **Story prose is now inside the contrast audit, and token values are no longer recorded in stories at all.** `audit:contrast` re-measured figures written in `semantics.scss` comments while the convention it enforces — every recorded figure must be re-measurable — was never limited to token comments. Story prose was therefore unguarded, and it is both the surface developers copy from and where the tier rules are taught by worked example, so a stale number there teaches the wrong threshold. A third pass now scans `src/**/*.stories.ts` (10 figures, 0 `UNCHECKED`). Story prose has no free anchor the way a token comment gets one from its declaration, so the anchor must be written into the sentence: `OKCA <n> on <bg>` with a `--custom-property` or `#rrggbb` to its left, nearest wins, which lets one line carry two claims about two colours. Unanchored figures are reported, never guessed — guessing produces a number about the wrong colour, which is worse than reporting nothing. Threshold statements (`OKCA 4.5 bold threshold`) are recognised as policy rather than measurement, so tier tables need no exemption.

  Token **values** in stories got the opposite treatment, because they are facts the artifact already holds rather than arguments that must be written down: the colour reference table and the data-grid token demo now read `audit/tokens.dtcg.json` through a new `src/web-components/design-tokens/token-values.ts`, so a displayed swatch cannot disagree with the stylesheet and a renamed token throws at build time instead of rendering a blank cell. This was not hypothetical — the data-grid demo was painting `oklch(0.63 0.15 144)` labelled `--color-status-success` against an actual `oklch(0.55 0.15 144.2)`, and `--color-status-warning` at `0.66 0.16 54` against `0.54 0.13 53.54`. Those swatches are corrected by the derivation, and the warning cell's label flips to white: at the true (darker) amber, the `#333` it had been using measures OKCA 1.0. The reference table's 54 rows resolve to byte-identical values, so it renders unchanged.

  The new pass immediately caught an error introduced earlier on this same branch: the brand-palette figures had been "corrected" from 14.0/2.5 to 13.9/2.6 to match their tokens, but those lines document the brand hex, and hex → OKLCH rounding makes the hex and its token genuinely different colours. Reverted, with the distinction now recorded in both the story and CLAUDE.md (#223).

- **`$extensions.usage: "non-text"` is now derived from what a token *is*, and covers all 16 qualifying tokens instead of 5.** CLAUDE.md nominates this field as the machine-readable guard against using a non-text token as a `color:` value. It was populated by regex-matching the literal phrase `icon/border use` in a comment — so it flagged the 5 places someone happened to type that phrase, and **not one border**, the archetypal non-text category. The documented safety check therefore returned a confident false negative for every `--color-border-*` token, plus `blockquote-border` and `action-destructive-border`. It is now structural: a name containing `border`, or the existence of a `<name>-text` sibling (the system having minted a `-text` variant *is* the statement that the base is not for text — this catches the three `--color-status-*` bases and the `action-destructive` / `action-tertiary` fills), plus a short named-role list for `focus`, `slider-thumb`, and `highlight-decorative`. The export now **fails** if a comment claims non-text use for a token no rule catches, so prose and rules cannot drift apart silently — which is the failure this replaced (#218).
- **Token descriptions now capture a comment above the declaration, not only one trailing it.** Several of the longest and most load-bearing annotations sit above their declaration because they run to three lines, and trailing-only capture dropped 21 of 55 light tokens' `$description` entirely. `--color-border-control` was among them, which is the whole reason its dark-mode behaviour read as an unexplained oversight from the artifact alone (#217). Section dividers are excluded, so a header is never attributed to whichever token happens to be listed first beneath it (#218).
- **The contrast audit can now verify a figure that names a mode explicitly** (`OKCA 3.5 on dark page`). A token declared only in the light mixin is *inherited* by dark, so its single comment is the only place its dark behaviour can be recorded — and until now that figure was unverifiable where it necessarily lives. Combined with the two fixes above this took the audit from 43 re-measured figures to 49 with zero `UNCHECKED`, and immediately caught a stale one: `--color-border-control` on `bg-surface` recorded 2.9 against a measured 2.8. It had never been checkable before, so it had never been checked (#218, #217).

### Changed

- **`npm run audit:contrast` now requires klar 3.x, and measures the colour Candor specifies.** klar 2.x resolved every colour through an 8-bit hex round-trip and silently substituted a different colour for out-of-gamut input, so it reported figures for colours nobody had asked about — `oklch(0.79 0.22 25)` was scored as `#ff938b` while klar's own swatch on the same line showed `#ff746f`. Fixed upstream in klar 3.0.0 (pawn002/klar#9, reported from this repo). `scripts/check-contrast.js` now pins `3.x` and, deliberately, does **not** pass `--allow-out-of-gamut`: klar exits 1 on such input, and that failure is surfaced with a pointer to the gate rather than suppressed. OKCA is established across the sRGB gamut, so a score for a colour outside it is undefined rather than merely optimistic, and producing one would put a meaningless figure in a report whose whole job is to be trustworthy. Gamut itself is enforced at the token layer (#225), where it belongs: it is a property of a token, not of a pairing, and this script only sees colours someone remembered to add to `pairings.json`. `audit/pairings.json` is unchanged — it records `min` policy floors, not measurements (#221).

### Added

- **Event names are now type-checked (#236).** Each component declares `addEventListener` / `removeEventListener` overloads built from its own `*EventMap`, so `el.addEventListener('tab-change', …)` is a compile error instead of a listener that silently never fires, and `detail` is typed without a cast. Native events keep their native types. Previously the 23 exported `Candor*EventMap` interfaces described the event surface but nothing enforced it — `addEventListener`'s signature is `(type: string, …)`, so there was nothing to check the name against. That is a CSS-shaped failure mode on a code-shaped API, and it is what made every rename above invisible to a consumer's build. Reaches ordinary code, not only consumers who hand-annotate, because each component already augments `HTMLElementTagNameMap`. Two deliberate limits: framework template bindings (`@change=`, `(change)=`) do not go through this signature, and dispatching your own custom event on a Candor element needs a widening cast — `(el as HTMLElement).addEventListener(…)` — since omitting a permissive fallback overload is what produces the error at all. `candor-button` carries an intentionally empty map: "emits nothing, use the native `click`" is a statement about the API, and declaring it is what makes a listener on the removed `clicked` an error rather than dead code.
- **`npm run typecheck` and a `typecheck` CI job (#238).** Nothing ran `tsc` — Vite transpiles without checking and `build-storybook` does not check either — so type errors sat in the working tree unread. This also makes `tests/event-types.test-d.ts` a real gate: that file has no runtime, `tsc` is its assertion, and its `@ts-expect-error` directives fail the build in both directions, so an overload that stops rejecting a removed name breaks CI rather than passing quietly.

### Fixed

- **`build:wc` emitted the type declarations where the package does not look for them (#237).** `vite.wc.config.ts` passed `outDir` to `vite-plugin-dts`, which in v5 delegates to `unplugin-dts` and renamed the option to `outDirs`. An unrecognised key is ignored rather than rejected, so declarations landed at `dist/src/web-components/index.d.ts` while `package.json` points `types` at `./dist/index.d.ts` — meaning a build of the current tree exposes **no types at all**. Not shipped: 4.2.0 on npm is correct, and the rebuilt output was diffed against that tarball to confirm all 44 published paths reproduce exactly (plus `token-values.d.ts`, new in #223). Three things hid it: the plugin ignores unknown options silently, `build:wc` still exits 0 and emits 45 `.d.ts` files at the wrong depth, and nothing verifies the manifest's entry points resolve. TypeScript had been naming the exact fix on line 10 of that file the whole time, which is why #238 landed alongside.
- **`candor-modal` and `candor-drawer` dispatched their close event twice per close (#234).** Both wire the inner native `<dialog>`'s own `close` event to the same handler that calls `dialog.close()`, so a single user close re-entered it and fired twice — on every path (close button, backdrop click, Escape). Invisible on screen, since the dialog closes correctly; the symptom only surfaces in a consumer handler that is not idempotent, which double-counts. `_close()` now guards on `open` and clears it *before* closing the dialog — ordering that is load-bearing, because the re-entrant call otherwise arrives while `open` is still `true`. Found while verifying that renaming `closed` → `close` would not collide with the native dialog event; it does not, as that event is neither bubbling nor composed. `tests/events.spec.ts` now asserts exactly one event per close for both components.
- **The Design Tokens color showcase now mirrors the tokens exactly.** Its swatch table carries hand-written `light:`/`dark:` literals that nothing kept in sync with `semantics.scss`, and three had drifted independently of the gamut work: `--color-status-warning` was documented as `oklch(0.66 0.16 53.54)` against an actual `oklch(0.54 0.13 53.54)`, `--color-status-success` as `0.63` against `0.55`, `--color-status-error` as `0.55` against `0.54`. The swatch a reader saw was a color the system does not contain, and the documented value was one they would have copied. All 55 rows are now regenerated from `audit/tokens.dtcg.json`. That repaired the instance; the structural fix that stops it recurring landed with #223, below (#225).
- **`--color-link`'s recorded brand figure corrected to 5.3 on white**, which moved with the gamut re-authoring (#225). The Navy and Azure figures in the same prose block are *not* corrected, and an earlier draft of this branch was wrong to touch them: those lines document the brand **hex** (`#082840`, `#1493FB`), not the token derived from it, and hex → OKLCH conversion rounds — Navy's hex is OKCA 14.0 on white while `--color-action-primary` is 13.9. Both numbers are right about their own colour. The block now says so, so the next reader does not "reconcile" them again (#225, #223).
- **Two hardcoded diff-highlight fills in `syntax.scss` now derive from their tokens.** `.token.deleted` and `.token.inserted` set their background tint as a literal `oklch(… / 0.15)` duplicating the adjacent `--syntax-deleted` / `--syntax-inserted` values — so the deleted tint carried the same out-of-gamut value as its token, and the pair could silently desync. Both are now `color-mix(in oklch, var(--syntax-…) 15%, transparent)` (#225).
- **Three stale OKCA figures corrected in the Design Tokens showcase stories.** Story prose records its own contrast figures, and `npm run audit:contrast` cannot see them — it parses `//` comments in `semantics.scss`, so these have never been checked by anything and drifted through both the klar 2.0 and 3.0 re-baselines. `--color-text-subtle` read **4.6** against a measured 5.0, subtle-on-inverse **5.5** against 6.0, and the Navy brand anchor **13.8** against 14.0. The `text-subtle` one is the most damaging: it is not a passing annotation but a worked example teaching the tier rules, and it contradicted `CLAUDE.md`'s recorded 5.0 for the system's most-cited token — a reader comparing the two found the design system disagreeing with itself in the document whose job is to explain it. The conclusion it draws survives unchanged (5.0 still fails the 6.5 regular threshold, still clears the 4.5 bold floor). The remaining four figures in these files were re-measured and are correct. This corrected the numbers only; the question it left open — whether recorded figures should live in story prose at all, given nothing could verify them there — is settled above: figures stay, and are now audited; values move to the artifact (#223).
- **Dark `--color-action-destructive-text` stepped to `L=0.75` to clear the Tier 2 bold floor.** The destructive button is outlined in dark mode — `--color-action-destructive` is `transparent`, so the label sits directly on the page — and at `L=0.74` it measured OKCA 4.4 against a 4.5 floor, missing by 0.1. Stepped one lightness increment to `oklch(0.75 0.15 347)` for OKCA 4.7, a deltaE of 1 and visually indistinguishable. `--color-action-destructive-border` moves with it: it carries the same value under a `// matches text` annotation, and leaving it behind would have made that comment false. The token is inside the sRGB gamut, so the figure is well-defined and independent of any gamut-mapping policy. The hardcoded `light:`/`dark:` literals duplicating this token in the Design Tokens colour story are updated in step — they do not track `semantics.scss`, so this change would otherwise have desynced them silently — along with that entry's recorded figure, which read `OKCA 8.8 on white` against a measured 9.3 (the stale-figure class tracked in #223). This does **not** resolve the same token on `--color-bg-surface`, where it measures 3.9 and remains unvalidated by any pairing; that is tracked separately in #224 (#209).
- **15 recorded contrast figures re-baselined to klar 3.0 — no colour changed, and five real failures stopped being invisible.** Two distinct corrections landed together. Eleven figures moved by exactly ±0.1: klar 3 scores at full precision instead of through the hex round-trip, and because Candor's tokens are hand-authored round values (`oklch(0.27 0.06 245.34)`) that essentially never land on the 8-bit grid, 102 of 216 pairings shift — none by more than 0.1, and **none across a pass/fail boundary**. The other four are not precision but gamut, and they are large: dark `--color-status-error-text` recorded **5.2 on error-bg and measures 3.4**, dark `--color-status-warning-text` 5.8 → 5.2, light `--color-status-error-text` 4.9 → 4.6, dark `--color-link-visited` 6.0 → 5.8. Those tokens were outside sRGB, so they named no single colour and the recorded figures were undefined — which is why they read as comfortable passes with nothing to back them. The audit consequently reports 8 failing pairings where it previously reported 3 — the five newly visible ones are tracked in #222 and fixed by the token re-authoring in #225; the rest are #208 and #209, unchanged. `docs/ACCESSIBILITY-CONFORMANCE.md` no longer records only two known exceptions, since that understated what was measurable (#221).

### Added

- **`npm run audit:contrast` — a contrast drift check.** New `scripts/check-contrast.js` re-measures the repo's contrast claims against klar and fails when reality and the record disagree. Two independent passes: every pairing in `audit/pairings.json`, in both modes, against its `min` floor (212 enforced, 4 exempt); and every OKCA figure written into a token comment, against that token's current value. Claims are read with an explicit grammar — `[<fg>] OKCA <n> on <bg>`, with a leading `was` marking a superseded figure — and anything it cannot interpret is printed as `UNCHECKED` rather than passed over, because a guard that silently covers a subset reads as validation when it isn't (the failure mode filed as #218). It also skips dark-mode claims on tokens the dark mixin doesn't redeclare, since those comments were authored about light and inheriting one doesn't make it a dark measurement. It is deliberately **not** wired into CI yet: it currently exits non-zero on the two genuine failures tracked in #208 and #209, and an allowlist to paper over them would be the same defect it exists to catch (#211).

### Fixed

- **Every recorded contrast figure re-baselined to klar 2.0 — no colour changed.** klar 2.0.0 recalibrated OKCA, and the correction lands precisely at the decision boundary: pairs scoring in the 3–7 band gained roughly +0.4, pairs above 10 are flat or fractionally lower. That made every number in `semantics.scss`, `primitives.scss`, `syntax.scss`, `article.scss`, `audit/pairings.json`, and the audit docs stale to some degree — and these numbers are load-bearing, since they are the justification text a contributor reads when deciding whether a colour is allowed to move. All 42 token-comment figures and 14 pairing notes are re-measured, along with the affected prose in `CLAUDE.md`, `docs/VISUAL-DESIGN.md`, `docs/A11Y-AUDIT.md`, `docs/DESIGN-TOKENS.md`, `docs/ACCESSIBILITY-CONFORMANCE.md`, and the Design Tokens colour story. `audit/tokens.dtcg.json` regenerates with **zero `$value` changes** — the freed headroom is real but measures deltaE 2–3, imperceptible, and harvesting it would churn every token and the entire Chromatic baseline for a change nobody can see (#211).
- **`primitives.scss` ramp annotations were WCAG 2.x figures reading as OKCA.** The palette anchors were annotated `15.2:1 with white` style, unlabelled, in a system whose policy algorithm is OKCA — which is how `OKCA 15.2` ended up recorded for the inline-code pairing when the measured OKCA was 14.4. Each annotation now names its algorithm and carries the OKCA figure first. This surfaced a contradiction the old notes concealed: `azure-500` (OKCA 4.2) and `indigo-600` (3.8) were both marked "the accessible step", but neither clears Candor's 4.5 text floor — which is exactly why `--color-link` steps to `L=0.49` and `--color-link-visited` uses `indigo-700`. The notes now say so instead of asserting the opposite (#211).
- **`docs/ACCESSIBILITY-CONFORMANCE.md` claimed validation by a tool and algorithms that were never used.** The contrast section credited "CPQI CLI" against "WCAG 2.1, OKCA, and APCA" — the tool was renamed to klar and APCA is not one of its algorithms (the same class of defect as the phantom plugin roster in #212). Corrected to klar 2.x / OKCA + WCAG 2.x, and the blanket "all color combinations meet WCAG 2.1 AA" now records the two known exceptions (#208, #209) rather than asserting over them. The claim that passing OKCA implies passing WCAG is now stated as what was actually measured: across all 216 audited pairings, the OKCA score is at or below the WCAG 2.x figure for the same pair (#211).
- **Value-control stories now document their real events.** The two-event rule shipped in 4.2.0 (#164) was never carried into the component docs, so the pages consumers actually copy from were teaching the wrong API: `candor-input`, `candor-slider`, and `candor-chip` documented *only* their deprecated alias (`input-change`, `value-change`, `selected-change`) and never named the event that replaced it; `candor-combobox` documented `change` but omitted the `input` it fires for filter text; `candor-checkbox` and `candor-radio` documented no events at all. `Introduction.mdx` had the mapping right, but that isn't where anyone looks before wiring a handler — so every consumer onboarded since 4.2.0 learned the deprecated name from the docs rather than from legacy code, growing the migration burden #201 exists to retire. All six now carry an `**Events**` paragraph naming the event, its trigger, and its `detail` type, following the pattern `candor-autocomplete` already used; the three deprecated aliases are noted as deprecated in place, so the pages stay accurate while both events still fire. Docs only — no component behaviour changed (#215).

## [4.2.0] - 2026-07-12

### Added

- **`candor-table` `mono-columns` — monospace for codes read as text.** The table already had `numeric-columns` (mono + `tabular-nums` + right-aligned) for magnitudes, but no formalized way to set mono on the *other* character-position-load-bearing content the issue calls out — version strings, timestamps/dates, IDs, commit hashes, coordinates — which read left-to-right as codes and shouldn't be right-aligned. New `mono-columns` prop (zero-based column indices, JSON array) applies mono + `tabular-nums` at natural (left) alignment; a column listed in both resolves to `numeric`. Documents the governing rule on the Table story — mono is for *character position being load-bearing*, never flavour or a generic "technical content" signal (VISUAL-DESIGN.md §2) — and adds a "Mono columns" story using both props together so the code-vs-quantity distinction is copyable. No contrast change: mono cells keep `--color-text-default` on the same backgrounds, already covered by the `table-cell`/`table-cell-zebra` pairings (#116).

- **`candor-article` tip/note callout + reintroduced `--color-highlight-decorative`.** Article prose can now include a `.callout` element — an indigo-washed panel with a decorative indigo left border, for guidance the reader should act on (distinct from `<blockquote>`, which stays a burgundy-bordered italic pull-quote). The callout is upright, default-colour body text. This gives the previously-removed `--color-highlight-decorative` token (the original `#6969F7` indigo anchor) a real, previewable consumer, so it earns its place back per Candor's token-governance rule; it is flagged `usage: non-text` — a decorative border accent only, never a `color:` value. Adds `--color-callout-bg` (indigo wash, theme-aware) with the callout body validated at OKCA 9.9 light / 9.6 dark. Previewed in the Article → "Tip / note callout" story (#132).
- **`--color-bg-subtle` token — subtle interactive fill.** New background token for the quiet tint used by hover rows, selected items, and hover chips — the step between `--color-bg-surface` and `--color-bg-elevated` that was missing, leaving the background scale asymmetric with `--color-text-subtle` (which already has the subtle step). Theme-aware: one step *darker* than surface in light (`--gray-200`), a hair *lighter* in dark (`--gray-700`), so it stays visible on both the page and inside `bg-surface` panels. Resolves the silent-transparent footgun where consumers reached for the nonexistent `--color-bg-subtle` (by analogy to `--color-text-subtle`) and got a transparent fill with no error. Previewed in Design Tokens → Colors → Backgrounds (#174).
- **`candor-code` — inline code element.** New element that renders inline code with the `--color-bg-code` / `--color-text-code` token pair applied together (plus mono font, padding, radius, border). Removes a silent footgun (#170): `--color-bg-code` is a dark navy, so setting it on a raw `<code>` without also setting `--color-text-code` produced invisible dark-on-dark text. The font-size clamps to the 14px readable floor (`max(0.9em, var(--font-size-sm))`) so it never dips below the floor inside 14px prose. Inner `<code>` exposed as `::part(code)` (#170).
- **Consumer style hooks — `::part` and `--candor-*` custom properties.** Components previously exposed no way to override their internals; a consumer whose need ran past the built-in props had to fork. Two opt-in, additive hooks now exist (defaults unchanged): **custom properties** named `--candor-<component>-<knob>` for the bounded density/shape knobs (each defaults to its existing token), and **`::part`** on the meaningful internals for arbitrary restyle. Applied to the starter set — `candor-button` (`::part(button)`; `--candor-button-{padding-x,padding-y,font-size,min-height,radius}`), `candor-input` (`::part(input|label|hint|error-message)`; `--candor-input-{padding-x,padding-y,font-size,radius}`), and `candor-disclosure` (`::part(trigger|label|icon|panel)`; `--candor-disclosure-trigger-{padding-y,padding-x}`) — joining `candor-drawer`'s existing `--candor-drawer-size`/`-height`. The button knobs thread through every size, so a consumer can go denser than `size="small"` without a new size rung. Part names and custom-property names are public API (additions minor, renames/removals major); see Introduction → "Styling & overriding". More components gain hooks as demand surfaces (#165).
- **`candor-disclosure` trigger padding is now reachable.** The trigger's vertical padding could not be adjusted from outside the shadow root — when a disclosure was the first child of a padded container, its symmetric top inset stacked on the container padding and the only consumer workaround was a negative margin on the host. The padding is now reachable two ways: `--candor-disclosure-trigger-padding-y` for uniform density, and `candor-disclosure::part(trigger)` for the asymmetric case (`::part(trigger){padding-top:0}` removes only the top inset, leaving the bottom rule). Defaults are unchanged (#173).
- **`candor-autocomplete` — free-text input with non-binding suggestions:** a new form component, the web-component analogue of a native `<input list>` + `<datalist>`. The committed value is **always** the raw text the user typed; the `suggestions: string[]` are hints surfaced in a filtered popup, never a constraint — the user may pick one or type anything. Fills the gap between `candor-input` (free text, no suggestions) and `candor-combobox` (value *constrained* to a fixed option set). Follows the two-event rule (#164): `input` streams the live text, `change` fires the committed text on blur / Enter / suggestion-pick — both carrying a plain `string` (typed exports `CandorAutocompleteInputDetail` / `CandorAutocompleteChangeDetail`). Form-associated (`ElementInternals`), full ARIA combobox semantics (`role="combobox"`, `aria-autocomplete="list"`, `aria-activedescendant`), and no persistent dropdown caret so it reads as a text field that offers help rather than a menu you must pick from. Exposes the same consumer style hooks as `candor-input` — `::part(input|label|hint|error-message)` and `--candor-autocomplete-{padding-x,padding-y,font-size,radius}` (each defaulting to its token). The component doc includes a "which text control?" decision table (#167).
- **`@candor-design/web-components` consistent value events (DOM two-event rule):** value controls now emit events by the same rule the DOM uses, so there's nothing component-specific to memorise. **`change`** fires with the *committed* value on every value control (input, select, radio, checkbox, switch, slider, listbox, combobox, chip). **`input`** fires with the *live, mid-edit* value on the controls that have an editing phase — `candor-input` (per keystroke), `candor-slider` (per drag tick / arrow step), and `candor-combobox` (per filter-text keystroke), mirroring native `<input>` / `<input type="range">`. This converges the four historical value-changed names (`change`, `input-change`, `value-change`, `selected-change`) onto this rule. `candor-input`, `candor-slider`, and `candor-chip` keep emitting their legacy event with its original semantics so existing listeners keep working — deprecated, removed in the next major: `input-change` → `input` (live), `value-change` → `input` (live), `selected-change` → `change` (commit) (#164).
- **`@candor-design/web-components` published event types:** the TypeScript declarations now describe every component's events and `detail` shapes. New `events.ts` exports a `*Detail` type per event (e.g. `CandorSelectChangeDetail = string`, `CandorComboboxInputDetail = string`, `CandorChatInputSendDetail = { value: string }`) and a per-component `*EventMap` interface, re-exported from the package root. Consumers annotate handlers with a real type instead of grepping the minified bundle. `HTMLElementEventMap` is intentionally **not** globally augmented — `change`, `input`, and `toggle` already exist there as plain `Event`, and redefining them would mistype unrelated DOM code (#163).
- **`@candor-design/tokens` package entry points:** added `main`, `module`, `style`, and an `exports` map to the root `package.json` (the manifest published as `@candor-design/tokens`) so consumers can `@import "@candor-design/tokens/candor-tokens.css"` instead of the internal filesystem path `@candor-design/tokens/tokens/candor-tokens.css`. Previously `main`/`module`/`exports` were all `null`. Maps `.`, `./candor-tokens.css`, `./candor-tokens.min.css`, and `./candor-tokens.json` to their emitted paths under `tokens/` (#168).
- **`@candor-design/tokens/candor-fonts.css` — optional font convenience import.** `candor-tokens.css` only *names* the font families; it doesn't load them, so a consumer who forgot the Fontsource imports got a silent fallback to Georgia / system-ui with no error — every new consumer rediscovered this. The new opt-in stylesheet does the five Fontsource `@import`s (the exact faces the system was validated against, mirroring `src/styles.scss`), so setup is one line before the tokens: `@import "@candor-design/tokens/candor-fonts.css";`. The Fontsource packages are already runtime deps of the tokens package, so there's nothing extra to install; it requires a bundler that resolves bare `node_modules` specifiers in CSS `@import` (Vite, webpack, …). Tokens-only consumers who want to control font loading themselves simply don't import it — the manual path is unchanged. Emitted by `npm run build:tokens` and mapped in the `exports` map as `./candor-fonts.css` (#169).
- **`candor-drawer` non-modal mode:** new `modal` boolean attribute (default `true`, preserving current behavior). Set `modal="false"` for a non-modal side panel that coexists with the page — it opens via `dialog.show()` instead of `showModal()`, so there is no backdrop, focus is not trapped or stolen, and the rest of the page stays interactive (the full-viewport dialog layer is made `pointer-events: none` so only the panel captures clicks). For persistent assistants, inspectors, and filters that you work alongside (#166).
- **`candor-accordion-item` `toggle` event:** `candor-accordion-item` now dispatches a composed, bubbling `toggle` CustomEvent (`detail: boolean`, the new open state) when a panel expands or collapses — parity with `candor-disclosure`, enabling the "lazy-load panel contents on first open" pattern and consumer-side single-open coordination. The event name and detail type are published in the TypeScript declarations (`CandorAccordionItemEventMap` / `CandorAccordionItemToggleDetail`). Items remain independent by construction; single-open is coordinated at the consumer level via the new event (see the "Single-open (consumer-coordinated)" story) (#172).

### Fixed

- **`candor-drawer` `dismiss-on-backdrop="false"` is now honored.** The attribute could not be turned off from HTML: it used Lit's default `type: Boolean` converter, which is presence-based (any present attribute — including the string `"false"` — reads as `true`), so `dismiss-on-backdrop="false"` still dismissed the drawer on an outside click. Because the default is `true`, no attribute spelling could disable it; only the JS/`.prop` binding worked. This defeated the flag's purpose — it's the data-loss guard for "required action" flows where an accidental outside-click would discard unsaved work. Fixed with the same custom converter used for `modal` (`fromAttribute: (v) => v !== 'false'`), so `dismiss-on-backdrop="false"` now correctly suppresses backdrop dismissal (#181).
- **`candor-checkbox`:** fixed unresponsive taps/clicks on mobile (iOS/Android). The visually-hidden native `<input type="checkbox">` used `width: 0; height: 0`, which some mobile browsers exclude from hit-testing entirely — tapping the label or visible box silently did nothing. Switched to the standard 1px/clip-rect visually-hidden pattern (`width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap`), which keeps the input a real, laid-out (if imperceptible) element so it remains tappable while staying visually hidden (#110).
- **`candor-tooltip`:** the hidden bubble no longer contributes to the host's `scrollWidth`. It was `position: absolute; white-space: nowrap`, hidden only via `opacity: 0; visibility: hidden` — CSS properties that suppress paint but not layout, so the bubble's full (unwrapped) intrinsic width still counted toward the host's scrollable overflow region, and `left: 50%; transform: translateX(-50%)` centering pushed half of that leaked width past each edge of the host. In tight `min-width: 0` flex/grid containers this surfaced as a stray horizontal scrollbar on an ancestor scroll container even though the tooltip was never shown. The bubble now uses `display: none` when hidden (removing it from layout entirely) and fades via `@starting-style` + `transition-behavior: allow-discrete` — the same technique `candor-drawer` uses for its `dialog[open]` transitions — so the hover/focus opacity transition is unchanged. This also resolves `candor-toolbar` showing horizontal and vertical scrollbars when its direct children are `candor-tooltip` wrappers: the toolbar's `overflow-x: auto` row was reacting to the tooltip bubbles' leaked width, not a toolbar sizing bug (#107, #175).
- **Release tooling:** the root `version` npm lifecycle script no longer relies on POSIX `$npm_package_version` shell expansion, which broke every release cut from Windows (npm runs lifecycle scripts under `cmd.exe` there by default, where `$npm_package_version` is a literal string). Replaced with `scripts/sync-wc-version.js`, a small Node script that reads `process.env.npm_package_version` directly and spawns `npm --prefix web-components version` itself — behaves identically under `cmd.exe` and bash (#161).

## [4.1.0] - 2026-06-16

### Added

- **`candor-pagination` `compact` attribute** — opt-in compact layout (`‹ Prev · Page X of Y · Next ›`) that drops the numbered page buttons and ellipses for narrow viewports. Set it from a media/container query in a responsive app; defaults to `false` (the full numbered layout is unchanged). The "Page X of Y" position text is a polite live region, so screen readers announce the new page after Prev/Next. Prev/Next keep their existing disabled logic and `page-change` events (#152).
- **`--color-slider-thumb`** token — the slider handle fill, themed per mode (white in light, light grey `oklch(0.91)` in dark) so the thumb reads as a light puck in both themes. Non-text token (paired with `--color-border-control` for the edge).

### Changed

- **Tests (no consumer impact):** Rewrote `tests/accessibility.spec.ts` to target the web components — it now loads each story's canvas directly (`iframe.html?id=…&viewMode=story`) and uses shadow-piercing `candor-*` selectors instead of the dead Angular `app-*` locators on the Storybook manager page. Removed the two screenshot-only specs (`visual-regression.spec.ts`, `storybook-snapshots.spec.ts`) as redundant with Chromatic, the visual gate on every PR. Wired the suite into CI as a new `accessibility` job so the behaviour Chromatic can't see (keyboard / focus / ARIA) is gated on every PR (#148).
- **Tooling (no consumer impact):** Migrated the Storybook build harness from `@storybook/angular` to `@storybook/web-components-vite` and retired the Angular toolchain entirely (#143). Candor has shipped no Angular components since 3.0.0 — Angular survived only as the Storybook renderer for the framework-agnostic web-component stories. The 47 story files now render via lit-html (`render: (args) => html\`…\``) instead of Angular `template:` strings. Removed `angular.json`, the Angular bootstrap shell (`src/app/`, `src/main.ts`), the Angular tsconfigs, and the `@angular/*`, `@angular-devkit/build-angular`, `zone.js`, and `rxjs` dependencies. This dissolves the TypeScript 5 / Angular &lt; 22 version ceiling that blocked #141 and removes the bulk of the dev-time `npm audit` advisories (all of which traced through the Angular/webpack toolchain). The published `@candor-design/tokens` and `@candor-design/web-components` packages are unaffected.

### Fixed

- **`candor-alert`:** the `message` attribute now renders even when the element has whitespace between its tags (`<candor-alert message="…">\n</candor-alert>`). Previously `message` was the fallback content of an internal `<slot>`, which a whitespace-only child text node suppressed — rendering a blank alert body. `message`, when set, now renders directly; the slot is used only for projected content. (Surfaced by the #143 migration: Angular stripped insignificant whitespace text nodes, lit-html preserves them.)
- **`candor-menu`:** the checked-item checkmark is no longer rendered upside-down (it read as an upward caret). The `phCheckBold` icon path was vertically flipped; corrected so the tick points down-right.
- **`candor-toolbar`:** a full horizontal toolbar now scrolls within its own bounds on narrow viewports (`max-width: 100%; overflow-x: auto`) instead of overflowing the page. Items keep their natural size (`flex-shrink: 0`) so the row scrolls rather than squashing; roving-tabindex navigation already scrolls focus into view (#152).
- **`candor-data-grid` / `candor-tone-picker`:** the grid now scrolls horizontally within its own bounds on narrow viewports instead of overflowing the page.
- **`candor-toast`:** no longer overflows narrow viewports — `box-sizing: border-box` plus `min(…, 100%)` width caps keep the toast within its container so its text wraps.
- **`candor-slider`:** the thumb is now visible in dark theme. It previously filled with `--color-bg-page` and used a hard-coded black border/shadow, so in dark mode the handle became the page colour and disappeared. It now uses the themed `--color-slider-thumb` fill with a `--color-border-control` edge.

---

## [4.0.0] - 2026-06-05

### Breaking

- **Tokens:** Primitive color ramp `--purple-*` renamed to `--indigo-*` across all ten steps (`--indigo-50` through `--indigo-900`). The hue (H=278.14) is perceptually indigo, not purple. Consumers who reference primitive tokens directly (against the two-tier architecture recommendation) must find-replace `--purple-` → `--indigo-`. Semantic tokens (`--color-highlight`, `--color-highlight-decorative`, `--color-link-visited`) are unchanged and require no consumer action.
- **Tokens package:** `candor-article.css`, `candor-article.min.css`, `candor-blog.css`, `candor-blog.min.css`, `candor-syntax.css`, and `candor-syntax.min.css` removed from the `@candor-design/tokens` published package. These class-based stylesheets were outside the scope of a token package (CSS custom properties only); the `<candor-article>` web component is the canonical prose surface. No known consumers — if you were using these files, migrate to the equivalent `@candor-design/web-components` component or copy the source SCSS from `src/design-tokens/` in the repository.

### Added

- **`@candor-design/web-components` 4.0.0** — first published release of the Candor web components package. Ships 34 Lit 3 custom elements. Version aligned to `@candor-design/tokens` so a single version number describes the full design system. Separate npm package keeps Lit out of consumers who only need tokens.
  - **Custom elements:** `candor-badge`, `candor-alert`, `candor-card`, `candor-stat`, `candor-progress`, `candor-heading`, `candor-text`, `candor-accessible-text`, `candor-article`, `candor-button`, `candor-chip`, `candor-breadcrumb`, `candor-pagination`, `candor-toolbar` + `candor-toolbar-separator`, `candor-navigation`, `candor-input`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`, `candor-chat-input`, `candor-tooltip`, `candor-modal`, `candor-drawer`, `candor-toast` + `candor-toast-container`, `candor-tabs` + `candor-tab-panel`, `candor-accordion-item`, `candor-disclosure`, `candor-menu`, `candor-table`, `candor-data-grid`
  - Form controls use the `ElementInternals` API (`static formAssociated = true`) — values appear in `FormData`, constraint validation works, `:disabled` styling applies correctly
  - CSS custom properties pierce Shadow DOM boundaries — `candor-tokens.css` loaded once at the document level resolves inside all shadow roots; no per-component injection required
  - `candor-article` uses light DOM so prose styles reach projected content without the shadow boundary
  - Build: `npm run build:wc` — Vite lib build producing ESM (165 kB) and UMD (151 kB) bundles with TypeScript declaration files; `./tone-data` subpath export for tree-shakeable tone-picker data
- **`candor-article`:** `justify` attribute — enables full justification + hyphenation on `<p>` elements. Typographic transparency feature: the formal block-edge register marks AI-generated prose as a produced document without a label. Requires `lang` on the element or an ancestor for `hyphens: auto` to resolve hyphenation dictionaries.
- **`candor-stat`:** `size` prop — `sm` (25px), `md` (31px, default), `lg` (39px). Allows stat heroes to scale with layout context without hand-rolling font sizes.
- **`candor-input`:** `autocomplete` prop — forwards the `autocomplete` attribute to the inner `<input>`. `Password` story sets `current-password` by default.
- **`candor-modal`:** `alert` boolean prop — sets `role="alertdialog"` on the inner `<dialog>` for destructive confirmation patterns where the dialog requires an immediate response.
- **`candor-menu`:** `align` prop (`left` | `right`) — controls which edge of the panel aligns with the trigger. Icon-only trigger mode (no label, accessible via `aria-label`). Checked item support via `menuitemradio` for sort-by and single-select option groups.
- **`candor-tabs`:** Scroll arrow buttons appear automatically when the tab row overflows its container. Arrows advance by one tab per click; focused tab auto-scrolls into view on arrow-key navigation. Reduces dependence on horizontal scroll gesture discovery.
- **`candor-tone-picker`:** CIEDE2000 AT labels — each swatch announces its perceptual distance from the nearest named color in addition to its OKLCH coordinates. `show-labels` attribute renders the label text visibly beneath each swatch (developer/audit mode). `/tone-data` subpath export provides the underlying color-name dataset for consumers building custom pickers.
- **`candor-slider`:** CSS custom properties `--candor-slider-track-height`, `--candor-slider-thumb-size`, and `--candor-slider-gradient-height` exposed for consumer overrides without subclassing.
- **Tokens:** `--color-border-control-on-surface` — WCAG 1.4.11 compliant border color for form controls placed on `--color-bg-surface` backgrounds (the existing `--color-border-control` is validated against page background only).
- **Tokens:** Component-level CSS custom properties for drawer (`--candor-drawer-width-*`), modal (`--candor-modal-width-*`), and toast (`--candor-toast-width`) exposed for consumer sizing overrides.

### Removed

- **Angular reference component library** (`src/app/components/`, `src/app/examples/`) removed. It was an internal feature-parity benchmark; with WC parity confirmed it has served its purpose. **No consumer impact** — the Angular library was never published. `@candor-design/web-components` is the sole canonical component surface; Angular consumers use the framework-agnostic custom elements with `CUSTOM_ELEMENTS_SCHEMA`.
- **`@candor-design/tokens`:** `candor-article.css/.min.css`, `candor-blog.css/.min.css`, `candor-syntax.css/.min.css` removed from the published package (see Breaking above).

### Fixed

- **Tokens (WCAG 1.4.11 non-text contrast):** Light-mode status icon colors darkened to meet the 3.0 non-text floor against their tinted `-bg` backgrounds: `--color-status-success` → `oklch(0.55 0.15 144.2)` (OKCA 2.0 → 3.0), `--color-status-warning` → `oklch(0.54 0.16 53.54)` (OKCA 1.7 → 3.0), `--color-status-error` → `oklch(0.54 0.22 25)` (OKCA 2.9 → 3.0). The `-text` and `-bg` variants and dark mode are unaffected.
- **Tokens:** Remaining off-grid raw values snapped to the nearest spacing token across 10 components. Component-level `px`/`rem` literals replaced with `var(--spacing-*)`, `var(--border-width-*)`, and `var(--letter-spacing-*)` references.
- **Tokens:** Stale OKCA annotations corrected on dark-mode `--color-action-secondary-*` tokens.
- **`candor-drawer` (screen reader):** Closed drawer now sets `inert` on the host element — slotted light-DOM controls no longer appear in the accessibility tree when the drawer is closed.
- **`candor-tabs` / `candor-tab-panel` (screen reader):** Replaced cross-shadow-root `aria-labelledby` (which cannot cross shadow boundaries) with `aria-label` fed via a new `tabLabel` property. Tab panels now have accessible names.
- **`candor-radio`:** Mutual exclusion and arrow-key navigation now work correctly across shadow-DOM siblings. Each `candor-radio` is in its own shadow root so the browser cannot group shared-`name` inputs into a mutually exclusive set; the component implements both behaviors itself by querying sibling `<candor-radio name="…">` elements within the nearest `<fieldset>`.
- **`candor-progress`:** Host `aria-label` now forwarded to the inner `role="progressbar"` element via the `observeHostAriaLabel` helper, preventing a doubled accessible name.
- **`candor-table`:** Becomes a horizontal scroll container when content overflows narrow viewports. Numeric column alignment prop added (`numeric-columns`) — right-aligns specified columns for tabular figures.
- **`candor-badge`:** `md` size corrected to `--font-size-md` (16px) — was incorrectly using `--font-size-sm` (14px), which placed it below the readable floor for regular-weight text at that size.
- **`candor-button`:** All sizes now render at bold weight (700) — optical sizing (`opsz` axis) handles the visual refinement per size, removing an artificial weight inconsistency between sizes. `white-space: nowrap` added to prevent label text wrapping in constrained layouts.
- **`candor-input` / `candor-combobox` / `candor-listbox` / `candor-select`:** Hint text moved above the input following the GOV.UK Design System pattern — users encounter the hint before interacting with the field. Hint and error now coexist simultaneously (`aria-describedby` references both). `observeHostAriaLabel` wired on combobox, listbox, and select so `aria-label` on the host reaches the inner control without doubling.
- **`candor-input` / `candor-combobox`:** `setValidity()` wired for required constraint validation — `:invalid` pseudo-class and form validation APIs work correctly.
- **`candor-checkbox` / `candor-radio` / `candor-switch` / `candor-slider` / `candor-select` / `candor-combobox` / `candor-listbox`:** `setFormValue()` now called in `updated()` so initial and programmatic property changes register correctly in `FormData` without requiring a user interaction.
- **`candor-accessible-text`:** `size` prop made optional — role defaults (14px) are no longer silently overridden when size is omitted. Styles moved to `:host` selectors for accurate DevTools inspection.
- **`candor-accordion-item`:** Quiet variant now uses `font-optical-sizing: auto` + `GRAD -150` for visual weight differentiation, replacing the numeric `font-weight` step that felt engineered rather than designed.
- **Build (`@candor-design/web-components`):** `npm run build:wc` failed under Vite 7 when UMD and ESM entry points were combined. The main library and `tone-data` entry are now built in two separate Vite passes. The `./tone-data` subpath in the `exports` map now resolves correctly for consumers.

---

## [3.0.0] - 2026-04-20

### Breaking

- **Article:** CSS modifier `article--font-reading` renamed to `article--font-serif` — reflects the token it applies (`--font-family-serif`) and removes the false association with the `--font-reading` token (Noto Sans). Consumers using the framework-agnostic `candor-article.css` must rename the class on their wrapper elements (#93)
- **Article:** `ArticleComponent` `font` input values changed — `'reading'` → `'serif'`. The `ArticleFont` union type is now `'serif' | 'sans'`. Angular consumers must update `[font]="'reading'"` and `font="reading"` bindings (#93)

### Added

- **Chip:** `linkHref = input<string | null>(null)` — third interaction mode renders the chip as `<a>` when set. Mutually exclusive with `selectable` and `dismissible`. Includes visited, hover, and focus-visible styles; visited uses `--color-text-subtle-on-surface` (OKCA 4.6 on surface) not `--color-text-subtle` (OKCA 3.4 — fails Tier 2 bold at 14px on surface). New `Link` and `TaxonomyLinks` stories (#97)
- **Tokens:** `--letter-spacing-relaxed: 0.03em` — moderate tracking between `--letter-spacing-normal` (0) and `--letter-spacing-wide` (0.05em). Suited to small body text and captions where `--letter-spacing-wide` reads as over-spaced (#95)

### Documentation

- **CLAUDE.md:** Added mobile viewport check as step 5 in the design iteration workflow — switch to mobile1 (320 × 568) before closing any story work (#104)
- **CLAUDE.md:** New "Responsive Layout Patterns" section — intrinsic two-column grid (`repeat(auto-fit, minmax(min(100%, 240px), 1fr))`) and flex child text overflow fix (`min-width: 0` + `overflow-wrap: break-word`) (#102, #103)
- **Article CSS:** Expanded `candor-article.css` usage comment — modifier listed as required (not optional), disambiguation note that `article--font-serif` applies `--font-family-serif`, not `--font-reading` (#96)
- **tokens/README.md:** Font `@font-face` naming hazard — `'Noto Serif'` and `'Noto Sans'` must be used exactly; appending "Variable" produces a silent fallback with no console error (#94)
- **tokens/README.md:** Article end-of-content spacing guidance — minimum `--spacing-3xl` (6rem) bottom padding recommended for long-form reading contexts (#99)

---

## [2.3.0] - 2026-04-15

### Added

- **Toolbar:** New `app-toolbar` component — `role="toolbar"` container implementing the APG Toolbar pattern. Single tab stop with roving tabindex; Left/Right (horizontal) or Up/Down (vertical) arrow keys navigate between controls; Home/End jump to first/last. Includes `app-toolbar-separator` for visual group dividers. Stories cover formatting buttons, toggle buttons (`aria-pressed`), separators, vertical orientation, and data-table action bar (#27)
- **Tokens:** `--spacing-2xs: 0.25rem` (4px) — compact UI contexts: table cells in compact mode, icon nudges, tone-picker cell padding (#48)
- **Tokens:** `--hit-target-aaa: 2.75rem` (44px) and `--hit-target-aa: 1.375rem` (22px) — WCAG 2.5.5 AAA/AA touch target size tokens, under a new `Interaction` section alongside focus-ring tokens (#48)
- **AccordionItem:** `variant` input (`'default' | 'subtle' | 'quiet'`) — expresses heading hierarchy in nested accordion groups. `subtle`: regular weight, subtle colour; `quiet`: regular weight, `--font-size-sm`, subtle colour (#48)

### Fixed

- **Tokens:** Dark-mode `--color-action-primary` chroma boosted from C=0.05 → C=0.12 (`oklch(0.79 0.12 245)`). The `navy-*` scale is intentionally low-chroma — appropriate for the dark charcoal primaries in light mode, but at L=0.76 C=0.05 the button reads as muted gray-blue rather than a confident CTA. The new value is clearly perceptible as blue without changing hue or breaking contrast (text 5.5:1, button-on-page 6.9:1 ✅). Hover/active updated to `oklch(0.87 0.08 245)` for consistency (#76)
- **Card:** Footer now uses `--color-text-subtle-on-surface` (validated against `--color-bg-surface`) instead of `--color-text-subtle` (page-only). Footer font-size reduced to `--font-size-sm` to distinguish secondary content from body prose. Header gains `font-optical-sizing: auto` to activate Roboto Flex's optical-size axis (#20)
- **Modal:** Close button replaced with `app-button variant="ghost" size="small"` — hover, active, and focus ring now drawn from `ButtonComponent` tokens. Removed hand-rolled `.modal__close` SCSS block (#83)
- **Card:** Removed `overflow: hidden` from `.card` — was clipping sticky children (`<thead>`, sticky toolbar, sticky alert bar inside a card). Border-radius renders correctly without it in modern browsers (#48)
- **Tokens:** Clarified `--color-toast-message` dark-mode comment — the intentional subtle dimming on dark backgrounds is documented inline to prevent silent substitution with `--color-text-default` (#48)
- **Tokens:** Color re-audit (#14) — full OKCA validation against the OKCA Contrast Guidance scale. 7 failing pairs corrected; 14 other pairs confirmed passing. 14px token usage constraint documented
- **Examples:** Six example stories made mobile-responsive — fixed widths, hard 2-column grids, and missing scroll affordances corrected (#100)

### Documentation

- **Card:** Component-level prose covering three integration patterns: light-mode surface layering, slot style encapsulation, and `ViewEncapsulation.None` (#48)
- **Article:** `:visited` link indicator — double underline via `border-bottom` technique (#19)
- **Visual Design guidance:** New `docs/VISUAL-DESIGN.md` (#8)
- **Conscience:** New `docs/CONSCIENCE.md`
- **Docs:** Archived six internal/superseded documents to `docs/archive/` (#16)
- **Toast:** Message text bumped from `--font-size-sm` (14px) to `--font-size-md` (16px) for Tier 1 contrast compliance
- **A11Y:** Corrected over-aggressive 14px contrast audit — OKCA two-axis tier system applied correctly

---

## [2.2.0] - 2026-04-13

### Added

- **Pagination:** New `app-pagination` component — `<nav aria-label="Pagination">` with previous/next buttons and numbered page links. Current page receives `aria-current="page"` and filled accent treatment. Ellipsis collapses large page ranges, keeping first, last, and current ± 1 always visible. `currentPage` is a two-way bindable `model<number>`; `ariaLabel` input for multiple paginators on the same page (#26)
- **Disclosure:** New `app-disclosure` component — single show/hide toggle following the APG Disclosure pattern. Button carries `aria-expanded` and `aria-controls` wired to its content panel; caret rotates 180° on open. `open` is a two-way bindable `model<boolean>`. Suitable for FAQ lists, expandable filter sections, and "read more" patterns (#25)
- **Listbox:** New `app-listbox` component — custom select alternative using `role="listbox"` + `role="option"`. Trigger button shows selected value with `aria-haspopup="listbox"` and `aria-expanded`; dropdown uses `aria-activedescendant` to track keyboard focus without moving DOM focus from the listbox. Full keyboard contract: ArrowDown/Up, Home/End, Enter/Space to select, Escape to close, Tab to close, 500ms typeahead by first character. Disabled options, error/hint with `aria-live`, `ControlValueAccessor` for Angular forms. Label, placeholder, required, hint, and error inputs match `app-select` API (#23)
- **Drawer:** New `app-drawer` component — slide-in panel anchored to a viewport edge. Uses `<dialog>` for native focus trapping and Escape key handling. `position` input supports `right` (default), `left`, and `bottom`; `size` controls panel width (or height for bottom sheets). Entry animation via `@starting-style`; `prefers-reduced-motion` disables it. Emits `(closed)` on close-button click, Escape, or backdrop click. `dismissOnBackdrop` input can disable backdrop dismissal (#51)
- **Tabs:** Added `orientation="vertical"` variant. Tab list renders on the left with a right-edge active indicator; panels fill the remaining space. Keyboard navigation uses ArrowUp/Down in vertical mode; `aria-orientation` set on the tablist. Suited to settings panels and sidebar navigation (#52)
- **Combobox:** New `app-combobox` component — text input + filterable listbox dropdown implementing the APG `list` autocomplete pattern. `role="combobox"` on the input with `aria-expanded`, `aria-controls`, and `aria-activedescendant`; DOM focus stays on the input throughout. Filters options by substring match as the user types; shows all options when the field is empty. Keyboard: ArrowDown/Up navigate options, Enter selects the active option (or sole remaining match), first Escape closes the dropdown, second Escape clears the input, Tab closes. Clear button replaces the caret when text is present. `ControlValueAccessor` for Angular forms; API matches `app-listbox` (#24)

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-23

### Fixed
- README rewritten for npm registry — leads with install/usage, documents all token categories with real property names and contrast ratios
- Bundler `@import` example correctly labelled (not SCSS `@use`)

### Added
- `LICENSE` file (ISC)
- `CHANGELOG.md`
- `release:patch/minor/major` npm scripts for safe version management

## [1.0.0] - 2026-03-23

### Added
- Initial public release of `@candor-design/tokens`
- CSS custom properties for color (OKLCH), typography, spacing, and shape tokens
- Dark mode support via `prefers-color-scheme` and `[data-theme]` attribute
- Minified CSS and JSON exports alongside the full stylesheet
- GitHub Actions publish pipeline with OIDC trusted publishing (no `NPM_TOKEN` required)
