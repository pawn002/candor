import { differenceCiede2000 } from 'culori';
import type { ToneCell, ToneRow } from './candor-tone-picker';

const cie2000 = differenceCiede2000();

// Transforms klar `variants` output into ToneRow[] for <candor-tone-picker>.
// Each cell carries full OKLCH metadata; disabled=true marks out-of-sRGB-gamut cells.
export function buildGamutRows(
  grid: Array<Array<{ l: number; c: number; h: number; ig: boolean }>>,
  anchorL: number,
  anchorC: number,
  anchorH: number,
): ToneRow[] {
  return grid.map((row) => ({
    rowHeader: `L ${row[0].l.toFixed(2)}`,
    cells: row.map(({ l, c, h, ig }): ToneCell => {
      const isAnchor = Math.abs(l - anchorL) < 0.001 && Math.abs(c - anchorC) < 0.001;
      const de = ig && !isAnchor
        ? Math.round(cie2000({ mode: 'oklch', l, c, h }, { mode: 'oklch', l: anchorL, c: anchorC, h: anchorH }))
        : 0;
      return {
        label: ig
          ? isAnchor
            ? `anchor`
            : `ΔE ${de} from anchor`
          : `out of gamut`,
        value: ig ? { l, c, h } : undefined,
        background: ig ? `oklch(${l} ${c} ${h})` : undefined,
        foreground: ig ? (l > 0.5 ? `oklch(0.2 0.04 ${h})` : `oklch(0.95 0.01 ${h})`) : undefined,
        disabled: !ig,
      };
    }),
  }));
}

// ─── Navy — H 245.34 ──────────────────────────────────────────────────────────
// Anchor: L=0.27 C=0.060 (navy-800 → --color-action-primary)
export const NAVY_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9367, 0.8256, 0.7144, 0.6033, 0.4922, 0.3811, 0.2700, 0.1589, 0.0478];
    const C = [0.0129, 0.0600, 0.1071, 0.1543, 0.2014, 0.2486, 0.2957];
    const IG = [
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 245.34, ig: !!IG[ri][ci] })));
  })(),
  0.27, 0.06, 245.34,
);
export const NAVY_GAMUT_HEADERS = ['C 0.013', 'C 0.060', 'C 0.107', 'C 0.154', 'C 0.201', 'C 0.249', 'C 0.296'];

// ─── Burgundy — H 347.43 ──────────────────────────────────────────────────────
// Anchor: L=0.37 C=0.080 (burgundy-700 → --color-action-secondary)
export const BURGUNDY_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9256, 0.8144, 0.7033, 0.5922, 0.4811, 0.3700, 0.2589, 0.1478, 0.0367];
    const C = [0.0329, 0.0800, 0.1271, 0.1743, 0.2214, 0.2686, 0.3157];
    const IG = [
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 347.43, ig: !!IG[ri][ci] })));
  })(),
  0.37, 0.08, 347.43,
);
export const BURGUNDY_GAMUT_HEADERS = ['C 0.033', 'C 0.080', 'C 0.127', 'C 0.174', 'C 0.221', 'C 0.269', 'C 0.316'];

// ─── Azure — H 250.80 ─────────────────────────────────────────────────────────
// Anchor: L=0.65 C=0.180 (azure-400 → --color-focus)
export const AZURE_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9833, 0.8722, 0.7611, 0.6500, 0.5389, 0.4278, 0.3167, 0.2056, 0.0944];
    const C = [0.0386, 0.0857, 0.1329, 0.1800, 0.2271, 0.2743, 0.3214];
    const IG = [
      [0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 250.80, ig: !!IG[ri][ci] })));
  })(),
  0.65, 0.18, 250.80,
);
export const AZURE_GAMUT_HEADERS = ['C 0.039', 'C 0.086', 'C 0.133', 'C 0.180', 'C 0.227', 'C 0.274', 'C 0.321'];

// ─── Indigo — H 278.14 ───────────────────────────────────────────────────────
// Anchor: L=0.60 C=0.210 (indigo-500, brand anchor → --color-highlight)
export const INDIGO_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9333, 0.8222, 0.7111, 0.6000, 0.4889, 0.3778, 0.2667, 0.1556, 0.0444];
    const C = [0.0214, 0.0686, 0.1157, 0.1629, 0.2100, 0.2571, 0.3043];
    const IG = [
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 278.14, ig: !!IG[ri][ci] })));
  })(),
  0.60, 0.21, 278.14,
);
export const INDIGO_GAMUT_HEADERS = ['C 0.021', 'C 0.069', 'C 0.116', 'C 0.163', 'C 0.210', 'C 0.257', 'C 0.304'];
