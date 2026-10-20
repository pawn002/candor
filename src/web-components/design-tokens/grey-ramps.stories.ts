import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import '../components/table/candor-table';
import '../components/typography/text/candor-text';
import type { TableRow } from '../components/table/candor-table';
import { greyRamp, requireGrey, type GreyRamp } from './primitive-values';
import { requireTokenAlias, requireTokenValue, type TokenMode } from './token-values';

// ─── History ────────────────────────────────────────────────────────────────
// The 5.x values below are a record of what shipped, not tokens, which is why
// they are literals: they come from src/design-tokens/primitives.scss and
// semantics.scss at the commit before #328 (ebac15a~1) and must never change.
// Everything shown for 6.0.0 is read from the source or the DTCG artifact.

/** 5.x grey primitives, and the 6.0.0 step that holds the same colour now. */
const OLD_PRIMITIVES: { name: string; value: string; useNow: string; note?: string }[] = [
  { name: '--gray-0', value: 'oklch(1 0 0)', useNow: '--gray-0' },
  { name: '--gray-50', value: 'oklch(0.97 0 0)', useNow: '--gray-25', note: 'removed' },
  { name: '--gray-100', value: 'oklch(0.91 0 0)', useNow: '--gray-100' },
  { name: '--gray-200', value: 'oklch(0.88 0.005 17.2)', useNow: '--gray-200', note: 'was faintly warm, now neutral' },
  { name: '--gray-300', value: 'oklch(0.81 0 0)', useNow: '--gray-300' },
  { name: '--gray-400', value: 'oklch(0.71 0 0)', useNow: '--gray-400' },
  { name: '--gray-500', value: 'oklch(0.56 0 0)', useNow: '--gray-550', note: 'name now means a lighter grey' },
  { name: '--gray-600', value: 'oklch(0.46 0 0)', useNow: '--gray-650', note: 'name now means a lighter grey' },
  { name: '--gray-700', value: 'oklch(0.32 0 0)', useNow: '--gray-800', note: 'name now means a lighter grey' },
  { name: '--gray-800', value: 'oklch(0.24 0.03 248.99)', useNow: '--gray-cool-850', note: 'was cool, name now means a lighter neutral' },
  { name: '--gray-900', value: 'oklch(0.16 0.02 248.99)', useNow: '--gray-cool-900', note: 'was cool, same lightness, now neutral' },
  { name: '--gray-cool-600', value: 'oklch(0.46 0.03 248.99)', useNow: '--gray-cool-650', note: 'name now means a lighter grey' },
  { name: '--gray-cool-700', value: 'oklch(0.32 0.03 248.99)', useNow: '--gray-cool-800', note: 'name now means a lighter grey' },
];

/** Greys in use in 5.x that were written as literals, at lightnesses no ramp had. */
const OFF_RAMP: { token: string; mode: TokenMode; value: string }[] = [
  { token: '--color-text-subtle', mode: 'light', value: 'oklch(0.50 0 0)' },
  { token: '--color-text-subtle-on-surface', mode: 'light', value: 'oklch(0.44 0 0)' },
  { token: '--color-border-control', mode: 'light', value: 'oklch(0.53 0 0)' },
  { token: '--color-text-subtle-on-inverse', mode: 'light', value: 'oklch(0.75 0.02 245)' },
  { token: '--color-bg-elevated', mode: 'dark', value: 'oklch(0.30 0.02 248)' },
  { token: '--color-bg-muted', mode: 'dark', value: 'oklch(0.40 0.03 248.99)' },
  { token: '--color-text-default', mode: 'dark', value: 'oklch(0.88 0.01 248)' },
  { token: '--color-text-subtle-on-inverse', mode: 'dark', value: 'oklch(0.40 0 0)' },
  { token: '--color-border-on-inverse', mode: 'dark', value: 'oklch(0.85 0 0)' },
  { token: '--color-border-control', mode: 'dark', value: 'oklch(0.62 0 0)' },
];

// ─── Rendering ──────────────────────────────────────────────────────────────

const MONO = 'font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-default);';

