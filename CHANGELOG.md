# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- **Both packages' `homepage` now points at the component catalog** rather than at the GitHub README (#267). `homepage` is what the npm registry page renders, what `npm home` opens, and what tooling reads when it wants "where are the docs" — pointing it at a README that then links the catalog put the one hop an automated reader is least likely to take between a consumer and the rules.

- **Both READMEs now have a Documentation section that says what the packages are *not*.** The pointer that existed was a single line reading "Browse components", which describes a demo gallery; what is behind it is the usage rules, and those are the part that cannot be inferred from the package at all. The new section states plainly that the packages ship API surface only, names the questions the catalog answers and the package cannot, and records three facts about the web-components API that a declaration file structurally cannot express — that components emit `change` and `input` but never `changed`, that `candor-button` dispatches no custom events, and that there is no `size="icon"`.

  The failure this addresses is not only "a consumer misses a rule" but "a consumer concludes the rule does not exist" — an exhaustive search of `node_modules` producing a confident wrong answer. One explicit sentence converts *I found nothing* into *I have not looked yet*.

  Deliberately **not** done: vendoring the catalog into the tarball, or restating the rules in the README. Both create a second source of truth that will desync, which is the problem this release is fixing rather than one to add to.

- **The root README's Storybook section now leads with the hosted catalog URL** instead of only clone-and-run instructions.

### Added

- **`npm run audit:docs` gates the README's claims about the component surface against what `src/` actually registers (#267).** Checks the tag table in both directions and every prose count. Runs in CI in the `audit` job — an existing *required* status check, so it blocks on merge rather than only reporting.

  **The drift it was filed for turned out not to be drift.** Three counts were in circulation at 5.0.1 — "37 custom elements" in README prose, 40 tags in that same README's table, 41 in issue #257's title, the last having already propagated into a consumer's own notes. But **37 and 40 are both correct**: there are 37 component source files and 40 registered custom elements, because `candor-tabs`, `candor-toast` and `candor-toolbar` each register a companion element. The obvious fix — 37 → 40 everywhere — would have broken the hook-coverage measurements in `CLAUDE.md` and `Introduction.mdx`, whose denominator is components and whose parts sum to exactly 37.

  So the defect was never a stale number; it was that "component" and "custom element" were used interchangeably, leaving nobody able to say which number a sentence was asking for. Both nouns are now used precisely, and the check validates each claim against the count its own noun names. The 41 is reproducible as `grep -c "@customElement('candor-"` over `src/` — the extra match is `candor-foo` in a doc comment in `utils/host-aria.ts`, so the scan reads decorators anchored to the start of a line, the same rule the `12px-ok:` marker and `check-package-deps.js`'s `@import` handling already follow: prose that demonstrates a syntax must not be read as an instance of it.

  Verified by tripwire in three directions — a stale count, a registered tag missing from the table, and a table tag that is not registered. A fourth fired during development and is worth recording: the count pattern read "Lit 3 custom elements" as a claim of *three*, producing a failure indistinguishable from a real one.

## [5.0.1] - 2026-08-05

### Fixed

