// The colour-ramp curve: the maths that turns colour-ramp-rules.json into
// oklch values. One copy, imported by scripts/derive-colour-ramps.js (which
// gates primitives.scss against it) and by Design Tokens/Colour Ramps (which
// draws it), so the page cannot describe a different curve from the one checked.
//
// The sRGB maximum here is a boolean renderability search with the standard
// OKLab matrices, not a substitution. klar stays the authority on gamut: the
// audit checks every authored value with it.

/** Hue at lightness L. Constant, unless the family turns (navy). */
export function hueAt(family, L) {
  const { at, turn = 0, from = 0, over = 1 } = family.hue;
  return at + (turn * Math.max(0, L - from)) / over;
}

/**
 * Lightness of a step number: the ladder's own value, or a straight line
 * between the ladder steps either side (navy-670 is 70% of the way from 600 to 700).
 */
export function stepLightness(ladder, step) {
  if (ladder[step] !== undefined) return ladder[step];
  const keys = Object.keys(ladder).map(Number).sort((a, b) => a - b);
  const hi = keys.find((k) => k > step);
  const lo = [...keys].reverse().find((k) => k < step);
  if (lo === undefined || hi === undefined) throw new Error(`step ${step} is outside the ladder`);
  const L = ladder[lo] + ((step - lo) / (hi - lo)) * (ladder[hi] - ladder[lo]);
  return Math.round(L * 10000) / 10000;
}

export function inGamut(L, C, H) {
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

/** The most chroma sRGB renders at this lightness and hue. */
export function maxChroma(L, H) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** The family's curve before the sRGB cap: K * (4u(1 - u)) ^ exponent, u = L ^ g. */
export function curveChroma(L, family, exponent) {
  const u = L ** family.g;
  return family.K * (4 * u * (1 - u)) ** exponent;
}

/** Round inward: the boundary value is exactly on the gamut edge, so never round up. */
export const inward = (c) => Math.floor(c * 1000 + 1e-9) / 1000;

/** The chroma a step gets: the curve, capped by sRGB, rounded inward to 3dp. */
export function chroma(L, family, exponent) {
  return inward(Math.min(curveChroma(L, family, exponent), maxChroma(L, hueAt(family, L))));
}
