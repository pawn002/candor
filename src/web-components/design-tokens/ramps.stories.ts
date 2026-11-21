import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import '../components/table/candor-table';
import '../components/typography/text/candor-text';
import '../components/typography/heading/candor-heading';
import type { TableRow } from '../components/table/candor-table';
import { colourRamp, colourTint, greyRamp, requireGrey, type GreyRamp } from './primitive-values';
import { requireTokenAlias, requireTokenValue, type TokenMode } from './token-values';
import RULES from '../../design-tokens/colour-ramp-rules.json';
import { chroma, curveChroma, hueAt, maxChroma, stepLightness, type RampFamily } from '../../design-tokens/colour-ramp-curve.mjs';

// Everything on this page is read or computed: the parameters from
// colour-ramp-rules.json, the maths from colour-ramp-curve.mjs (the same two
// files scripts/derive-colour-ramps.js gates primitives.scss with), and every
// value shown from primitives.scss. The one exception is the 5.x history below,
// which is a record of what shipped and must never change.
//
// Keep OKCA figures out of colour-ramp-rules.json: audit:contrast re-measures
// figures written in story files, and text arriving from JSON would render here
// unaudited. The figures live in the token comments in semantics.scss.

type Family = RampFamily & {
  anchor: { L: number; C: number; step?: string; hex?: string };
  tint?: boolean;
  role: string;
  fit: string;
};
type GreyFamily = RampFamily & { prefix: string; from?: number; role: string; fit: string };

const LADDER = RULES.ladder as Record<string, number>;
const EXPONENT = RULES.exponent;
const FAMILIES = RULES.families as Record<string, Family>;
const EXTRA = RULES.extraSteps as Record<string, Record<string, string>>;
const NAMES = Object.keys(FAMILIES);
const GREY_LADDER = RULES.greys.ladder as Record<string, number>;
const GREYS = RULES.greys.families as Record<GreyRamp, GreyFamily>;
const GREY_NAMES = Object.keys(GREYS) as GreyRamp[];
const GREY_EXTRA = (RULES.greys.extraSteps ?? {}) as Partial<Record<GreyRamp, Record<string, string>>>;
/** The grey ramps with any chroma to chart; neutral is 0 at every step. */
const TINTED_GREYS = GREY_NAMES.filter((n) => GREYS[n].K > 0);

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const r = (n: number, dp: number) => String(Math.round(n * 10 ** dp) / 10 ** dp);
/** Where the uncapped curve peaks: 4u(1 - u) is largest at u = 1/2, so L = 0.5 ^ (1/g). */
const peakL = (f: RampFamily) => 0.5 ** (1 / f.g);
const hueText = (f: RampFamily) => (f.hue.turn ? `${f.hue.at} turning ${f.hue.turn}° from L ${f.hue.from}` : String(f.hue.at));

// ─── Rendering helpers ──────────────────────────────────────────────────────

const MONO = 'font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-default);';
// Chips are edged in border-control, which clears 3:1 on every background, so
// the steps at the page's own lightness (white in light, the 900s in dark)
// still show where they are.
const CHIP_EDGE = 'border:var(--border-width-thin) solid var(--color-border-control);border-radius:var(--radius-sm);';

const intro = (text: string) =>
  html`<candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block-end:var(--spacing-md);">${text}</candor-text>`;

const para = (text: string | TemplateResult) =>
  html`<candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block:var(--spacing-xs) var(--spacing-sm);">${text}</candor-text>`;

const heading = (text: string) =>
  html`<candor-heading level="h3" style="display:block;margin-block-start:var(--spacing-lg);">${text}</candor-heading>`;

const table = (caption: string, headers: string[], rows: TableRow[], mono: number[] = []) =>
  html`<candor-table caption=${caption} .headers=${headers} .rows=${rows} .monoColumns=${mono}></candor-table>`;

/** A colour chip with its name and value. The chip is decorative; the text carries the value. */
const chip = (name: string, value: string, note?: string): TemplateResult => html`
  <div style="display:flex;flex-direction:column;gap:var(--spacing-2xs);inline-size:8.5rem;min-inline-size:0;">
    <span aria-hidden="true" style="block-size:var(--spacing-2xl);${CHIP_EDGE}background:var(${name});"></span>
    <span style="${MONO}overflow-wrap:anywhere;">${name}</span>
    <span style="${MONO}color:var(--color-text-subtle);overflow-wrap:anywhere;">${value.replace(/^oklch\((.*)\)$/, '$1')}</span>
    ${note ? html`<span style="${MONO}color:var(--color-text-subtle);">${note}</span>` : nothing}
  </div>
`;