/** A colour chip and its value. The chip is decorative; the text carries the value. */
const swatch = (background: string, label: string, sub?: string): TemplateResult => html`
  <span style="display:flex;align-items:center;gap:var(--spacing-xs);min-width:0;">
    <span aria-hidden="true" style="flex:none;inline-size:var(--spacing-lg);block-size:var(--spacing-lg);border-radius:var(--radius-sm);border:var(--border-width-thin) solid var(--color-border-default);background:${background};"></span>
    <span style="display:flex;flex-direction:column;min-width:0;overflow-wrap:anywhere;">
      <span style=${MONO}>${label}</span>
      ${sub ? html`<span style="${MONO}color:var(--color-text-subtle);">${sub}</span>` : nothing}
    </span>
  </span>
`;

const table = (caption: string, headers: string[], rows: TableRow[]) =>
  html`<candor-table caption=${caption} .headers=${headers} .rows=${rows}></candor-table>`;

const intro = (text: string) =>
  html`<candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block-end:var(--spacing-md);">${text}</candor-text>`;

// ─── Stories ────────────────────────────────────────────────────────────────

const RAMPS: GreyRamp[] = ['neutral', 'cool', 'warm'];

const renderRamps = () => {
  const byStep = new Map<number, Record<GreyRamp, ReturnType<typeof greyRamp>[number] | undefined>>();
  for (const ramp of RAMPS) {
    for (const s of greyRamp(ramp)) {
      const row = byStep.get(s.step) ?? { neutral: undefined, cool: undefined, warm: undefined };
      row[ramp] = s;
      byStep.set(s.step, row);
    }
  }
  const rows: TableRow[] = [...byStep.entries()]
    .sort(([a], [b]) => a - b)
    .map(([step, r]) => ({
      cells: [
        String(step),
        String((r.neutral ?? r.cool ?? r.warm)!.l),
        ...RAMPS.map((ramp) => {
          const s = r[ramp];
          return s ? swatch(`var(${s.name})`, s.name, `C ${s.c}`) : 'Neutral only';
        }),
      ],
    }));
  return html`
    ${intro('Three ramps share one lightness scale, so a step number means the same lightness in every ramp and only the temperature changes. Swapping a cool grey for the warm one at the same step changes contrast very little.')}
    ${table('Grey ramps in 6.0.0', ['Step', 'Lightness', 'Neutral', 'Cool (hue 248.99)', 'Warm (hue 69)'], rows)}
  `;
};

const renderBeforeAfter = () => {
  const rows: TableRow[] = OLD_PRIMITIVES.map((p) => {
    let sameName: TableRow['cells'][number];
    try {
      const now = requireGrey(p.name);
      sameName = swatch(`var(${p.name})`, now.value);
    } catch {
      sameName = 'Removed';
    }
    requireGrey(p.useNow); // the replacement step must exist
    return {
      cells: [
        p.name,
        swatch(p.value, p.value),
        sameName,
        swatch(`var(${p.useNow})`, p.useNow, p.note),
      ],
    };
  });
  return html`
    ${intro('Semantic token names did not change. Grey primitive names did: eight 5.x names now resolve to a different colour. Six of them changed lightness; --gray-200 lost its faint warmth and --gray-900 its cool cast at the same lightness. --gray-50 is removed. The last column is the 6.0.0 step that holds the 5.x colour, for anyone who referenced a primitive directly.')}
    ${table('Grey primitives in 5.x and what the names mean in 6.0.0', ['Primitive', '5.x value', 'Same name in 6.0.0', 'Use for the 5.x colour'], rows)}
  `;
};

const renderOffRamp = () => {
  const rows: TableRow[] = OFF_RAMP.map((o) => {
    const step = requireTokenAlias(o.mode, o.token);
    return {
      cells: [
        o.token,
        o.mode === 'light' ? 'Light' : 'Dark',
        swatch(o.value, o.value),
        swatch(requireTokenValue(o.mode, o.token), step, requireTokenValue(o.mode, o.token)),
      ],
    };
  });
  return html`
    ${intro('In 5.x, many greys in use were written as one-off values tuned for contrast, at lightnesses no ramp had, and the cool undertone was spread across hues 245, 248 and 248.99. In 6.0.0 every grey semantic token names a ramp step. The steps are uneven on purpose: 550, 600 and 650 exist because subtle text and borders need those lightnesses.')}
    ${table('Greys that sat off the 5.x ramps, and the step each uses now', ['Token', 'Mode', '5.x value', '6.0.0 step'], rows)}
  `;
};

