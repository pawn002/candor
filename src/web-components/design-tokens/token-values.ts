/**
 * Resolved token values for documentation stories.
 *
 * Stories that *display* a token's value (the colour reference table, the
 * data-grid token demo) used to carry the `oklch(...)` strings as literals
 * copied out of `semantics.scss`. Copies do not track their source: by the time
 * #223 was filed the data-grid table was painting `oklch(0.63 0.15 144)` under
 * the label `--color-status-success`, a colour the system had not used for
 * months, and the colour reference table had drifted on three status swatches.
 *
 * Nothing catches that. `audit:contrast` re-measures recorded *figures*; a
 * wrong *value* in a story is not a figure, it renders without complaint, and
 * it is wrong in the one place whose entire job is to say what the value is.
 *
 * So these are derived, not recorded. `audit/tokens.dtcg.json` is generated
 * from the SCSS by `npm run audit:tokens` and gated in CI, which makes it the
 * only copy of a token value in the repo that cannot silently disagree with the
 * stylesheet. Reading it here removes the drift class rather than correcting an
 * instance of it.
 *
 * Note this is a *documentation* path only. Components must never read values
 * this way — they consume `var(--color-…)` so that theming works.
 */
import dtcg from '../../../audit/tokens.dtcg.json';

export type TokenMode = 'light' | 'dark';

type DtcgNode = { $value?: string; $description?: string } & Record<string, unknown>;

/**
 * Flatten a DTCG mode object into `--custom-property` → value.
 *
 * A DTCG path only ever splits a custom-property name on its own hyphens
 * (`--color-status-error-bg` → `color.status.error-bg`), so rejoining the
 * segments with `-` round-trips back to the authored name.
 */
function flatten(mode: TokenMode): Map<string, DtcgNode> {
  const out = new Map<string, DtcgNode>();
  const walk = (obj: Record<string, unknown>, trail: string[]) => {
    for (const [key, val] of Object.entries(obj)) {
      if (!val || typeof val !== 'object') continue;
      const node = val as DtcgNode;
      const next = [...trail, key];
      if ('$value' in node) out.set(`--${next.join('-')}`, node);
      else walk(node as Record<string, unknown>, next);
    }
  };
  walk((dtcg as Record<string, Record<string, unknown>>)[mode] ?? {}, []);
  return out;
}

const TOKENS: Record<TokenMode, Map<string, DtcgNode>> = {
  light: flatten('light'),
  dark: flatten('dark'),
};

/**
 * The value `cssVar` resolves to in `mode`.
 *
 * The export resolves both modes in full — dark is an override layer in the
 * SCSS, but the artifact carries all 55 tokens under each mode with the value
 * that actually renders there. So `undefined` means the token does not exist,
 * never that it is inherited.
 */
export function tokenValue(mode: TokenMode, cssVar: string): string | undefined {
  return TOKENS[mode].get(cssVar)?.$value;
}

/**
 * `tokenValue`, but a missing token is a build-time error rather than a blank
 * cell. A renamed token should break the story that documents it, not quietly
 * render an em-dash that reads like "this one has no value".
 */
export function requireTokenValue(mode: TokenMode, cssVar: string): string {
  const v = tokenValue(mode, cssVar);
  if (v === undefined) {
    throw new Error(
      `${cssVar} is not in audit/tokens.dtcg.json (${mode}). ` +
        'Either the token was renamed and this story was not updated, or the ' +
        'artifact is stale — run `npm run audit:tokens`.'
    );
  }
  return v;
}