/** A small chip and its value, for table cells. */
const swatch = (background: string, label: string, sub?: string): TemplateResult => html`
  <span style="display:flex;align-items:center;gap:var(--spacing-xs);min-width:0;">
    <span aria-hidden="true" style="flex:none;inline-size:var(--spacing-lg);block-size:var(--spacing-lg);${CHIP_EDGE}background:${background};"></span>
    <span style="display:flex;flex-direction:column;min-width:0;overflow-wrap:anywhere;">
      <span style=${MONO}>${label}</span>
      ${sub ? html`<span style="${MONO}color:var(--color-text-subtle);">${sub}</span>` : nothing}
    </span>
  </span>
`;

// ─── Story: colour ramps ────────────────────────────────────────────────────

const renderColourRamps = () => html`
  ${intro('Eight colour ramps on one lightness ladder, so a step number means the same lightness in every family and only the hue changes. Steps between ladder steps exist where a token needed one, and are marked. Each chip shows L, C and H as declared in primitives.scss.')}
  <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);">
    ${NAMES.map((name) => {
      const f = FAMILIES[name]!;
      const extra = EXTRA[name] ?? {};
      const tint = colourTint(name);
      return html`
        <section style="border-block-start:var(--border-width-thin) solid var(--color-border-default);padding-block-start:var(--spacing-sm);">
          <candor-heading level="h3">${cap(name)}</candor-heading>
          <candor-text variant="caption" style="display:block;margin-block-end:var(--spacing-sm);">${f.role}</candor-text>
          <div style="display:flex;flex-wrap:wrap;gap:var(--spacing-sm);">
            ${colourRamp(name).map((s) =>
              chip(s.name, s.value, String(s.step) in extra ? 'in-between step' : String(s.step) === f.anchor.step ? 'anchor' : undefined),
            )}
            ${tint ? chip(tint.name, tint.value, 'dark status fill') : nothing}
          </div>
        </section>
      `;
    })}
  </div>
`;

// ─── Story: grey ramps ──────────────────────────────────────────────────────

const renderGreyRamps = () => {
  const byStep = new Map<number, Partial<Record<GreyRamp, ReturnType<typeof greyRamp>[number]>>>();
  for (const ramp of GREY_NAMES) {
    for (const s of greyRamp(ramp)) byStep.set(s.step, { ...byStep.get(s.step), [ramp]: s });
  }
  const rows: TableRow[] = [...byStep.entries()]
    .sort(([a], [b]) => a - b)
    .map(([step, row]) => ({
      cells: [
        String(step),
        String((row.neutral ?? row.cool ?? row.warm)!.l),
        ...GREY_NAMES.map((ramp) => {
          const s = row[ramp];
          if (s) return swatch(`var(${s.name})`, s.name, `C ${s.c}`);
          return step === 0 ? 'Neutral only' : 'Not in this ramp';
        }),
      ],
    }));
  return html`
    ${intro('Three grey ramps share one lightness scale, so a step number means the same lightness in every ramp and only the temperature changes. Swapping a cool grey for the warm one at the same step changes contrast very little. Temperature ranks surfaces: warm comes forward and cool recedes, through the forward and recede background tokens.')}
    ${table('Grey ramps', ['Step', 'Lightness', 'Neutral', `Cool (hue ${GREYS.cool.hue.at})`, `Warm (hue ${GREYS.warm.hue.at})`], rows)}
  `;
};

// ─── Story: the rules ───────────────────────────────────────────────────────

