import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import '../components/table/candor-table';
import '../components/typography/text/candor-text';
import '../components/typography/heading/candor-heading';
import type { TableRow } from '../components/table/candor-table';
import { colourRamp, colourTint } from './primitive-values';
import RULES from '../../design-tokens/colour-ramp-rules.json';
import { chroma, curveChroma, hueAt, maxChroma, stepLightness, type RampFamily } from '../../design-tokens/colour-ramp-curve.mjs';

// Everything on this page is read or computed: the parameters from
// colour-ramp-rules.json, the maths from colour-ramp-curve.mjs (the same two
// files scripts/derive-colour-ramps.js gates primitives.scss with), and every
// value shown from primitives.scss. Nothing here is a copied number.
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

const LADDER = RULES.ladder as Record<string, number>;
const EXPONENT = RULES.exponent;
const FAMILIES = RULES.families as Record<string, Family>;
const EXTRA = RULES.extraSteps as Record<string, Record<string, string>>;
const NAMES = Object.keys(FAMILIES);

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const r = (n: number, dp: number) => String(Math.round(n * 10 ** dp) / 10 ** dp);
/** Where the uncapped curve peaks: 4u(1 - u) is largest at u = 1/2, so L = 0.5 ^ (1/g). */
const peakL = (f: Family) => 0.5 ** (1 / f.g);

// ─── Rendering helpers ──────────────────────────────────────────────────────

const MONO = 'font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-default);';

const intro = (text: string) =>
  html`<candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block-end:var(--spacing-md);">${text}</candor-text>`;

const table = (caption: string, headers: string[], rows: TableRow[], mono: number[] = []) =>
  html`<candor-table caption=${caption} .headers=${headers} .rows=${rows} .monoColumns=${mono}></candor-table>`;

/** A colour chip with its name and value. The chip is decorative; the text carries the value. */
const chip = (name: string, value: string, note?: string): TemplateResult => html`
  <div style="display:flex;flex-direction:column;gap:var(--spacing-2xs);inline-size:8.5rem;min-inline-size:0;">
    <span aria-hidden="true" style="block-size:var(--spacing-2xl);border-radius:var(--radius-sm);border:var(--border-width-thin) solid var(--color-border-control);background:var(${name});"></span>
    <span style="${MONO}overflow-wrap:anywhere;">${name}</span>
    <span style="${MONO}color:var(--color-text-subtle);overflow-wrap:anywhere;">${value.replace(/^oklch\((.*)\)$/, '$1')}</span>
    ${note ? html`<span style="${MONO}color:var(--color-text-subtle);">${note}</span>` : nothing}
  </div>
`;

// ─── Story: the ramps ───────────────────────────────────────────────────────