- **`@candor-design/web-components` now declares its `culori` dependency, and `@candor-design/tokens` no longer ships the TypeScript compiler (#254).** Two mistakes that had been cancelling each other out.

  `web-components/dist/tone-data.js` — the `./tone-data` entry point — contains a bare `import … from "culori"` by design (`external: ['culori']`, so consumers who already use culori don't get a second copy). But the package declared **no dependencies at all**, so that import resolved only because `@candor-design/tokens` carried `culori` in *its* runtime dependencies, where it did not belong. Verified by negative control: with culori absent, `import '@candor-design/web-components/tone-data'` fails with `ERR_MODULE_NOT_FOUND`. Removing it from `tokens` without this fix would have published a broken entry point.

  `@candor-design/tokens` ships `files: ["tokens"]` — four CSS/JSON artifacts — and declared ten runtime dependencies. `typescript`, `lit` and `tslib` moved to `devDependencies`; `@standard-schema/spec` was removed outright (its only occurrence anywhere in the repo was its own `package.json` line). The five `@fontsource*` entries stay: `candor-fonts.css` `@import`s them by bare specifier, so a consumer's bundler must resolve them. A clean install of both packages now resolves to the five font packages plus culori, with no compiler.

  Also corrected: the tone-picker story described culori as "a peer dependency of the `/tone-data` entry point" — nothing declared such a peer — and said the CIEDE2000 labels were "computed at build time", when `buildGamutRows` runs at module top level and computes them on import.

- **Added `npm run audit:packaging`, gating what the published packages declare against what their built artifacts reference.** Runs in CI in the `build-web-components` job, after `build:wc`, since it reads the gitignored `web-components/dist`.

  Two directions, because the bug had two halves: **undeclared** (a bare specifier in a published artifact that no manifest declares — breaks a consumer's install) and **unused** (a declared runtime dependency no published artifact references — how a compiler ends up in a stylesheet's dependency tree). `peerDependencies` are exempt from the unused check, since a peer is a claim about consumer coordination rather than about what the bundle imports. Verified by tripwire in both directions.

  This is the gap that let #254 exist: `build:tokens` validates the artifacts, `audit:*` validate colour, `typecheck` and `test:playwright` run against source — **nothing read a manifest.** And an undeclared import cannot fail locally, because this repo hoists every package into one `node_modules`; it surfaces only in a clean install somewhere else. No allowlist, per the `audit:tokens` precedent — inspection found no legitimate exception in either direction.

### Fixed (tooling)

- **The `chromatic` CI job no longer runs on Dependabot pull requests.** GitHub withholds repository secrets from Dependabot-triggered runs, so the job could only ever fail there with `✖ Missing project token`, ~15 seconds in, having snapshotted nothing — a red check reporting on the absence of a credential rather than on the bump. It was never blocking (`chromatic` is deliberately not a required status check), but a column that is always red for a reason unrelated to the change is a column people learn to skip.

  Recorded alongside the skip, because the skip alone would be a hole: `autoAcceptChanges` is true on `main`, so a Dependabot PR merged directly would have its rendering changes adopted as the new baseline with nobody having reviewed them. The policy the skip depends on is that **Dependabot PRs are notifications** — updates land through a human-authored batch PR, where the secret exists and the visual diff gets a real review. A Dependabot-scoped copy of the token was considered and rejected: `npm ci` runs dependency install scripts in that same job, so a compromised version of any transitive dev dependency — precisely what these PRs change — would execute next to a write-scoped project token.

### Changed (tooling)

- **Dev-dependency updates batched:** Storybook 10.3.5/10.4.4 → 10.5.6 (`storybook`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-themes`, `@storybook/web-components-vite`), `@chromatic-com/storybook` 5.1.2 → 5.2.1, `@playwright/test` 1.59.1 → 1.62.1, `vite-plugin-dts` 5.0.0 → 5.0.3. Supersedes Dependabot #251, #205 and #204. Verified: `typecheck`, `audit:tokens` (180 colours in gamut, artifact unchanged), `audit:contrast` (238 enforced pairings, 0 failing, no drift), `test:playwright` (28/28), `build:tokens`, `build:wc`, `build-storybook`, `npm audit` 0 vulnerabilities. `typescript` 5.9.3 → 7.0.2 (#203) is deliberately not in this batch — a major belongs in its own PR.

## [5.0.0] - 2026-08-05

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

#### `--color-border-control-on-surface` removed; `--color-border-control` re-authored to be safe on every background

**Before:** `--color-border-control` (L 0.56) cleared WCAG 1.4.11's 3:1 on `--color-bg-page` and missed it on `--color-bg-surface`. Consumers were expected to set `--color-border-control: var(--color-border-control-on-surface)` on any container hosting form controls over a surface fill.

```css
/* every surface container that held a form control */
.panel { background: var(--color-bg-surface); --color-border-control: var(--color-border-control-on-surface); }
```

**After:** one token, no override. `--color-border-control` is L 0.53 in light (OKCA 4.4 on page, 3.3 on surface) and L 0.58 in dark (3.9 on page, 3.2 on surface) — above the floor on either background.

```css
.panel { background: var(--color-bg-surface); }
```

**Why:** the override was a correctness property delegated to whoever remembered a documented rule, and the repo remembered it once out of twice. The colour-iterator example shipped four radios and two checkboxes on a surface container at OKCA 2.8, and `candor-switch`'s off-state thumb sits on a track that paints its *own* `bg-surface` fill — so that one was below the floor in every consumer, on every page, with no container the consumer could have fixed it on. A second token whose existence means "the first one is unsafe here" is the failure mode, not the fix (#217).

The new value is deltaE 3 from the base it replaces and deltaE 3 from the sibling it absorbs — imperceptibly between the two colours it supersedes, so this buys the correctness at essentially no visual cost.

**Migration:** delete the `--color-border-control` override from any surface container; the default is now correct there. Any direct use of `--color-border-control-on-surface` becomes `--color-border-control`.

### Added

- **`audit:contrast` runs in CI, in the same job as `audit:tokens` and after it.** This supersedes the note on the `audit:contrast` entry further down, which recorded it as deliberately unwired while #208 and #209 were still open; both are now closed, so the reason has expired. The `gamut` job is renamed `audit` and gains the step (#211).

  **The step order is the substance of this change, not its arrangement.** `audit:contrast` reads `audit/tokens.dtcg.json` off disk, so on its own it measures the *committed* artifact rather than the tokens in the working tree — which means two parallel audit jobs would have produced a false green. Verified by tripwire rather than assumed: lightening `--color-text-subtle` to `oklch(0.70 0 0)` without re-exporting leaves `audit:contrast` printing `✓ no drift` at exit 0 while 19 real violations sit in the tree — nine pairings measuring 2.1 against a 4.5 floor, the token's own recorded figure, and the story that quotes it. Re-exporting first fails the same tree with all 19 named. So the two audits are sequential steps in one job, and the finer red/green signal that splitting them would buy is bought by breaking the check — the #218 shape one level up from the scripts: a guard that passes because it measured the wrong thing.

  **The checks are now required, which they were not before.** Wiring a job into CI and having it block a merge are different things, and only the first had been true: the required-status-check list on `main` held `build-tokens (20)` and `build-tokens (22)` and nothing else, so `audit` could go red and the PR would merge regardless. Adding `audit:contrast` to a non-blocking job would have reproduced the gap it exists to close — the same claimed-versus-actual guarding failure as the rest of this release, one level up from the scripts. `audit`, `typecheck` and `accessibility` are now required alongside the two `build-tokens` jobs, with `strict: true`. `chromatic` is deliberately left out: a visual diff needs a human to accept it, so requiring it would convert every intentional design change into a blocked merge. Note the ceiling — `enforce_admins` is `false`, so an admin merging past a red check is now deliberate rather than silent, which is the useful property but is not a wall.

- **`npm run audit:tokens` now gates the sRGB gamut invariant.** The export fails, before writing anything, if any `oklch()` literal in `src/design-tokens/*.scss` falls outside sRGB — printing the offending declaration with its file and line, and the in-gamut value to use in its place. Two details that would otherwise bite are handled: it rounds chroma **inward** rather than to nearest, because the in-gamut maximum sits exactly *on* the boundary and 2dp nearest-rounding pushes roughly half of these values straight back out; and it discovers stylesheets by listing the directory rather than from a hardcoded list, so `syntax.scss` is covered despite not being in the DTCG artifact — six of its ten tokens were out of gamut. The gate lives here rather than in `check-contrast.js` because gamut is a property of a *token*, not of a pairing: this script sees every declaration, while the contrast audit only ever sees colors someone remembered to add to `pairings.json`. Pass `--skip-gamut` to export without klar installed (#225).

- **`role_="state"` on `candor-accessible-text`** — a fifth role for outcomes that have already happened. Renders an `aria-hidden` tone icon (`success` / `warning` / `error` / `info`) beside the text, coloured from the `--color-status-*` non-text tokens while the text itself stays `--color-text-default`. Screen-reader users get the outcome from the wording, so each line must still read correctly on its own — "All responses processed", not "Done" (#213).

- **`audit:contrast` now enforces the 14px text floor**, which was stated in five places and enforced in none. The check lives in the *contrast* audit rather than a typography linter for a specific reason: 12px is classified decorative in **both** axes of the tier table, so no OKCA floor is defined for it, so `pairings.json` contains zero size-12 entries. Setting `--font-size-xs` on a piece of text therefore removed it from contrast auditing altogether, silently, with nothing recording that it had happened — the #218 shape again, and the direct reason #229 sat unnoticed. The audit now reports its own blind spot.

  Any sub-14px `font-size` in `src/` fails unless it declares a reason the audit recognises (`badge-chrome`, `icon`) in a `12px-ok:` marker on the declaration or up to three lines above it. Free text is rejected exactly like a missing marker, so the assertion cannot degrade into a comment. The marker must also **open** a comment rather than merely appear in the text — because the type-scale story documents this syntax in rendered copy, and a looser match would have let that documentation authorise a real violation three lines away. Absolute literals (`font-size: 0.75rem`) are caught alongside the token, so hard-coding is not a way around it. **Known limit, stated rather than left to be assumed:** relative units cannot be resolved statically, so `0.9em` is not judged — Candor has one such site, at 14.4px (#230).

- **Event names are now type-checked (#236).** Each component declares `addEventListener` / `removeEventListener` overloads built from its own `*EventMap`, so `el.addEventListener('tab-change', …)` is a compile error instead of a listener that silently never fires, and `detail` is typed without a cast. Native events keep their native types. Previously the 23 exported `Candor*EventMap` interfaces described the event surface but nothing enforced it — `addEventListener`'s signature is `(type: string, …)`, so there was nothing to check the name against. That is a CSS-shaped failure mode on a code-shaped API, and it is what made every rename above invisible to a consumer's build. Reaches ordinary code, not only consumers who hand-annotate, because each component already augments `HTMLElementTagNameMap`. Two deliberate limits: framework template bindings (`@change=`, `(change)=`) do not go through this signature, and dispatching your own custom event on a Candor element needs a widening cast — `(el as HTMLElement).addEventListener(…)` — since omitting a permissive fallback overload is what produces the error at all. `candor-button` carries an intentionally empty map: "emits nothing, use the native `click`" is a statement about the API, and declaring it is what makes a listener on the removed `clicked` an error rather than dead code.

- **`npm run typecheck` and a `typecheck` CI job (#238).** Nothing ran `tsc` — Vite transpiles without checking and `build-storybook` does not check either — so type errors sat in the working tree unread. This also makes `tests/event-types.test-d.ts` a real gate: that file has no runtime, `tsc` is its assertion, and its `@ts-expect-error` directives fail the build in both directions, so an overload that stops rejecting a removed name breaks CI rather than passing quietly.

- **`npm run audit:contrast` — a contrast drift check.** New `scripts/check-contrast.js` re-measures the repo's contrast claims against klar and fails when reality and the record disagree. Two independent passes: every pairing in `audit/pairings.json`, in both modes, against its `min` floor (212 enforced, 4 exempt); and every OKCA figure written into a token comment, against that token's current value. Claims are read with an explicit grammar — `[<fg>] OKCA <n> on <bg>`, with a leading `was` marking a superseded figure — and anything it cannot interpret is printed as `UNCHECKED` rather than passed over, because a guard that silently covers a subset reads as validation when it isn't (the failure mode filed as #218). It also skips dark-mode claims on tokens the dark mixin doesn't redeclare, since those comments were authored about light and inheriting one doesn't make it a dark measurement. It is deliberately **not** wired into CI yet: it currently exits non-zero on the two genuine failures tracked in #208 and #209, and an allowlist to paper over them would be the same defect it exists to catch (#211).

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

- **`npm run audit:contrast` now requires klar 3.x, and measures the colour Candor specifies.** klar 2.x resolved every colour through an 8-bit hex round-trip and silently substituted a different colour for out-of-gamut input, so it reported figures for colours nobody had asked about — `oklch(0.79 0.22 25)` was scored as `#ff938b` while klar's own swatch on the same line showed `#ff746f`. Fixed upstream in klar 3.0.0 (pawn002/klar#9, reported from this repo). `scripts/check-contrast.js` now pins `3.x` and, deliberately, does **not** pass `--allow-out-of-gamut`: klar exits 1 on such input, and that failure is surfaced with a pointer to the gate rather than suppressed. OKCA is established across the sRGB gamut, so a score for a colour outside it is undefined rather than merely optimistic, and producing one would put a meaningless figure in a report whose whole job is to be trustworthy. Gamut itself is enforced at the token layer (#225), where it belongs: it is a property of a token, not of a pairing, and this script only sees colours someone remembered to add to `pairings.json`. `audit/pairings.json` is unchanged — it records `min` policy floors, not measurements (#221).

### Fixed

- **Form-control boundaries are now measured, not assumed (#217).** `audit/pairings.json` held **zero** entries for any border token, so the one colour that draws the edge of `candor-input`, `select`, `combobox`, `autocomplete`, `listbox`, `chat-input`, `checkbox`, `radio`, `switch`, `slider` and `menu` carried no floor at all — its figures lived only in a comment. Four pairings added at WCAG 1.4.11's 3.0: the boundary on page and on surface, the switch's off-state thumb against its own track, and the slider thumb against the page (recorded separately because *which* background carries it is the load-bearing claim there — the thumb is 22px on a 4px track, so its outline falls mostly on the page). `--color-border-strong`'s annotation is corrected too: its dark comment asserted 1.4.11 compliance as if it were a property of the token, while the same token measures a third of that in light.

- **Three counts that described the repo as it used to be (#197, #246).** `CLAUDE.md` claimed `audit/pairings.json` held "108 pairings / 216 measurements"; it holds **121 / 238**, and it drifted *during this release* — the work that added the pairings left the sentence describing them untouched. Both numbers are computable from the file, so it now reads as a figure with a date rather than a fact, with a note to count rather than quote.

  `docs/ACCESSIBILITY-CONFORMANCE.md` said "34 Lit custom elements"; there are **37**. Deliberately not a number bump: raising a count inside a conformance statement asserts that the components it newly covers meet the bar the paragraph states. `candor-tone-picker` is AT-audited and passing and `candor-code` is non-interactive inline text, but **`candor-autocomplete` has had no AT walkthrough** — a full ARIA combobox with keyboard navigation and a live-region status, which is exactly the shape that needs one. It is counted in the surface and **explicitly excluded** from the validated-by-construction claim until it is audited.

  `CLAUDE.md` also said "every component exposes two opt-in hooks", which described **4 of 37** (5 have a `::part`, 9 a `--candor-*` property, 27 neither) while the governance paragraph below declared those names public API with semver obligations — so it read as a maintained surface that did not exist. `src/Introduction.mdx` already stated this correctly and became the model rather than being changed to match, gaining the **six shipping, semver-protected hooks it had been omitting**: `candor-code::part(code)`, and custom properties on `slider`, `modal`, `toast` and `data-grid`. `--candor-modal-max-width` and `--candor-toast-max-width` are ones a consumer would go looking for and conclude did not exist. No hooks were invented for the other 27: a part name without a use case is a public-API commitment made blind, which is #213's `redundant-channel` argument applied to a different column.

- **The destructive button's label failed its floor in the placement it is most used in (#224).** `candor-button`'s destructive variant is outlined — `--color-action-destructive` is `transparent` — so its effective background is whatever sits behind it. It was validated against `--color-bg-page` only, and in dark mode measured **3.9 on `--color-bg-surface`** against a 4.5 floor: a delete confirmation inside a modal or card, which is where delete confirmations live. Dark `--color-action-destructive-text` steps L 0.75 → 0.78 (OKCA 5.6 on page, 4.7 on surface; deltaE 3, at the edge of imperceptible), and `-border` moves with it to keep its "matches text" annotation true. Light mode already passed both (9.3 / 6.9) and is unchanged.

  Coverage rather than a patch: `secondary` and `ghost` are transparent-filled too and had the same single-background validation. Both pass with margin (light 10.3 / 8.6, dark 6.1 / 10.7), and both now carry `-on-surface` pairings anyway — coverage that happens to be right is not coverage. 114 pairings → 117.

  Also corrects `weight` on **five** button pairings. `.button` sets `font-weight: var(--font-weight-bold)` for every size and variant — there are exactly two `font-weight` declarations in the component and both are bold — but five entries recorded `regular`, and two notes described a medium-base/bold-small hierarchy the component has not had since #131. Invisible to the audit because at 16px Tier 2 bold and regular share the 4.5 floor, which is the documented limit of the tier cross-check: it only bites on the 14px row.

- **Six token comments held contrast figures that no check could see, because the export discarded them (#224).** #217 taught `export-tokens-dtcg.js` to capture a comment sitting *above* a declaration, but kept `trailing || leading` — so on the 17 declarations carrying both, the leading comment was dropped. Six of those held a contrast figure, which was therefore not `UNCHECKED` but *absent*, with nothing recording that it had ever existed. Both comments are now concatenated, taking the audit from 49 re-measured figures to 59.

  One had been wrong for as long as it had been invisible: `--color-action-primary`'s dark comment credited the button label as gray-800 at OKCA 5.6, but the label stopped being gray-800 when `--color-text-on-action` moved to the bg-page navy — precisely because 5.6 fails the 14px bold floor of 6.5. It measures 7.0. That token's own comment records the change correctly and is audited, so the stale line was a duplicate of a fact already held properly; it is deleted rather than corrected, because a figure restated in two places is a figure that will desync. The other five were accurate, just unverified — including a `--color-toast-message` range (`OKCA 5.5–5.8` across three status backgrounds) that the grammar cannot express and which is now written out per background.

- **A figure written without the `OKCA` keyword is now reported instead of ignored (#224).** `9.3 on page` is unmistakably a contrast claim to a reader and matched nothing in the parser, so it was passed over in silence — the one failure mode `UNCHECKED` exists to prevent. Found by committing it: both destructive comments were annotated `OKCA 9.3 on page ✅, 6.9 on bg-surface ✅` while fixing the issue above, and the only signal that two unverified claims had entered the repo was the audit's figure count going *down* by one, because the comment being replaced had used the full grammar and had been checked. Near-misses are reported, never parsed — inferring the colour a bare number refers to is how a guard reports a figure about the wrong colour. Two guards keep it off ordinary prose, both added after real false positives: the number must not follow `-`/word/`.` (so `navy-800 on white page` is a name), and it must fall inside OKCA's actual 1–20.9 range (so `L=0.75 on page` is not a reading).

- **The chat example taught a lightness rule that was wrong in both modes, from colours no display can render (#219).** The AI chat story walks a consumer through deriving brand ramps in OKLCH, in code blocks with a Copy button — so it is not illustration, it is a recipe. All **six** `oklch()` samples it handed over were outside sRGB: it specified `C 0.20` at hue 250, where the gamut holds 0.09–0.15. Under #225 those values name no colour at all, which makes them a worse defect than the ratios they carried, and is not what the issue was filed for.

  The thresholds were wrong too, and the dark one badly. `L ≤ 0.55` on white measures **OKCA 4.0** against a 4.5 floor; `L ≥ 0.60` on the dark page measures **OKCA 1.9**, and the first sample built to it measures 3.9. The real ceilings at that hue are `L ≤ 0.52` and `L ≥ 0.74`. But the correction is not the numbers: the story's load-bearing sentence was "below that threshold, any reasonably saturated hue gives you the headroom", and that claim cannot be true in either direction. Contrast is bought with lightness, the gamut narrows as lightness leaves the middle, so chroma is not an axis the reader gets to hold constant while moving the other. Both answers now state that dependency, give in-gamut samples with measured OKCA, and hand over the `klar find` invocation so the reader derives their own hue instead of borrowing a number that was only ever about azure.

  The dark-mode chroma taper had been explained purely as taste — "prevent the neon quality". It is also forced: sRGB holds C 0.12 at L 0.76 and 0.07 by L 0.85, so the taper you *must* apply is steeper than the one you would choose. Presenting a gamut boundary as a style preference is what let the samples cross it. The question was also reframed from "pass WCAG AA" to Candor's floor, with one paragraph on the relationship — OKCA is at or below the WCAG 2.x figure across all 216 audited pairings, so it binds first, and the gap is widest on dark backgrounds, which is exactly where this story went furthest wrong.

- **`oklch()` literals are now story anchors, which puts teaching samples inside both audits (#219).** Story figures must name the colour they describe, and the anchor grammar recognised a `--custom-property` or a `#rrggbb` literal. A worked example defines its own tokens — `--color-brand` is not a Candor token and resolves to nothing — so the most instructive figures in the repo were structurally unanchorable, and the chat example's were consequently unchecked for as long as they had existed. An `oklch()` literal is the strongest anchor of the three, since it *is* the colour rather than a reference to one. Story figures go from 12 re-measured to 22. It carries the gamut invariant in with it at no extra cost: klar exits non-zero on unrenderable input, so a sample outside sRGB can no longer have a figure recorded against it — a partial reach into #228, whose gate still stops at `src/design-tokens/`.

  Near-miss detection (above) is extended to story prose in the same pass. There are no instances today; it is added because "checked in token comments, unchecked in story prose" is the half-covered guard this release exists to stop shipping. Tripwired in both directions — dropping the `OKCA` keyword from one story figure takes the count 22 → 21 and names it.

- **`candor-data-grid` cell labels render at 14px and have a contrast pairing for the first time.** `.data-grid__cell-label` is consumer content — the visible text in every gridcell, and the same string the cell exposes as its accessible name — but was set at 12px, which meant it could not meaningfully be audited at all. It is the text #229 found unreadable at OKCA 2.7, and it had no pairing while the three headers around it did. Note the boundary the new pairing records: it measures the component's **defaults**; a consumer supplying `--cell-fg`/`--cell-bg` leaves Candor's control, and Candor cannot audit that result (#230, #229).

- **Token names in the colour and typography showcases are readable.** Both rendered token names — the thing a developer reads precisely in order to copy it — as sub-floor text: 12px in the typography showcase and 0.65rem (10.4px) in the colour swatch grid. Both are now 14px. The swatch labels also break at hyphens rather than mid-word; `break-all` was splitting `--color-border-default` as `--color-border-defaul / t`, which for a string whose purpose is to be copied is worse than a wrap (#230).

- **A truncated `style` attribute in the colour showcase.** The comment explaining the wrap fix above was written *inside* `style="…"` and contained a double quote, which closed the attribute early and silently dropped the two declarations after it — `overflow-wrap: break-word` and `margin: 0`. Nothing errored: lit-html rendered the attribute, the browser parsed what it received, and the wrap looked fixed because removing `word-break: break-all` was the load-bearing half. Caught by reading the computed style during visual review rather than by trusting the screenshot. The declarations now live in a `SWATCH_LABEL_STYLE` const so the prose sits in TypeScript, where quoting it is free; the repo was swept for the same shape and the four remaining in-attribute comments contain no quotes.

- **The type scale now states 12px's two conditions.** The row was labelled "Decorative / non-text only" but said nothing about *how* to use it legitimately — that it is not reachable through `candor-text`, and that the audit fails the build without a `12px-ok:` marker. A designer reading the scale is the person most likely to reach for 12px, so that is where the conditions belong.

- **`build:wc` emitted the type declarations where the package does not look for them (#237).** `vite.wc.config.ts` passed `outDir` to `vite-plugin-dts`, which in v5 delegates to `unplugin-dts` and renamed the option to `outDirs`. An unrecognised key is ignored rather than rejected, so declarations landed at `dist/src/web-components/index.d.ts` while `package.json` points `types` at `./dist/index.d.ts` — meaning a build of the current tree exposes **no types at all**. Not shipped: 4.2.0 on npm is correct, and the rebuilt output was diffed against that tarball to confirm all 44 published paths reproduce exactly (plus `token-values.d.ts`, new in #223). Three things hid it: the plugin ignores unknown options silently, `build:wc` still exits 0 and emits 45 `.d.ts` files at the wrong depth, and nothing verifies the manifest's entry points resolve. TypeScript had been naming the exact fix on line 10 of that file the whole time, which is why #238 landed alongside.

- **`candor-modal` and `candor-drawer` dispatched their close event twice per close (#234).** Both wire the inner native `<dialog>`'s own `close` event to the same handler that calls `dialog.close()`, so a single user close re-entered it and fired twice — on every path (close button, backdrop click, Escape). Invisible on screen, since the dialog closes correctly; the symptom only surfaces in a consumer handler that is not idempotent, which double-counts. `_close()` now guards on `open` and clears it *before* closing the dialog — ordering that is load-bearing, because the re-entrant call otherwise arrives while `open` is still `true`. Found while verifying that renaming `closed` → `close` would not collide with the native dialog event; it does not, as that event is neither bubbling nor composed. `tests/events.spec.ts` now asserts exactly one event per close for both components.

- **The Design Tokens color showcase now mirrors the tokens exactly.** Its swatch table carries hand-written `light:`/`dark:` literals that nothing kept in sync with `semantics.scss`, and three had drifted independently of the gamut work: `--color-status-warning` was documented as `oklch(0.66 0.16 53.54)` against an actual `oklch(0.54 0.13 53.54)`, `--color-status-success` as `0.63` against `0.55`, `--color-status-error` as `0.55` against `0.54`. The swatch a reader saw was a color the system does not contain, and the documented value was one they would have copied. All 55 rows are now regenerated from `audit/tokens.dtcg.json`. That repaired the instance; the structural fix that stops it recurring landed with #223, below (#225).

- **`--color-link`'s recorded brand figure corrected to 5.3 on white**, which moved with the gamut re-authoring (#225). The Navy and Azure figures in the same prose block are *not* corrected, and an earlier draft of this branch was wrong to touch them: those lines document the brand **hex** (`#082840`, `#1493FB`), not the token derived from it, and hex → OKLCH conversion rounds — Navy's hex is OKCA 14.0 on white while `--color-action-primary` is 13.9. Both numbers are right about their own colour. The block now says so, so the next reader does not "reconcile" them again (#225, #223).

- **Two hardcoded diff-highlight fills in `syntax.scss` now derive from their tokens.** `.token.deleted` and `.token.inserted` set their background tint as a literal `oklch(… / 0.15)` duplicating the adjacent `--syntax-deleted` / `--syntax-inserted` values — so the deleted tint carried the same out-of-gamut value as its token, and the pair could silently desync. Both are now `color-mix(in oklch, var(--syntax-…) 15%, transparent)` (#225).

- **Three stale OKCA figures corrected in the Design Tokens showcase stories.** Story prose records its own contrast figures, and `npm run audit:contrast` cannot see them — it parses `//` comments in `semantics.scss`, so these have never been checked by anything and drifted through both the klar 2.0 and 3.0 re-baselines. `--color-text-subtle` read **4.6** against a measured 5.0, subtle-on-inverse **5.5** against 6.0, and the Navy brand anchor **13.8** against 14.0. The `text-subtle` one is the most damaging: it is not a passing annotation but a worked example teaching the tier rules, and it contradicted `CLAUDE.md`'s recorded 5.0 for the system's most-cited token — a reader comparing the two found the design system disagreeing with itself in the document whose job is to explain it. The conclusion it draws survives unchanged (5.0 still fails the 6.5 regular threshold, still clears the 4.5 bold floor). The remaining four figures in these files were re-measured and are correct. This corrected the numbers only; the question it left open — whether recorded figures should live in story prose at all, given nothing could verify them there — is settled above: figures stay, and are now audited; values move to the artifact (#223).

- **Dark `--color-action-destructive-text` stepped to `L=0.75` to clear the Tier 2 bold floor.** The destructive button is outlined in dark mode — `--color-action-destructive` is `transparent`, so the label sits directly on the page — and at `L=0.74` it measured OKCA 4.4 against a 4.5 floor, missing by 0.1. Stepped one lightness increment to `oklch(0.75 0.15 347)` for OKCA 4.7, a deltaE of 1 and visually indistinguishable. `--color-action-destructive-border` moves with it: it carries the same value under a `// matches text` annotation, and leaving it behind would have made that comment false. The token is inside the sRGB gamut, so the figure is well-defined and independent of any gamut-mapping policy. The hardcoded `light:`/`dark:` literals duplicating this token in the Design Tokens colour story are updated in step — they do not track `semantics.scss`, so this change would otherwise have desynced them silently — along with that entry's recorded figure, which read `OKCA 8.8 on white` against a measured 9.3 (the stale-figure class tracked in #223). This does **not** resolve the same token on `--color-bg-surface`, where it measures 3.9 and remains unvalidated by any pairing; that is tracked separately in #224 (#209).

- **15 recorded contrast figures re-baselined to klar 3.0 — no colour changed, and five real failures stopped being invisible.** Two distinct corrections landed together. Eleven figures moved by exactly ±0.1: klar 3 scores at full precision instead of through the hex round-trip, and because Candor's tokens are hand-authored round values (`oklch(0.27 0.06 245.34)`) that essentially never land on the 8-bit grid, 102 of 216 pairings shift — none by more than 0.1, and **none across a pass/fail boundary**. The other four are not precision but gamut, and they are large: dark `--color-status-error-text` recorded **5.2 on error-bg and measures 3.4**, dark `--color-status-warning-text` 5.8 → 5.2, light `--color-status-error-text` 4.9 → 4.6, dark `--color-link-visited` 6.0 → 5.8. Those tokens were outside sRGB, so they named no single colour and the recorded figures were undefined — which is why they read as comfortable passes with nothing to back them. The audit consequently reports 8 failing pairings where it previously reported 3 — the five newly visible ones are tracked in #222 and fixed by the token re-authoring in #225; the rest are #208 and #209, unchanged. `docs/ACCESSIBILITY-CONFORMANCE.md` no longer records only two known exceptions, since that understated what was measurable (#221).

- **Every recorded contrast figure re-baselined to klar 2.0 — no colour changed.** klar 2.0.0 recalibrated OKCA, and the correction lands precisely at the decision boundary: pairs scoring in the 3–7 band gained roughly +0.4, pairs above 10 are flat or fractionally lower. That made every number in `semantics.scss`, `primitives.scss`, `syntax.scss`, `article.scss`, `audit/pairings.json`, and the audit docs stale to some degree — and these numbers are load-bearing, since they are the justification text a contributor reads when deciding whether a colour is allowed to move. All 42 token-comment figures and 14 pairing notes are re-measured, along with the affected prose in `CLAUDE.md`, `docs/VISUAL-DESIGN.md`, `docs/A11Y-AUDIT.md`, `docs/DESIGN-TOKENS.md`, `docs/ACCESSIBILITY-CONFORMANCE.md`, and the Design Tokens colour story. `audit/tokens.dtcg.json` regenerates with **zero `$value` changes** — the freed headroom is real but measures deltaE 2–3, imperceptible, and harvesting it would churn every token and the entire Chromatic baseline for a change nobody can see (#193, #211).

- **`primitives.scss` ramp annotations were WCAG 2.x figures reading as OKCA.** The palette anchors were annotated `15.2:1 with white` style, unlabelled, in a system whose policy algorithm is OKCA — which is how `OKCA 15.2` ended up recorded for the inline-code pairing when the measured OKCA was 14.4. Each annotation now names its algorithm and carries the OKCA figure first. This surfaced a contradiction the old notes concealed: `azure-500` (OKCA 4.2) and `indigo-600` (3.8) were both marked "the accessible step", but neither clears Candor's 4.5 text floor — which is exactly why `--color-link` steps to `L=0.49` and `--color-link-visited` uses `indigo-700`. The notes now say so instead of asserting the opposite (#211).

- **`docs/ACCESSIBILITY-CONFORMANCE.md` claimed validation by a tool and algorithms that were never used.** The contrast section credited "CPQI CLI" against "WCAG 2.1, OKCA, and APCA" — the tool was renamed to klar and APCA is not one of its algorithms (the same class of defect as the phantom plugin roster in #212). Corrected to klar 2.x / OKCA + WCAG 2.x, and the blanket "all color combinations meet WCAG 2.1 AA" now records the two known exceptions (#208, #209) rather than asserting over them. The claim that passing OKCA implies passing WCAG is now stated as what was actually measured: across all 216 audited pairings, the OKCA score is at or below the WCAG 2.x figure for the same pair (#211).

- **Value-control stories now document their real events.** The two-event rule shipped in 4.2.0 (#164) was never carried into the component docs, so the pages consumers actually copy from were teaching the wrong API: `candor-input`, `candor-slider`, and `candor-chip` documented *only* their deprecated alias (`input-change`, `value-change`, `selected-change`) and never named the event that replaced it; `candor-combobox` documented `change` but omitted the `input` it fires for filter text; `candor-checkbox` and `candor-radio` documented no events at all. `Introduction.mdx` had the mapping right, but that isn't where anyone looks before wiring a handler — so every consumer onboarded since 4.2.0 learned the deprecated name from the docs rather than from legacy code, growing the migration burden #201 exists to retire. All six now carry an `**Events**` paragraph naming the event, its trigger, and its `detail` type, following the pattern `candor-autocomplete` already used; the three deprecated aliases are noted as deprecated in place, so the pages stay accurate while both events still fire. Docs only — no component behaviour changed (#215).

- **`candor-data-grid`'s cell label carries its own background, so `show-labels` is legible on any fill (#229).** The issue was filed against one swatch — `--color-focus`, where no label colour reaches usable contrast in either direction. Re-measured after #223 moved the label from 12px to 14px, which gave it a floor to fail, it was **six** cells across the component's own two demos: the three status fills peak at OKCA 4.2–4.4 against 6.5, the heat map's High and Med cells at 4.2 and 5.9, and `--color-focus` at 2.7 — where klar reports `unreachable`, meaning no colour whatsoever clears even 4.5 against it.

  Not a palette mistake. Every failing cell sits at L 0.54–0.75 with real chroma, and contrast is bought with lightness: a saturated fill in the middle of the lightness range cannot host text, which is the same geometry recorded in "contrast is bought with chroma".

  **The reframing is what fixed it.** This label is *alternative content* — it exists for a reader who cannot resolve the cell's colour, which makes it the redundant non-colour channel in Tier 3's sense. A channel whose legibility depends on the very colour it compensates for is not a channel. So the label now paints on its own opaque plate from token colours and no longer inherits `--cell-fg`: `--color-text-default` on `--color-bg-page`, OKCA 11.5 light / 12.9 dark, independent of the cell beneath it. Its pairing changes from a *default* a consumer could silently invalidate into a structural guarantee — which also closes the un-auditable boundary #223 had to record as a known limit.

  Deliberately **opaque, not a translucent scrim**: `check-contrast.js` skips alpha values as uncompositable, so a scrim would have fixed the appearance by removing the label from the audit — the exact move this release exists to stop.

  Two things fell out. `--candor-data-grid-cell-min-height` is added (the component had *no* style hooks at all, missing the #165 convention entirely — the rest of that surface is still absent): the plate is centred, so cell height decides how much fill stays visible around it, and 24-character token names at the default height leave only a rim. And `min-height` on `.data-grid__cell` turns out to have been **inert since it was written** — it is a `<td>`, where `min-height` does not apply; the computed value was 72px while the cell laid out at 37px. The height now lives on the inner flex element, where it works.

### Fixed (tooling)

- **The DTCG export was mode-asymmetric and dropped non-`oklch()` values (#210).** Three silent defects in `scripts/export-tokens-dtcg.js`. The light and dark mixins were parsed independently, so a token declared only in light was **absent from the dark tree** even when it aliased a mode-aware token and rendered correctly at runtime. Dark is an override layer rather than a standalone set, so the dark tree now resolves against a base of the light declarations, matching the cascade — recovering `color.blockquote.{bg,border,text}` and `color.border.control` in dark, each through its own dark alias. Separately, a `value.startsWith('oklch(')` filter discarded `transparent`, which is a real colour and a meaningful token value; that hid `color.action-destructive` from **both** modes and made `color.border-code` look dark-only. `transparent` is now emitted and anything still unemittable is reported rather than vanishing.

- **The `chromatic` job failed on every push to `main` for three consecutive merges, and the failure carried no information (#232).** Not a visual regression. Candor merges squash-only, so a PR branch's commits are never ancestors of what lands on `main`; Chromatic finds its baseline by walking git ancestry, could not reach the build where those diffs were accepted, fell back to `main`'s previous build, and reported every already-approved change as new. With `exitZeroOnChanges: false` on push, that became a failure. The gate could therefore only ever fire on changes approved one commit earlier — the merge strategy guarantees it never had access to an unreviewed change on `main`. A permanently red `main` also meant a real breakage would have looked exactly like the standing one, which is the #218 shape again: a guard that appears to check something and doesn't. Fixed with `autoAcceptChanges` on `main`, which also stops spending snapshot quota twice on identical diffs.

- **All 11 Dependabot advisories resolved; `npm audit` reports 0.** Every one was `development` scope, so nothing reached either published package, but the tree carried 4 high (`brace-expansion` ×2, `immutable`, `js-yaml`, `postcss`), 5 moderate and 2 low. Most cleared with a non-breaking `npm audit fix`.

  Five of the six survivors — `uuid`, `nyc`, `jest-junit`, `istanbul-lib-processinfo` and the wrapper itself — traced to a single root: **`@storybook/test-runner`, which nothing in this repo runs.** No `test-runner-jest.config`, no hooks in `.storybook/`, no CI step; only a `test-storybook` npm script that invoked it. It is vestigial from before #148 removed the screenshot specs and made Chromatic the visual gate. Removed, along with the dead script — which is a better outcome than npm's offer of a breaking major bump to a tool with no caller.

  Removing it surfaced a dependency the repo had been getting for free: **`@types/node` was never declared**, arriving transitively via `test-runner` → `jest`. `npm run typecheck` broke the moment the tool left. Now an explicit devDependency at the same version (`^24`) it had been resolving to, so the typecheck depends on something the manifest actually states.

  The last one, `esbuild`, is pinned below the patched version by Storybook 10.4.4, so it needed an `overrides` entry (`^0.28.1`) rather than a bump. Verified the forced version against the thing it could plausibly break: `build-storybook`, `build:wc`, `build:tokens`, `typecheck` and all 28 Playwright tests pass.

- **Regenerated the committed `tokens/` build output, which was two releases stale.** It still held `--color-border-control-on-surface` and the pre-#224 destructive values. The **published package was never affected** — `publish.yml` runs `build:tokens` before `npm publish`, so npm always gets a fresh build — but anyone reading `tokens/candor-tokens.json` in the repo was reading tokens the system had stopped using.

- **The sRGB gate now scans all of `src/`, and 16 of 36 `oklch()` literals outside the token directory were out of gamut (#228).** The gate was written to cover `src/design-tokens/`, on the reasonable premise that tokens are where colours live. They are not. Gradient stops in stories, heat-map sample data in the data-grid demo, image-placeholder fills in the card examples, and the endpoints of both lightness ramps in the colour-tool example were all outside sRGB — 44% of the literals in the unscanned region, against zero inside it.

  The invariant's own wording decides the scope question, which is why the scan moved rather than the prose: *every authored Candor colour must be renderable in sRGB*. The argument never depended on the value being a token — an out-of-gamut OKLCH value delegates the final colour to whatever consumes it, so it names no single colour, and that is as true of a gradient stop as of a `--color-*` declaration. These render in published Storybook, under Candor's name, as the system's own output.

  **The colour-tool example is the one worth reading twice.** Both slider tracks were constant-chroma lightness ramps — C 0.065 across L 0.05→0.97, C 0.054 across L 0.05→0.97 — which is the exact trap CLAUDE.md documents ("a ramp at constant chroma will leave the gamut at its ends even though its middle is fine"). It left at both ends. And the story **already knew**: the gamut matrix rendered a few lines below each track marks C 0.065 unrenderable at L 0.11 for that hue, while the track beneath it painted C 0.065 at L 0.05. The demo contradicted its own data table, and nothing looked, because the gate stopped one directory short. Both tracks now taper chroma toward each end, with the reason recorded in TypeScript beside them so the taper is not "corrected" back into a violation.

  **There is deliberately no opt-out.** One was considered for deliberate out-of-gamut fixtures in the colour tool — its whole subject is exploring OKLCH space, so the case seemed plausible. Inspection found none: every one of the 16 was an ordinary authored colour. An exemption with no user is only an escape hatch waiting to be used, and #218 is the record of what a lightly-used exemption becomes. If a genuine fixture appears, the mechanism can be built then, shaped by the real case.

  Two limits are stated in the gate rather than left to be assumed: template interpolation has no value to judge statically, and relative colour syntax (`oklch(from var(--token) …)`) derives from a token already gated. The four sites that shift lightness under that syntax while holding chroma are the shape that can genuinely leave the gamut; all four were measured in both modes and are in gamut, because the tokens involved carry chroma 0 or 0.03. That is a fact about today's values, not a guarantee. Coverage goes from 106 authored colours to 180.

- **Figures in `audit/pairings.json` `note` fields are audited, and 16 of 28 were stale (#239).** This was the third surface with the same shape and the last one left: token comments were checked, story prose became checked in #223, pairing notes never were — so every figure written there had been unverified since the file was created. The drift is mostly the klar 2→3 re-baseline, which #216 and #227 applied everywhere the audit could reach, and that is the diagnostic rather than a footnote: **the field stayed stale precisely because it was outside the tool that repaired everything else.** A record does not drift at random; it drifts where nothing is looking.

  Notes matter more than their size suggests. They hold the justification for an `exempt` and for an unusual `min` — the text a contributor reads when deciding whether a colour may move — so a stale figure there argues from a measurement that is no longer true. The largest gap was `code-inline` at 11.9 against a measured 14.5, which turned out not to be drift at all but a note written as `Light: … (OKCA 14.4) / Dark: … (OKCA 11.9)`, where the mode lives in a section heading the parser cannot see: both figures resolved as light, so the dark one was compared against the wrong colour. It is rewritten into the grammar, along with three others whose figures sat outside it.

  The check needs no anchor grammar, unlike story prose: a note belongs to a pairing, so its fg and bg are already known and only the number and an optional mode are parsed. That convenience is also the constraint, and it is now stated as an authoring rule — inside a note, `OKCA <n>` means *this pairing's* colours, so a figure about any other colour must not use the grammar. `was OKCA <n> dark` marks a superseded figure and is skipped; notes need that marker more than token comments do, because a note is frequently the record of *why* a colour moved and quotes the number it had before. Near-miss reporting comes along too, keyed on a number adjacent to a mode word — which caught two notes written on this same branch one commit earlier, in the form `(light 10.3, dark 6.1)`.

- **Story prose is now inside the contrast audit, and token values are no longer recorded in stories at all.** `audit:contrast` re-measured figures written in `semantics.scss` comments while the convention it enforces — every recorded figure must be re-measurable — was never limited to token comments. Story prose was therefore unguarded, and it is both the surface developers copy from and where the tier rules are taught by worked example, so a stale number there teaches the wrong threshold. A third pass now scans `src/**/*.stories.ts` (10 figures, 0 `UNCHECKED`). Story prose has no free anchor the way a token comment gets one from its declaration, so the anchor must be written into the sentence: `OKCA <n> on <bg>` with a `--custom-property` or `#rrggbb` to its left, nearest wins, which lets one line carry two claims about two colours. Unanchored figures are reported, never guessed — guessing produces a number about the wrong colour, which is worse than reporting nothing. Threshold statements (`OKCA 4.5 bold threshold`) are recognised as policy rather than measurement, so tier tables need no exemption.

  Token **values** in stories got the opposite treatment, because they are facts the artifact already holds rather than arguments that must be written down: the colour reference table and the data-grid token demo now read `audit/tokens.dtcg.json` through a new `src/web-components/design-tokens/token-values.ts`, so a displayed swatch cannot disagree with the stylesheet and a renamed token throws at build time instead of rendering a blank cell. This was not hypothetical — the data-grid demo was painting `oklch(0.63 0.15 144)` labelled `--color-status-success` against an actual `oklch(0.55 0.15 144.2)`, and `--color-status-warning` at `0.66 0.16 54` against `0.54 0.13 53.54`. Those swatches are corrected by the derivation, and the warning cell's label flips to white: at the true (darker) amber, the `#333` it had been using measures OKCA 1.0. The reference table's 54 rows resolve to byte-identical values, so it renders unchanged.

  The new pass immediately caught an error introduced earlier on this same branch: the brand-palette figures had been "corrected" from 14.0/2.5 to 13.9/2.6 to match their tokens, but those lines document the brand hex, and hex → OKLCH rounding makes the hex and its token genuinely different colours. Reverted, with the distinction now recorded in both the story and CLAUDE.md (#223).

- **`$extensions.usage: "non-text"` is now derived from what a token *is*, and covers all 16 qualifying tokens instead of 5.** CLAUDE.md nominates this field as the machine-readable guard against using a non-text token as a `color:` value. It was populated by regex-matching the literal phrase `icon/border use` in a comment — so it flagged the 5 places someone happened to type that phrase, and **not one border**, the archetypal non-text category. The documented safety check therefore returned a confident false negative for every `--color-border-*` token, plus `blockquote-border` and `action-destructive-border`. It is now structural: a name containing `border`, or the existence of a `<name>-text` sibling (the system having minted a `-text` variant *is* the statement that the base is not for text — this catches the three `--color-status-*` bases and the `action-destructive` / `action-tertiary` fills), plus a short named-role list for `focus`, `slider-thumb`, and `highlight-decorative`. The export now **fails** if a comment claims non-text use for a token no rule catches, so prose and rules cannot drift apart silently — which is the failure this replaced (#218).

- **Token descriptions now capture a comment above the declaration, not only one trailing it.** Several of the longest and most load-bearing annotations sit above their declaration because they run to three lines, and trailing-only capture dropped 21 of 55 light tokens' `$description` entirely. `--color-border-control` was among them, which is the whole reason its dark-mode behaviour read as an unexplained oversight from the artifact alone (#217). Section dividers are excluded, so a header is never attributed to whichever token happens to be listed first beneath it (#218).

- **The contrast audit can now verify a figure that names a mode explicitly** (`OKCA 3.5 on dark page`). A token declared only in the light mixin is *inherited* by dark, so its single comment is the only place its dark behaviour can be recorded — and until now that figure was unverifiable where it necessarily lives. Combined with the two fixes above this took the audit from 43 re-measured figures to 49 with zero `UNCHECKED`, and immediately caught a stale one: `--color-border-control` on `bg-surface` recorded 2.9 against a measured 2.8. It had never been checkable before, so it had never been checked (#218, #217).

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
