#!/usr/bin/env node
/**
 * Derive the colour ramps (navy, burgundy, azure, indigo, teal, and the status ramps
 * red, gold and green) from stated rules, and check the grey ramps (neutral, cool,
 * warm) against the same curve on their own ladder (#365).
 *
 *   node scripts/derive-colour-ramps.js           check: exit 1 if primitives.scss
 *                                                 disagrees with the rules
 *   node scripts/derive-colour-ramps.js --write   rewrite the ramp declarations
 *
 * The rules live in src/design-tokens/colour-ramp-rules.json (the parameters,
 * and the reason each in-between step was minted) and src/design-tokens/
 * colour-ramp-curve.mjs (the maths). Design Tokens/Ramps reads the same
 * two files, so the page and this check cannot describe different curves.
 *
 * The rules:
 *
 *   Lightness  One ladder for every colour ramp, so a step number means the same
 *              lightness in each family and only the hue changes (`ladder`).
 *              Where navy, burgundy and azure already agreed it is that value;
 *              where they differed by 0.01 a brand anchor decides (400 = azure,
 *              700 = burgundy, 800 = navy); otherwise the majority.
 *
 *   Chroma     The grey-ramp curve, capped by what sRGB renders, rounded inward
 *              to three decimals:
 *                u = L ^ g
 *                C(L) = min(K * (4u(1 - u)) ^ 0.44, sRGB max at L and H)
 *              K sets the peak height and g moves the peak. Each family's K and
 *              g were fitted to the hand-set values they replaced (every step
 *              within deltaE 2) with the brand anchor held exactly on the curve.
 *
 *   Hue        Constant per family, except navy, which turns toward violet as it
 *              lightens: H = 245.34 + 7.5 * max(0, L - 0.27) / 0.70.
 *
 * Indigo's anchor (#6969F7, L 0.60) sits on its curve between steps 400 and 500
 * rather than on a step, since indigo joined the shared ladder.
 *
 * Teal exists for the code-block background, and its curve is fitted through
 * both of them: oklch(0.92 0.018 195) light and oklch(0.22 0.02 195) dark, which
 * it reproduces as teal-115 and teal-870 (deltaE 0). Two low-chroma anchors give
 * a quiet grey-green peaking near C 0.027, a sibling of the cool greys. A vivid
 * teal, if a component ever needs one, would be its own family with its own
 * anchor rather than a reshaped curve.
 *
 *   Between   A ramp may carry a step between two ladder steps when a token needs
 *              one (`extraSteps`). Its number fixes its lightness by
 *              straight-line interpolation between the ladder steps either side,
 *              so navy-670 is 70% of the way from 600 (L 0.44) to 700 (L 0.37),
 *              L 0.391; chroma and hue then follow the family's curve, as for
 *              any step. The name is the specification: a designer can read
 *              where it sits, and this script checks it like every other step.
 *              Mint one only when a token needs it, never speculatively.
 *
 * The status ramps share one curve shape (g = 1), so "how vivid is a status
 * colour at this lightness" has one answer for all three; each K is set so the
 * curve passes through that hue's light text colour from before it had a ramp.
 *
 *   Tint       Each status ramp also has a -tint: the dark surface step
 *              (--gray-cool-850) with its lightness and chroma kept and the
 *              ramp's hue swapped in. It is the dark status fill. The deep end
 *              of the ramp is far too saturated to sit behind text, and a tint
 *              tied to the surface moves with it.
 *
 * The sRGB maximum is computed here with the standard OKLab matrices, as a
 * boolean renderability search, not a substitution. `audit:tokens` then checks
 * every authored value against klar, which stays the authority on gamut.
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const FILE = path.join(__dirname, '..', 'src', 'design-tokens', 'primitives.scss');
const RULES = require(path.join(__dirname, '..', 'src', 'design-tokens', 'colour-ramp-rules.json'));
const { ladder: LADDER, exponent: EXPONENT, families: FAMILIES } = RULES;
const EXTRA_STEPS = Object.fromEntries(
  Object.entries(RULES.extraSteps).map(([fam, steps]) => [fam, Object.keys(steps).map(Number)]),
);

const fmt = (n, dp) => n.toFixed(dp).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '.0');

const SURFACE = (() => {
  const m = fs.readFileSync(FILE, 'utf8').match(/--gray-cool-850:\s*oklch\(([\d.]+) ([\d.]+) /);
  if (!m) throw new Error('--gray-cool-850 not found: the status tints are defined from it');
  return { L: m[1], C: m[2] };
})();

async function main() {
  // The curve maths is an ES module shared with the Design Tokens/Ramps story.
  const { hueAt, stepLightness, chroma } = await import(
    pathToFileURL(path.join(__dirname, '..', 'src', 'design-tokens', 'colour-ramp-curve.mjs')).href
  );

  const derive = () => {
    const out = [];
    for (const [name, fam] of Object.entries(FAMILIES)) {
      const a = fam.anchor;
      const onCurve = chroma(a.L, fam, EXPONENT);
      if (Math.abs(onCurve - a.C) > 1e-9) {
        throw new Error(`${name}: the curve gives C ${onCurve} at the anchor's L ${a.L}, not ${a.C}`);
      }
      for (const [step, L] of Object.entries(LADDER)) {
        out.push({ name: `--${name}-${step}`, value: `oklch(${L.toFixed(2)} ${fmt(chroma(L, fam, EXPONENT), 3)} ${hueAt(fam, L).toFixed(2)})` });
      }
      for (const step of EXTRA_STEPS[name] || []) {
        const L = stepLightness(LADDER, step);
        out.push({ name: `--${name}-${step}`, value: `oklch(${fmt(L, 4)} ${fmt(chroma(L, fam, EXPONENT), 3)} ${hueAt(fam, L).toFixed(2)})` });
      }
      if (fam.tint) out.push({ name: `--${name}-tint`, value: `oklch(${SURFACE.L} ${SURFACE.C} ${hueAt(fam, 0).toFixed(2)})` });
    }
    return out;
  };

  const write = process.argv.includes('--write');
  let source = fs.readFileSync(FILE, 'utf8');
  const mismatches = [];

  for (const { name, value } of derive()) {
    const re = new RegExp(String.raw`(${name}:\s*)(oklch\([^)]*\))`);
    const m = source.match(re);
    if (!m) {
      mismatches.push(`${name} is missing from primitives.scss`);
      continue;
    }
    if (m[2] !== value) {
      if (write) source = source.replace(re, `$1${value}`);
      else mismatches.push(`${name}: authored ${m[2]}, rules give ${value}`);
    }
  }

  // The grey ramps: their own ladder, placed by need, and the same curve. Compared
  // as numbers, since the declarations predate the derivation and their
  // formatting (0.30, 0.010) is not worth churning.
  const GREYS = RULES.greys;
  let greySteps = 0;
  for (const fam of Object.values(GREYS.families)) {
    const expected = new Set();
    for (const [step, L] of Object.entries(GREYS.ladder)) {
      if (Number(step) < (fam.from ?? 0)) continue;
      const name = `--${fam.prefix}-${step}`;
      expected.add(name);
      greySteps++;
      const C = chroma(L, fam, EXPONENT);
      const H = hueAt(fam, L);
      const re = new RegExp(String.raw`(${name}:\s*)oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)`);
      const m = source.match(re);
      if (!m) {
        mismatches.push(`${name} is missing from primitives.scss`);
        continue;
      }
      if (Number(m[2]) !== L || Math.abs(Number(m[3]) - C) > 1e-9 || Number(m[4]) !== H) {
        const value = `oklch(${L} ${fmt(C, 3)} ${H})`;
        if (write) source = source.replace(re, `$1${value}`);
        else mismatches.push(`${name}: authored oklch(${m[2]} ${m[3]} ${m[4]}), rules give ${value}`);
      }
    }
    // A grey step the rules do not name is a colour nobody derived.
    for (const m of source.matchAll(new RegExp(String.raw`(--${fam.prefix}-\d+):`, 'g'))) {
      if (!expected.has(m[1])) mismatches.push(`${m[1]} is declared but not in the grey ladder`);
    }
  }

  if (write) {
    fs.writeFileSync(FILE, source);
    console.log('✓  colour ramps written from their rules');
  } else if (mismatches.length) {
    console.error(`✗  ${mismatches.length} colour ramp step(s) disagree with their rules (src/design-tokens/colour-ramp-rules.json):`);
    for (const m of mismatches) console.error(`   ${m}`);
    console.error('   Change the rule, not the value, then run with --write.');
    process.exit(1);
  } else {
    console.log(`✓  colour ramps: ${Object.keys(FAMILIES).length} families × ${Object.keys(LADDER).length} steps, ${Object.values(EXTRA_STEPS).flat().length} in-between step(s) and ${Object.values(FAMILIES).filter((f) => f.tint).length} tints, match their rules; greys: ${Object.keys(RULES.greys.families).length} ramps, ${greySteps} steps`);
  }
}

main().catch((err) => {
  console.error(`✗  ${err.message}`);
  process.exit(1);
});
