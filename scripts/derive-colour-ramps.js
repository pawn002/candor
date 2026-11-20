#!/usr/bin/env node
/**
 * Derive the colour ramps (navy, burgundy, azure, indigo) from stated rules,
 * the way the grey ramps are derived (#365).
 *
 *   node scripts/derive-colour-ramps.js           check: exit 1 if primitives.scss
 *                                                 disagrees with the rules
 *   node scripts/derive-colour-ramps.js --write   rewrite the ramp declarations
 *
 * The rules:
 *
 *   Lightness  One ladder for every colour ramp, so a step number means the same
 *              lightness in each family and only the hue changes (LADDER below).
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
 * The sRGB maximum is computed here with the standard OKLab matrices, as a
 * boolean renderability search, not a substitution. `audit:tokens` then checks
 * every authored value against klar, which stays the authority on gamut.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'design-tokens', 'primitives.scss');

const LADDER = { 50: 0.97, 100: 0.93, 200: 0.86, 300: 0.76, 400: 0.65, 500: 0.53, 600: 0.44, 700: 0.37, 800: 0.27, 900: 0.2 };

const FAMILIES = {
  navy: { K: 0.062, g: 0.765, hue: (L) => 245.34 + (7.5 * Math.max(0, L - 0.27)) / 0.7, anchor: { L: 0.27, C: 0.06 } },
  burgundy: { K: 0.0839, g: 1.085, hue: () => 347.43, anchor: { L: 0.37, C: 0.08 } },
  azure: { K: 0.1922, g: 2.685, hue: () => 250.8, anchor: { L: 0.65, C: 0.18 } },
  indigo: { K: 0.2117, g: 1.11, hue: () => 278.14, anchor: { L: 0.6, C: 0.21 } },
};

const EXPONENT = 0.44;

function inGamut(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);
}

function maxChroma(L, H) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return lo;
}

const inward = (c) => Math.floor(c * 1000 + 1e-9) / 1000;

function chroma(L, H, { K, g }) {
  const u = L ** g;
  return inward(Math.min(K * (4 * u * (1 - u)) ** EXPONENT, maxChroma(L, H)));
}

const fmt = (n, dp) => n.toFixed(dp).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '.0');

function derive() {
  const out = [];
  for (const [name, fam] of Object.entries(FAMILIES)) {
    const a = fam.anchor;
    const onCurve = chroma(a.L, fam.hue(a.L), fam);
    if (Math.abs(onCurve - a.C) > 1e-9) {
      throw new Error(`${name}: the curve gives C ${onCurve} at the anchor's L ${a.L}, not ${a.C}`);
    }
    for (const [step, L] of Object.entries(LADDER)) {
      const H = fam.hue(L);
      out.push({ name: `--${name}-${step}`, value: `oklch(${L.toFixed(2)} ${fmt(chroma(L, H, fam), 3)} ${H.toFixed(2)})` });
    }
  }
  return out;
}

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

if (write) {
  fs.writeFileSync(FILE, source);
  console.log('✓  colour ramps written from their rules');
} else if (mismatches.length) {
  console.error(`✗  ${mismatches.length} colour ramp step(s) disagree with their rules (scripts/derive-colour-ramps.js):`);
  for (const m of mismatches) console.error(`   ${m}`);
  console.error('   Change the rule, not the value, then run with --write.');
  process.exit(1);
} else {
  console.log(`✓  colour ramps: ${Object.keys(FAMILIES).length} families × ${Object.keys(LADDER).length} steps match their rules`);
}