const renderRules = () => {
  const ladderRows: TableRow[] = Object.entries(LADDER).map(([step, L]) => ({ cells: [step, String(L)] }));
  const greyLadderRows: TableRow[] = Object.entries(GREY_LADDER).map(([step, L]) => ({ cells: [step, String(L)] }));
  // Worked example: the first in-between step of the first family that has one.
  const [exFam, exSteps] = Object.entries(EXTRA)[0]!;
  const exStep = Number(Object.keys(exSteps)[0]);
  const keys = Object.keys(LADDER).map(Number).sort((a, b) => a - b);
  const hi = keys.find((k) => k > exStep)!;
  const lo = [...keys].reverse().find((k) => k < exStep)!;
  const exL = stepLightness(LADDER, exStep);
  const exF = FAMILIES[exFam]!;
  const exDeclared = colourRamp(exFam).find((s) => s.step === exStep)!;
  const share = Math.round(((exStep - lo) / (hi - lo)) * 100);
  const navy = FAMILIES['navy']!.hue;
  return html`
    ${intro('Every ramp, colour and grey, is three rules: a lightness ladder, a chroma curve, and a hue. A colour that is not on a ramp is not a Candor colour, and audit:tokens fails on one typed anywhere outside the primitives.')}

    ${heading('Lightness: two ladders')}
    ${para('A step number fixes lightness. The colour ramps share one ladder, taken from the hand-set ramps it replaced: where navy, burgundy and azure agreed it took their value, and where they differed a brand anchor decided.')}
    ${table('The colour ladder', ['Step', 'Lightness'], ladderRows, [1])}
    ${para(`The greys have a ladder of their own. ${RULES.greys.ladderWhy} A grey ramp can carry an in-between step too, interpolated the same way.`)}
    ${table('The grey ladder', ['Step', 'Lightness'], greyLadderRows, [1])}

    ${heading('Chroma: one curve shape, two dials per ramp')}
    ${para('Every ramp, colour and grey, uses the same curve. It rises from zero at black, peaks, and falls back to zero at white, which is the shape of what a display can render.')}
    <p style="${MONO}margin:var(--spacing-sm) 0;">u = L<sup>g</sup><br />C(L) = min(K × (4u(1 − u))<sup>${EXPONENT}</sup>, sRGB maximum at L and H)</p>
    ${para(html`K sets the height of the peak and g moves it: the peak sits at L = 0.5<sup>1/g</sup>. The exponent ${EXPONENT} keeps a trace of chroma close to white, which the tinted light page depends on. Each colour family's K and g were fitted so its brand anchor sits exactly on the curve and every step lands within deltaE 2 of the hand-set value it replaced. Where the curve asks for more chroma than sRGB renders, the cap takes over, and chroma is rounded down to three decimals so a value on the boundary never rounds out of gamut. The greys ask so little chroma that no grey step is capped, and the neutral ramp sets K to 0.`)}

    ${heading('Hue: constant, except navy')}
    ${para('Each ramp holds one hue. Navy is the exception: it turns toward violet as it lightens, so its pale steps read as navy rather than grey-cyan:')}
    <p style="${MONO}margin:0 0 var(--spacing-sm);">H = ${navy.at} + ${navy.turn} × max(0, L − ${navy.from}) / ${navy.over}</p>

    ${heading('Steps between steps')}
    ${para(`Because chroma and hue are functions of lightness, any lightness has a defined colour. When a token needs a lightness the ladder lacks, the ramp gains a step whose number says where it sits. ${exFam}-${exStep} is ${share}% of the way from ${lo} (L ${LADDER[lo]}) to ${hi} (L ${LADDER[hi]}), so L = ${exL}. The curve then gives C ${chroma(exL, exF, EXPONENT)} and the hue rule H ${hueAt(exF, exL).toFixed(2)}, which is what primitives.scss declares: ${exDeclared.value}. Mint a step only when a token needs one, and never move a step's lightness while holding its chroma and hue: that is a colour off the curve.`)}
  `;
};

// ─── Story: chroma curves ───────────────────────────────────────────────────

// Axis labels are in the HTML caption, not SVG text: SVG text scales with the
// chart rather than with the reader's text size, which fails WCAG 1.4.4.
const W = 320, H = 160, PAD_L = 8, PAD_R = 8, PAD_T = 8, PAD_B = 8;
const SAMPLES = 120;

interface ChartInput {
  id: string;
  title: string;
  family: RampFamily;
  steps: { name: string; step: number; l: number; c: number }[];
  anchor?: { L: number; C: number };
}

const curveChart = ({ id, title, family: f, steps, anchor }: ChartInput) => {
  // From L 0.02: at black the renderability test's tolerance admits a hair of
  // chroma, which would draw a hook at the origin that is not in the rules.
  const Ls = [0, ...Array.from({ length: SAMPLES + 1 }, (_, i) => 0.02 + (0.98 * i) / SAMPLES)];
  const raw = Ls.map((L) => curveChroma(L, f, EXPONENT));
  const ceiling = Ls.map((L) => (L === 0 ? 0 : maxChroma(L, hueAt(f, L))));
  const top = Math.max(...raw, ...steps.map((s) => s.c)) * 1.15;
  const x = (L: number) => PAD_L + L * (W - PAD_L - PAD_R);
  // Not clamped: the ceiling runs off the top and the clip path cuts it, so it
  // never draws as a flat limit that does not exist.
  const y = (c: number) => H - PAD_B - (c / top) * (H - PAD_T - PAD_B);
  const pts = (cs: number[]) => cs.map((c, i) => `${x(Ls[i]!).toFixed(1)},${y(c).toFixed(1)}`).join(' ');
  const capped = raw.map((c, i) => Math.min(c, ceiling[i]!));
  const binds = steps.filter((s) => curveChroma(s.l, f, EXPONENT) > maxChroma(s.l, hueAt(f, s.l)) + 1e-9);
  const pk = peakL(f);
  const darkest = steps.reduce((a, b) => (b.l < a.l ? b : a));
  const lightest = steps.reduce((a, b) => (b.l > a.l ? b : a));
  const label =
    `${title} chroma against lightness. The curve peaks at L ${r(pk, 2)} with C ${r(curveChroma(pk, f, EXPONENT), 3)}. ` +
    `Its darkest step, L ${darkest.l}, has C ${darkest.c}, and its lightest, L ${lightest.l}, has C ${lightest.c}. ` +
    (binds.length
      ? `sRGB caps it at ${binds.length} of ${steps.length} steps: ${binds.map((s) => s.step).join(', ')}.`
      : 'sRGB never caps it; every step sits on the curve.') +
    (anchor ? ` The anchor is L ${anchor.L}, C ${anchor.C}.` : '');
  return html`
    <figure style="margin:0;">
      <candor-heading level="h3">${title}</candor-heading>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label=${label} style="inline-size:100%;block-size:auto;display:block;">
        <defs><clipPath id="plot-${id}"><rect x=${PAD_L} y=${PAD_T} width=${W - PAD_L - PAD_R} height=${H - PAD_T - PAD_B} /></clipPath></defs>
        <line x1=${PAD_L} y1=${H - PAD_B} x2=${W - PAD_R} y2=${H - PAD_B} stroke="var(--color-border-control)" stroke-width="1" />
        <line x1=${PAD_L} y1=${PAD_T} x2=${PAD_L} y2=${H - PAD_B} stroke="var(--color-border-control)" stroke-width="1" />
        <g clip-path="url(#plot-${id})">
          <polyline points=${pts(ceiling)} fill="none" stroke="var(--color-border-control)" stroke-width="1.5" stroke-dasharray="4 4" />
          <polyline points=${pts(raw)} fill="none" stroke="var(--color-text-subtle)" stroke-width="1" stroke-dasharray="1 3" />
          <polyline points=${pts(capped)} fill="none" stroke="var(--color-text-default)" stroke-width="2" />
        </g>
        ${anchor ? svg`<circle cx=${x(anchor.L)} cy=${y(anchor.C)} r="8" fill="none" stroke="var(--color-text-default)" stroke-width="1.5" />` : nothing}
        ${steps.map((s) => svg`<circle cx=${x(s.l)} cy=${y(s.c)} r="4" fill="var(${s.name})" stroke="var(--color-text-default)" stroke-width="1" />`)}
      </svg>
      <figcaption>
        <candor-text variant="caption">Lightness 0 to 1 across, chroma 0 to ${r(top, 3)} up. K ${f.K}, g ${f.g}, peak at L ${r(pk, 2)}. ${binds.length ? `sRGB caps steps ${binds.map((s) => s.step).join(', ')}.` : 'sRGB never caps it.'}</candor-text>
      </figcaption>
    </figure>
  `;
};

const chartGrid = (charts: TemplateResult[]) =>
  html`<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(min(100%, 280px), 1fr));gap:var(--spacing-lg);">${charts}</div>`;

