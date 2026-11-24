/**
 * Grey primitive values for documentation stories, read from the SCSS source.
 *
 * `token-values.ts` covers semantic tokens through `audit/tokens.dtcg.json`, but
 * primitives are not in that artifact. Reading `primitives.scss` as text keeps
 * the same rule: a story that shows a value derives it from the file that
 * defines it, so the two cannot disagree. A renamed or removed step throws.
 *
 * Documentation only. Components consume `var(--gray-…)`.
 */
import source from '../../design-tokens/primitives.scss?raw';

export type GreyRamp = 'neutral' | 'cool' | 'warm';

export interface GreyStep {
  name: string;
  value: string;
  l: number;
  c: number;
  h: number;
}

const PREFIX: Record<GreyRamp, string> = { neutral: '--gray-', cool: '--gray-cool-', warm: '--gray-warm-' };

const DECL = /^\s*(--gray(?:-cool|-warm)?-(\d+)):\s*(oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\))/gm;

const ALL = new Map<string, GreyStep & { step: number }>();
for (const m of source.matchAll(DECL)) {
  ALL.set(m[1], { name: m[1], step: Number(m[2]), value: m[3], l: Number(m[4]), c: Number(m[5]), h: Number(m[6]) });
}

/** Every step of one ramp, lightest first. */
export function greyRamp(ramp: GreyRamp): (GreyStep & { step: number })[] {
  const out = [...ALL.values()].filter((s) => {
    if (!s.name.startsWith(PREFIX[ramp])) return false;
    // '--gray-' also prefixes the tinted ramps; keep only bare numeric names for neutral.
    return ramp !== 'neutral' || /^--gray-\d+$/.test(s.name);
  });
  if (out.length < 10) throw new Error(`primitives.scss gave only ${out.length} steps for the ${ramp} grey ramp; the parser or the file changed`);
  return out.sort((a, b) => a.step - b.step);
}

/** One grey primitive by name. Throws if the step does not exist. */
export function requireGrey(name: string): GreyStep {
  const s = ALL.get(name);
  if (!s) throw new Error(`${name} is not declared in primitives.scss`);
  return s;
}

// ─── Colour ramps ───────────────────────────────────────────────────────────

const COLOUR_DECL = /^\s*(--([a-z]+)-(\d+|tint)):\s*(oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\))/gm;

const COLOUR = new Map<string, (GreyStep & { step: number | 'tint' })[]>();
for (const m of source.matchAll(COLOUR_DECL)) {
  if (m[2] === 'gray') continue;
  const list = COLOUR.get(m[2]) ?? [];
  list.push({ name: m[1], step: m[3] === 'tint' ? 'tint' : Number(m[3]), value: m[4], l: Number(m[5]), c: Number(m[6]), h: Number(m[7]) });
  COLOUR.set(m[2], list);
}

/**
 * Every numbered step of one colour ramp, lightest first, read from
 * primitives.scss. A status ramp's `-tint` is not a ladder step and is returned
 * by `colourTint`. Throws when the family has no steps.
 */
export function colourRamp(family: string): (GreyStep & { step: number })[] {
  const out = (COLOUR.get(family) ?? []).filter((s): s is GreyStep & { step: number } => s.step !== 'tint');
  if (out.length < 10) throw new Error(`primitives.scss gave only ${out.length} steps for the ${family} ramp; the parser or the file changed`);
  return out.sort((a, b) => a.step - b.step);
}

/** A status ramp's dark fill, `--<family>-tint`, or undefined. */
export function colourTint(family: string): GreyStep | undefined {
  return (COLOUR.get(family) ?? []).find((s) => s.step === 'tint');
}