const renderChroma = () => {
  const W = 320, H = 160, PAD = 32;
  const cool = greyRamp('cool');
  const warm = greyRamp('warm');
  const maxC = Math.max(...cool.map((s) => s.c), ...warm.map((s) => s.c));
  const x = (l: number) => PAD + l * (W - 2 * PAD);
  const y = (c: number) => H - PAD - (c / maxC) * (H - 2 * PAD);
  const line = (steps: typeof cool) => steps.map((s) => `${x(s.l).toFixed(1)},${y(s.c).toFixed(1)}`).join(' ');
  const peak = (steps: typeof cool) => steps.reduce((a, b) => (b.c > a.c ? b : a));
  const pc = peak(cool), pw = peak(warm);
  const label = `Chroma against lightness for the tinted ramps. Cool peaks at lightness ${pc.l} with chroma ${pc.c}, toward the dark end. Warm peaks at lightness ${pw.l} with chroma ${pw.c}, in the middle. Both fall to near zero toward black and stay just above zero near white.`;
  return html`
    ${intro('Chroma in the tinted ramps comes from one curve instead of per-step values, C(L) = K × (4u(1 − u))^0.44 with u = L^g, rounded inward to stay in sRGB. K sets the peak height and g moves the peak. Cool peaks low, for the navy cast of dark surfaces. Warm peaks in the middle, so it reads about as strong in dark mode as in light instead of turning brown.')}
    <figure style="margin:0;max-inline-size:40rem;">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label=${label} style="inline-size:100%;block-size:auto;display:block;">
        <line x1=${PAD} y1=${H - PAD} x2=${W - PAD} y2=${H - PAD} stroke="var(--color-border-control)" stroke-width="1" />
        <line x1=${PAD} y1=${PAD} x2=${PAD} y2=${H - PAD} stroke="var(--color-border-control)" stroke-width="1" />
        <polyline points=${line(cool)} fill="none" stroke="var(--color-text-default)" stroke-width="2" />
        <polyline points=${line(warm)} fill="none" stroke="var(--color-text-default)" stroke-width="2" stroke-dasharray="6 4" />
        ${cool.map((s) => svg`<circle cx=${x(s.l)} cy=${y(s.c)} r="3.5" fill="var(${s.name})" stroke="var(--color-text-default)" stroke-width="1" />`)}
        ${warm.map((s) => svg`<rect x=${x(s.l) - 3.5} y=${y(s.c) - 3.5} width="7" height="7" fill="var(${s.name})" stroke="var(--color-text-default)" stroke-width="1" />`)}
      </svg>
      <figcaption>
        <candor-text variant="caption">Solid line and circles: cool. Dashed line and squares: warm. Horizontal: lightness, 0 to 1. Vertical: chroma, 0 to ${maxC}. Each mark is a step, filled with its own colour.</candor-text>
      </figcaption>
    </figure>
  `;
};

const meta: Meta = {
  title: 'Design Tokens/Grey Ramps',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Candor 6.0.0 replaced its greys with three ramps on one lightness scale: neutral `--gray-*`, cool `--gray-cool-*` and warm `--gray-warm-*`. ' +
          'In 5.x, one ramp held three temperatures (neutral, a faintly warm 200, and a cool 800 and 900), a two-step cool ramp sat beside it, and many greys in use sat on no ramp at all. ' +
          'Temperature now ranks surfaces: warm comes forward and cool recedes, through `--color-bg-forward` and `--color-bg-recede`. ' +
          'The values for 6.0.0 on this page are read from `primitives.scss` and `audit/tokens.dtcg.json`; the 5.x values are a record of what shipped (#318, #328).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Ramps: Story = { name: 'The 6.0.0 ramps', render: renderRamps };
export const BeforeAndAfter: Story = { name: 'Primitives in 5.x and 6.0.0', render: renderBeforeAfter };
export const OffRamp: Story = { name: 'Greys that were off the ramps', render: renderOffRamp };
export const Chroma: Story = { name: 'Chroma curve', render: renderChroma };