const renderRamps = () => html`
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

// ─── Story: the rules ───────────────────────────────────────────────────────

const renderRules = () => {
  const ladderRows: TableRow[] = Object.entries(LADDER).map(([step, L]) => ({ cells: [step, String(L)] }));
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
  return html`
    ${intro('Every colour ramp is three rules: one lightness ladder, a chroma curve per family, and a hue per family. A colour that is not on a ramp is not a Candor colour, and audit:tokens fails on one typed anywhere outside the primitives.')}

    <candor-heading level="h3">Lightness: one ladder</candor-heading>
    <candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block:var(--spacing-xs) var(--spacing-sm);">A step number fixes lightness in every family. The ladder came from the hand-set ramps it replaced: where navy, burgundy and azure agreed it took their value, and where they differed a brand anchor decided.</candor-text>
    ${table('The lightness ladder', ['Step', 'Lightness'], ladderRows, [1])}

    <candor-heading level="h3" style="display:block;margin-block-start:var(--spacing-lg);">Chroma: one curve shape, two dials per family</candor-heading>
    <candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block:var(--spacing-xs);">The curve is the one the grey ramps use. It rises from zero at black, peaks, and falls back to zero at white, which is the shape of what a display can render.</candor-text>
    <p style="${MONO}margin:var(--spacing-sm) 0;">u = L<sup>g</sup><br />C(L) = min(K × (4u(1 − u))<sup>${EXPONENT}</sup>, sRGB maximum at L and H)</p>
    <candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block-end:var(--spacing-sm);">K sets the height of the peak and g moves it: the peak sits at L = 0.5<sup>1/g</sup>. Each family's K and g were fitted so its brand anchor sits exactly on the curve and every step lands within deltaE 2 of the hand-set value it replaced. Where the curve asks for more chroma than sRGB renders, the cap takes over, and chroma is rounded down to three decimals so a value on the boundary never rounds out of gamut.</candor-text>

    <candor-heading level="h3" style="display:block;margin-block-start:var(--spacing-lg);">Hue: constant, except navy</candor-heading>
    <candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block:var(--spacing-xs) var(--spacing-sm);">Each family holds one hue, except navy, which turns toward violet as it lightens so its pale steps read as navy rather than grey-cyan:</candor-text>
    <p style="${MONO}margin:0 0 var(--spacing-sm);">H = ${FAMILIES['navy']!.hue.at} + ${FAMILIES['navy']!.hue.turn} × max(0, L − ${FAMILIES['navy']!.hue.from}) / ${FAMILIES['navy']!.hue.over}</p>

    <candor-heading level="h3" style="display:block;margin-block-start:var(--spacing-lg);">Steps between steps</candor-heading>
    <candor-text variant="body" style="display:block;max-inline-size:40rem;margin-block:var(--spacing-xs) var(--spacing-sm);">Because chroma and hue are functions of lightness, any lightness has a defined colour. When a token needs a lightness the ladder lacks, the ramp gains a step whose number says where it sits. ${exFam}-${exStep} is ${share}% of the way from ${lo} (L ${LADDER[lo]}) to ${hi} (L ${LADDER[hi]}), so L = ${exL}. The curve then gives C ${chroma(exL, exF, EXPONENT)} and the hue rule H ${hueAt(exF, exL).toFixed(2)}, which is what primitives.scss declares: ${exDeclared.value}. Mint a step only when a token needs one, and never move a step's lightness while holding its chroma and hue: that is a colour off the curve.</candor-text>
  `;
};

// ─── Story: chroma curves ───────────────────────────────────────────────────

const W = 320, H = 180, PAD_L = 40, PAD_R = 12, PAD_T = 12, PAD_B = 32;
const SAMPLES = 120;

const curveChart = (name: string) => {
  const f = FAMILIES[name]!;
  const steps = colourRamp(name);
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
  const anchor = f.anchor;
  const pk = peakL(f);
  const label =
    `${cap(name)} chroma against lightness. The curve peaks at L ${r(pk, 2)} with C ${r(curveChroma(pk, f, EXPONENT), 3)}. ` +
    (binds.length
      ? `sRGB caps it at ${binds.length} of ${steps.length} steps: ${binds.map((s) => s.step).join(', ')}. `
      : `sRGB never caps it; every step sits on the curve. `) +
    `The anchor is L ${anchor.L}, C ${anchor.C}.`;
  return html`
    <figure style="margin:0;">
      <candor-heading level="h3">${cap(name)}</candor-heading>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label=${label} style="inline-size:100%;block-size:auto;display:block;">
        <defs><clipPath id="plot-${name}"><rect x=${PAD_L} y=${PAD_T} width=${W - PAD_L - PAD_R} height=${H - PAD_T - PAD_B} /></clipPath></defs>
        <line x1=${PAD_L} y1=${H - PAD_B} x2=${W - PAD_R} y2=${H - PAD_B} stroke="var(--color-border-control)" stroke-width="1" />
        <line x1=${PAD_L} y1=${PAD_T} x2=${PAD_L} y2=${H - PAD_B} stroke="var(--color-border-control)" stroke-width="1" />
        <text x=${PAD_L} y=${H - 8} font-size="11" fill="var(--color-text-subtle)" font-family="var(--font-family-mono)">0</text>
        <text x=${W - PAD_R} y=${H - 8} font-size="11" fill="var(--color-text-subtle)" font-family="var(--font-family-mono)" text-anchor="end">L 1</text>
        <text x=${PAD_L - 4} y=${PAD_T + 10} font-size="11" fill="var(--color-text-subtle)" font-family="var(--font-family-mono)" text-anchor="end">${r(top, 3)}</text>
        <g clip-path="url(#plot-${name})">
          <polyline points=${pts(ceiling)} fill="none" stroke="var(--color-border-control)" stroke-width="1.5" stroke-dasharray="4 4" />
          <polyline points=${pts(raw)} fill="none" stroke="var(--color-text-subtle)" stroke-width="1" stroke-dasharray="1 3" />
          <polyline points=${pts(capped)} fill="none" stroke="var(--color-text-default)" stroke-width="2" />
        </g>
        <circle cx=${x(anchor.L)} cy=${y(anchor.C)} r="8" fill="none" stroke="var(--color-text-default)" stroke-width="1.5" />
        ${steps.map((s) => svg`<circle cx=${x(s.l)} cy=${y(s.c)} r="4" fill="var(${s.name})" stroke="var(--color-text-default)" stroke-width="1" />`)}
      </svg>
      <figcaption>
        <candor-text variant="caption">K ${f.K}, g ${f.g}, peak at L ${r(pk, 2)}. ${binds.length ? `sRGB caps steps ${binds.map((s) => s.step).join(', ')}.` : 'sRGB never caps it.'}</candor-text>
      </figcaption>
    </figure>
  `;
};

const renderCurves = () => html`
  ${intro('One chart per family, chroma against lightness. The solid line is the chroma each step gets. The dotted line is the family curve before the cap, and the dashed line is the most chroma sRGB renders at that lightness and hue; where the curve rises above it, the cap takes over. Dots are the steps, filled with their own colour, and the ring marks the brand anchor. Each chart has its own vertical scale, labelled at the top.')}
  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr));gap:var(--spacing-lg);">
    ${NAMES.map(curveChart)}
  </div>
