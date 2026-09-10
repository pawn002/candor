/**
 * Chromatic modes — the theme axis for visual testing.
 *
 * Candor renders every component in light and dark from the same tokens, but
 * until now the visual gate only ever saw light: of 248 snapshots, exactly one
 * covered dark, and it was `color-showcase`'s swatch grid rather than a
 * component. `audit:contrast` measures both modes, so the *figures* were
 * checked — but nothing had ever looked at a dark-mode component, which means a
 * dark-only regression that broke no contrast floor would have shipped in
 * silence. That is the shape #218 and #229 keep describing: a guard reports
 * what it measures, and silence outside its scope is not a pass.
 *
 * A mode is a separate billed snapshot, so this is applied per-story rather
 * than globally in `preview.ts`. Applying it project-wide would take 248 → 496
 * and cost more per quarter than the whole TurboSnap exercise saved (#281).
 * Which stories earn a dark snapshot is a judgement per story, not a default.
 *
 * `color-showcase` is deliberately NOT a subject: its `LightTheme`/`DarkTheme`
 * stories already pin `globals` themselves, so adding modes there would render
 * each twice and produce two redundant snapshots.
 *
 * The value under each key is a set of Storybook globals, which is what the
 * `withTheme` decorator in `preview.ts` reads to set `data-theme` on the story
 * document.
 */

/**
 * Which stories carry the dark mode, and why those.
 *
 * Chosen by coverage rather than by taste. Of the 54 semantic colour tokens, 53
 * differ between light and dark, so "which tokens need dark" narrows nothing —
 * the useful question is which tokens any story actually *paints*, and whether
 * some dark snapshot paints each one.
 *
 * That is computed by reading each component's rules and crediting a story only
 * with tokens whose gate it satisfies: base rules always, a `.x--variant` rule
 * only when the story renders that `variant="…"`, a `:host([attr])` rule only
 * when it sets that attribute. Counting tokens merely *present* in a
 * component's stylesheet overstates it badly — 50 against the 37 genuinely
 * painted — because it credits every variant, including ones no story renders.
 *
 * Twelve story files now carry dark, covering all 37. The five added second
 * were each the cheapest story that paints something otherwise unseen in dark:
 * `settings-example` (status text, link, destructive, toast), `navigation` (the
 * four inverse tokens — nothing else paints them), `code` (the three code
 * tokens), `color-iterator-example` (slider-thumb, and focus), `modal`
 * (tertiary action; `candor-button` also paints it but costs 8 snapshots to
 * modal's 5).
 *
 * **There is a ceiling, and it is not a gap to be closed.** Five tokens are
 * only ever painted on `:hover` or `:active`:
 *
 *   --color-action-destructive-hover / --color-action-destructive-active
 *   --color-action-primary-hover     / --color-action-primary-active
 *   --color-link-hover
 *
 * A resting-state snapshot cannot reach them in either theme, so no story added
 * here will ever cover them; `audit:contrast` measuring their values is the only
 * check they have. Read "dark coverage is complete" as *complete for what
 * snapshots can reach* — the distinction the #218 and #229 write-ups keep
 * making, and the reason it is written down rather than left to be inferred
 * from a green build.
 *
 * One case worth keeping, because it looks like a mistake and is not:
 * `--color-focus` is genuinely painted at rest. `candor-tone-picker` reuses it
 * as the border of the *selected* swatch (`.cell-btn[aria-checked='true']`),
 * not only as a focus ring — so it belongs in the reachable set, and
 * `color-iterator-example` is the one story that shows it.
 */
export const allModes = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
} as const;