const renderCurves = () => html`
  ${intro('One chart per ramp, chroma against lightness. The solid line is the chroma each step gets. The dotted line is the curve before the cap, and the dashed line is the most chroma sRGB renders at that lightness and hue; where the curve rises above it, the cap takes over. Dots are the steps, filled with their own colour, and the ring marks a colour family\'s brand anchor. Each chart has its own vertical scale, given in its caption.')}
  ${chartGrid(NAMES.map((name) => curveChart({ id: name, title: cap(name), family: FAMILIES[name]!, steps: colourRamp(name), anchor: FAMILIES[name]!.anchor })))}
  ${heading('Greys')}
  ${para('The tinted greys follow the same curve at a fraction of the height. sRGB limits it only near black, below the darkest step, so no grey step is capped. The neutral ramp has no chroma to chart.')}
  ${chartGrid(TINTED_GREYS.map((name) => curveChart({ id: `grey-${name}`, title: `${cap(name)} grey`, family: GREYS[name], steps: greyRamp(name) })))}
`;

// ─── Story: parameters ──────────────────────────────────────────────────────

const fitList = (entries: [string, string][]) => html`
  <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);max-inline-size:40rem;">
    ${entries.map(([name, fit]) => html`<candor-text variant="body"><strong>${name}.</strong> ${fit}</candor-text>`)}
  </div>
`;