`;

// ─── Story: parameters ──────────────────────────────────────────────────────

const renderParameters = () => {
  const famRows: TableRow[] = NAMES.map((name) => {
    const f = FAMILIES[name]!;
    const hue = f.hue.turn ? `${f.hue.at} turning ${f.hue.turn}° from L ${f.hue.from}` : String(f.hue.at);
    const anchor = `L ${f.anchor.L}, C ${f.anchor.C}${f.anchor.step ? ` (step ${f.anchor.step})` : ''}${f.anchor.hex ? `, ${f.anchor.hex}` : ''}`;
    return { cells: [cap(name), String(f.K), String(f.g), r(peakL(f), 2), hue, anchor] };
  });
  const extraRows: TableRow[] = Object.entries(EXTRA).flatMap(([fam, steps]) =>
    Object.entries(steps).map(([step, why]) => {
      const s = colourRamp(fam).find((x) => x.step === Number(step))!;
      return { cells: [s.name, s.value, why] };
    }),
  );
  return html`
    ${intro('The fitted values behind every ramp, read from colour-ramp-rules.json. Change a value there and run scripts/derive-colour-ramps.js --write; audit:tokens fails until primitives.scss matches.')}
    ${table('Chroma curve and hue per family', ['Family', 'K', 'g', 'Peak at L', 'Hue', 'Anchor'], famRows, [1, 2, 3])}
    <candor-heading level="h3" style="display:block;margin-block:var(--spacing-lg) var(--spacing-xs);">How each was fitted</candor-heading>
    <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);max-inline-size:40rem;">
      ${NAMES.map((name) => html`<candor-text variant="body"><strong>${cap(name)}.</strong> ${FAMILIES[name]!.fit}</candor-text>`)}
    </div>
    <div style="block-size:var(--spacing-lg);"></div>
    ${table('In-between steps and the token each was minted for', ['Step', 'Value', 'Why it exists'], extraRows, [0, 1])}
  `;
};

const meta: Meta = {
  title: 'Design Tokens/Colour Ramps',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'How Candor derives its colour ramps: one lightness ladder, a chroma curve per family capped by what sRGB renders, and a hue per family. ' +
          'Every value on this page is read from `primitives.scss`, and every rule from `colour-ramp-rules.json` and `colour-ramp-curve.mjs`, the same files `npm run audit:tokens` checks the ramps against (#365). ' +
          'The grey ramps use the same curve shape; see Design Tokens/Grey Ramps.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Ramps: Story = { name: 'The ramps', render: renderRamps };
export const Rules: Story = { name: 'The rules', render: renderRules };
export const Curves: Story = { name: 'Chroma curves', render: renderCurves };
export const Parameters: Story = { name: 'Parameters', render: renderParameters };
