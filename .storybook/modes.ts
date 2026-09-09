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
export const allModes = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
} as const;