const renderParameters = () => {
  const famRows: TableRow[] = NAMES.map((name) => {
    const f = FAMILIES[name]!;
    const anchor = `L ${f.anchor.L}, C ${f.anchor.C}${f.anchor.step ? ` (step ${f.anchor.step})` : ''}${f.anchor.hex ? `, ${f.anchor.hex}` : ''}`;
    return { cells: [cap(name), String(f.K), String(f.g), r(peakL(f), 2), hueText(f), anchor] };
  });
  const greyRows: TableRow[] = GREY_NAMES.map((name) => {
    const f = GREYS[name];
    return { cells: [`--${f.prefix}-*`, String(f.K), f.K ? String(f.g) : 'n/a', f.K ? r(peakL(f), 2) : 'n/a', f.K ? hueText(f) : 'none'] };
  });
  const extraRows: TableRow[] = [
    ...Object.entries(EXTRA).flatMap(([fam, steps]) =>
      Object.entries(steps).map(([step, why]) => {
        const s = colourRamp(fam).find((x) => x.step === Number(step))!;
        return { cells: [s.name, s.value, why] };
      }),
    ),
    ...(Object.entries(GREY_EXTRA) as [GreyRamp, Record<string, string>][]).flatMap(([ramp, steps]) =>
      Object.entries(steps).map(([step, why]) => {
        const s = greyRamp(ramp).find((x) => x.step === Number(step))!;
        return { cells: [s.name, s.value, why] };
      }),
    ),
  ];
  return html`
    ${intro('The fitted values behind every ramp, read from colour-ramp-rules.json. Change a value there and run scripts/derive-colour-ramps.js --write; audit:tokens fails until primitives.scss matches.')}
    ${table('Colour ramps: chroma curve and hue', ['Family', 'K', 'g', 'Peak at L', 'Hue', 'Anchor'], famRows, [1, 2, 3])}
    ${heading('How each colour ramp was fitted')}
    ${fitList(NAMES.map((n) => [cap(n), FAMILIES[n]!.fit]))}
    <div style="block-size:var(--spacing-lg);"></div>
    ${table('Grey ramps: chroma curve and hue', ['Ramp', 'K', 'g', 'Peak at L', 'Hue'], greyRows, [0, 1, 2, 3])}
    ${heading('How each grey ramp was fitted')}
    ${fitList(GREY_NAMES.map((n) => [cap(n), GREYS[n].fit]))}
    <div style="block-size:var(--spacing-lg);"></div>
    ${table('In-between steps and the token each was minted for', ['Step', 'Value', 'Why it exists'], extraRows, [0, 1])}
  `;
};

// ─── Grey history: 5.x to 6.0.0 ─────────────────────────────────────────────
// The 5.x values below are a record of what shipped, not tokens, which is why
// they are literals: they come from src/design-tokens/primitives.scss and
// semantics.scss at the commit before #328 (ebac15a~1) and must never change.

/** 5.x grey primitives, and the 6.0.0 step that holds the same colour now. */
const OLD_PRIMITIVES: { name: string; value: string; useNow: string; note?: string }[] = [
  { name: '--gray-0', value: 'oklch(1 0 0)', useNow: '--gray-0' },
  { name: '--gray-50', value: 'oklch(0.97 0 0)', useNow: '--gray-25', note: 'removed' },
  { name: '--gray-100', value: 'oklch(0.91 0 0)', useNow: '--gray-100' },
  { name: '--gray-200', value: 'oklch(0.88 0.005 17.2)', useNow: '--gray-200', note: 'was faintly warm, now neutral and a hundredth lighter' },
  { name: '--gray-300', value: 'oklch(0.81 0 0)', useNow: '--gray-300' },
  { name: '--gray-400', value: 'oklch(0.71 0 0)', useNow: '--gray-400', note: 'a hundredth lighter' },
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

const renderGreyBeforeAfter = () => {
  const rows: TableRow[] = OLD_PRIMITIVES.map((p) => {
    let sameName: TableRow['cells'][number];
    try {
      const now = requireGrey(p.name);
      sameName = swatch(`var(${p.name})`, now.value);
    } catch {
      sameName = 'Removed';
    }
    requireGrey(p.useNow); // the replacement step must exist
    return { cells: [p.name, swatch(p.value, p.value), sameName, swatch(`var(${p.useNow})`, p.useNow, p.note)] };
  });
  return html`
    ${intro('Semantic token names did not change in 6.0.0. Grey primitive names did: nine 5.x names now resolve to a different colour. Six of them changed lightness in 6.0.0; --gray-200 lost its faint warmth and --gray-900 its cool cast at the same lightness. --gray-50 is removed. After 6.0.0, --gray-200 and --gray-400 each moved a hundredth lighter, to the lightness dark-mode text needs; --gray-400 is deltaE 1 from its 5.x colour and --gray-200 deltaE 2. The last column is the step that holds the 5.x colour, or the nearest one, for anyone who referenced a primitive directly.')}
    ${table('Grey primitives in 5.x and what the names mean now', ['Primitive', '5.x value', 'Same name now', 'Use for the 5.x colour'], rows)}
  `;
};

const renderGreyOffRamp = () => {
  const rows: TableRow[] = OFF_RAMP.map((o) => {
    const step = requireTokenAlias(o.mode, o.token);
    const now = requireTokenValue(o.mode, o.token);
    return { cells: [o.token, o.mode === 'light' ? 'Light' : 'Dark', swatch(o.value, o.value), swatch(now, step, now)] };
  });
  return html`
    ${intro('In 5.x, many greys in use were written as one-off values tuned for contrast, at lightnesses no ramp had, and the cool undertone was spread across hues 245, 248 and 248.99. In 6.0.0 every grey semantic token names a ramp step. The steps are uneven on purpose: 550, 600 and 650 exist because subtle text and control borders need those lightnesses.')}
    ${table('Greys that sat off the 5.x ramps, and the step each uses now', ['Token', 'Mode', '5.x value', '6.0.0 step'], rows)}
  `;
};

const meta: Meta = {
  title: 'Design Tokens/Ramps',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'How Candor derives every ramp, colour and grey: a lightness ladder, one chroma curve shape with two dials per ramp, capped by what sRGB renders, and a hue per ramp. ' +
          'Every value on this page is read from `primitives.scss`, and every rule from `colour-ramp-rules.json` and `colour-ramp-curve.mjs`, the same files `npm run audit:tokens` checks the ramps against (#365). ' +
          'The last two stories record how the greys changed in 6.0.0 (#318, #328); their 5.x values are a record of what shipped.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ColourRamps: Story = { name: 'Colour ramps', render: renderColourRamps };
export const GreyRamps: Story = { name: 'Grey ramps', render: renderGreyRamps };
export const Rules: Story = { name: 'The rules', render: renderRules };
export const Curves: Story = { name: 'Chroma curves', render: renderCurves };
export const Parameters: Story = { name: 'Parameters', render: renderParameters };
export const GreyBeforeAndAfter: Story = { name: 'Greys in 5.x and 6.0.0', render: renderGreyBeforeAfter };
export const GreyOffRamp: Story = { name: 'Greys that were off the ramps', render: renderGreyOffRamp };
