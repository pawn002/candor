#!/usr/bin/env node
/**
 * scripts/check-contrast.js
 *
 * Re-measures Candor's recorded contrast against the klar CLI and fails when
 * reality and the repo disagree. Two independent checks:
 *
 *   1. PAIRINGS — every entry in audit/pairings.json, in both modes, measured
 *      against its `min` floor. Entries carrying `exempt` are measured and
 *      reported but never fail the run.
 *   2. RECORDED FIGURES — the OKCA numbers written into token descriptions
 *      (sourced from the `//` comments in semantics.scss and surfaced in
 *      audit/tokens.dtcg.json). These are the justification text a future
 *      contributor reads when deciding whether a colour can move, so a stale
 *      number is a real defect — that is what #211 was filed for, after a
 *      recorded 15.2 survived years of drift from a measured 14.1.
 *
 * Anything the claim parser cannot interpret is listed as UNCHECKED rather than
 * passed over in silence: a guard that quietly covers a subset is worse than no
 * guard, because absence of failure reads as validation (#218).
 *
 * Usage: node scripts/check-contrast.js [--verbose]
 * Requires klar 3.x on PATH.
 *
 * GAMUT: this script measures the colour Candor specifies, full stop. It does
 * not model, predict, or track what any engine does with a colour outside
 * sRGB — that would be an arms race, and Candor does not enter it. Instead
 * every authored value is inside sRGB by invariant (#225, gated by
 * `npm run audit:tokens`), so there is nothing for an engine to resolve and
 * the specified colour and the delivered colour are the same colour.
 *
 * That is also what makes these numbers *defined*. OKCA is established across
 * the sRGB gamut; a colour outside it is outside the algorithm's domain, so a
 * score for one is not a permissive figure, it is a meaningless one. So this
 * script deliberately does NOT pass --allow-out-of-gamut: klar exits 1 on such
 * input, and that failure is surfaced rather than suppressed.
 *
 * --gamut-map is pinned for reproducibility, not policy. klar honours a
 * KLAR_GAMUT_MAP environment variable that changes the mapping process-wide,
 * so an unpinned command would give different figures on a machine that has
 * it set; an explicit flag overrides the variable, which is what keeps this
 * audit environment-independent. (The variable does not waive the exit-1
 * failure, so it cannot be used to sneak an out-of-gamut colour through.)
 * Which value is pinned cannot matter for Candor colours: with the invariant
 * holding, `clip` and `css` return identical values on all 216 measurements.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');

const dtcg = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/tokens.dtcg.json'), 'utf8'));
const pairings = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/pairings.json'), 'utf8')).pairings;

// ── klar ─────────────────────────────────────────────────────────────────────

/**
 * OKCA is polarity-aware: contrast(fg, bg) !== contrast(bg, fg). Order matters.
 *
 * An out-of-gamut input is treated as a broken audit, not a measurement. klar
 * exits 1 for one (execSync throws), and we let that stop the run with a
 * pointer to the gate rather than reporting a number: OKCA is defined across
 * the sRGB gamut, so a score for a colour outside it is undefined rather than
 * merely optimistic, and continuing would put a meaningless figure in a report
 * whose whole job is to be trustworthy.
 *
 * This should be unreachable — `npm run audit:tokens` fails long before a
 * value gets here — but the two checks are independent on purpose, and this
 * one refuses to paper over the other one having been skipped.
 */
function okca(fg, bg) {
  const cmd = `klar contrast "${fg}" "${bg}" --gamut-map clip -q`;
  let out;
  try {
    out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    console.error(
      `\n✗  klar could not measure ${fg} on ${bg}.\n` +
        `   If either colour is outside sRGB, that is the defect — OKCA is not\n` +
        `   defined there. Run 'npm run audit:tokens' for the offending declaration.\n` +
        `   klar said: ${String(err.stderr || '').trim() || `exit ${err.status}`}`
    );
    process.exit(2);
  }
  const n = Number(out);
  if (!Number.isFinite(n)) throw new Error(`klar returned "${out}" for ${fg} on ${bg}`);
  return n;
}

function assertKlar3() {
  let v;
  try {
    v = execSync('klar --version', { encoding: 'utf8' }).trim();
  } catch {
    console.error('✗  klar is not on PATH. Install klar 3.x — see CLAUDE.md → Integration Points.');
    process.exit(2);
  }
  if (!/^3\./.test(v)) {
    console.error(
      `✗  klar ${v} found, but every figure in this repo assumes 3.x.\n` +
        '   2.x scored through an 8-bit hex round-trip, so its figures are off by up to\n' +
        '   0.1 — and it silently substituted a different colour for out-of-gamut input\n' +
        '   instead of refusing, which is how #222 stayed hidden.'
    );
    process.exit(2);
  }
}

// ── token lookup ─────────────────────────────────────────────────────────────

/** Walk a dotted DTCG path. Returns the node, or null. */
function node(mode, dotted) {
  let cur = dtcg[mode];
  for (const seg of dotted.split('.')) {
    cur = cur?.[seg];
    if (cur === undefined) return null;
  }
  return cur ?? null;
}

function value(mode, dotted) {
  return node(mode, dotted)?.$value ?? null;
}

/** {color.text.default} → color.text.default */
const deref = (ref) => ref.replace(/^\{|\}$/g, '');

// ── 1. pairings ──────────────────────────────────────────────────────────────

function checkPairings() {
  const failures = [];
  const unresolved = [];
  let checked = 0;
  let exempted = 0;

  for (const p of pairings) {
    for (const mode of ['light', 'dark']) {
      const fg = value(mode, deref(p.fg));
      const bg = value(mode, deref(p.bg));
      if (!fg || !bg) {
        unresolved.push(`${p.id} [${mode}] — ${!fg ? p.fg : p.bg} does not resolve`);
        continue;
      }
      // Alpha-composited values would need a blend against the backdrop before
      // measuring; klar reads them literally, so skip rather than report a
      // number that is wrong in a way nobody would notice.
      if (fg.includes('/') || bg.includes('/')) {
        unresolved.push(`${p.id} [${mode}] — alpha value, not measurable without compositing`);
        continue;
      }
      const measured = okca(fg, bg);
      if (p.exempt) {
        exempted++;
        if (VERBOSE) console.log(`  exempt  ${p.id} [${mode}] ${measured} (${p.exempt})`);
        continue;
      }
      checked++;
      if (measured < p.min) {
        failures.push(`${p.id} [${mode}] — measured ${measured}, floor ${p.min}`);
      } else if (VERBOSE) {
        console.log(`  ok      ${p.id} [${mode}] ${measured} ≥ ${p.min}`);
      }
    }
  }

  return { failures, unresolved, checked, exempted };
}

// ── 2. recorded figures ──────────────────────────────────────────────────────

// Dark is an override layer: a token the dark mixin does not redeclare keeps the
// light declaration — and, in the artifact, the light comment. Its recorded figure
// is then a statement about light only, so measuring it in dark reports a drift
// that isn't one. Read the mixin to find out which names dark actually declares.
function darkDeclaredNames() {
  const scss = fs.readFileSync(path.join(ROOT, 'src/design-tokens/semantics.scss'), 'utf8');
  const start = scss.indexOf('@mixin dark-color-tokens');
  let depth = 0, i = scss.indexOf('{', start);
  const bodyStart = i + 1;
  for (; i < scss.length; i++) {
    if (scss[i] === '{') depth++;
    if (scss[i] === '}') { depth--; if (depth === 0) break; }
  }
  const body = scss.slice(bodyStart, i);
  const names = new Set();
  for (const m of body.matchAll(/^\s*(--[\w-]+)\s*:/gm)) {
    // --color-status-error-bg → color.status.error-bg, matching toDtcgPath's shape
    names.add(m[1]);
  }
  return names;
}

// Foregrounds named ahead of the figure ("text-default OKCA 10.3 on this bg").
// Anything else preceding the figure is ignored and the declaring token is used.
const FG_ALIASES = {
  'text-default': 'color.text.default',
  white: 'oklch(1 0 0)',
};

// Backgrounds named in the comments, mapped to their DTCG path. Names that are
// not here are reported as UNCHECKED rather than guessed at.
const BG_ALIASES = {
  page: 'color.bg.page',
  'bg-page': 'color.bg.page',
  surface: 'color.bg.surface',
  'bg-surface': 'color.bg.surface',
  inverse: 'color.bg.inverse',
  'bg-inverse': 'color.bg.inverse',
  white: null, // literal
  'error-bg': 'color.status.error-bg',
  'success-bg': 'color.status.success-bg',
  'warning-bg': 'color.status.warning-bg',
  'action-primary': 'color.action.primary',
  'this bg': 'SELF',
};

/**
 * Collect every OKCA figure recorded in a token description.
 *
 * Grammar: [<fg-name>] [was] OKCA <n> [on <bg-name>]
 *   "OKCA 5.0 on page"                  → this token on color.bg.page
 *   "text-default OKCA 10.3 on this bg" → color.text.default on this token
 *   "was OKCA 3.8"                      → historical, skipped
 * Anything else is UNCHECKED, never assumed.
 */
// The fg-name group must not swallow the "was" marker, or every historical
// figure would be re-measured against the current value and always "drift".
const CLAIM_RE =
  /(?:(?!was\s)([a-z0-9-]+)\s+)?(was\s+)?OKCA\s+(\d+(?:\.\d+)?)(?:\s+on\s+(this bg|[a-z-]+))?/gi;

function claimsFor(mode, dotted, description) {
  const out = [];
  for (const m of description.matchAll(CLAIM_RE)) {
    const [, fgName, historical, num, target] = m;
    if (historical) { out.push({ kind: 'historical' }); continue; }
    const key = target?.toLowerCase();
    if (!key || !(key in BG_ALIASES)) { out.push({ kind: 'unchecked', text: m[0].trim() }); continue; }

    const bgPath = BG_ALIASES[key];
    const bg = bgPath === null ? 'oklch(1 0 0)'
      : bgPath === 'SELF' ? value(mode, dotted)
      : value(mode, bgPath);

    const fgAlias = fgName && FG_ALIASES[fgName.toLowerCase()];
    const fg = fgAlias
      ? (fgAlias.startsWith('oklch(') ? fgAlias : value(mode, fgAlias))
      : value(mode, dotted);

    if (!fg || !bg) { out.push({ kind: 'unchecked', text: m[0].trim() }); continue; }
    out.push({ kind: 'checkable', claimed: Number(num), fg, bg, target: key });
  }
  return out;
}

function walk(mode, obj, prefix, visit) {
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && '$value' in v) visit(prefix ? `${prefix}.${k}` : k, v);
    else if (v && typeof v === 'object') walk(mode, v, prefix ? `${prefix}.${k}` : k, visit);
  }
}

function checkRecordedFigures() {
  const drift = [];
  const unchecked = [];
  let checked = 0;
  let historical = 0;
  let inherited = 0;

  const darkDeclared = darkDeclaredNames();
  // color.status.error-bg → --color-status-error-bg (DTCG paths only ever split
  // a custom-property name on its own hyphens, so rejoining round-trips).
  const cssVar = (dotted) => '--' + dotted.split('.').join('-');

  for (const mode of ['light', 'dark']) {
    walk(mode, dtcg[mode], '', (dotted, tok) => {
      if (!tok.$description) return;
      if (mode === 'dark' && !darkDeclared.has(cssVar(dotted))) { inherited++; return; }
      for (const c of claimsFor(mode, dotted, tok.$description)) {
        if (c.kind === 'historical') { historical++; continue; }
        if (c.kind === 'unchecked') { unchecked.push(`${dotted} [${mode}] — "${c.text}"`); continue; }
        checked++;
        const measured = okca(c.fg, c.bg);
        if (measured !== c.claimed) {
          drift.push(`${dotted} [${mode}] on ${c.target} — recorded ${c.claimed}, measured ${measured}`);
        } else if (VERBOSE) {
          console.log(`  ok      ${dotted} [${mode}] on ${c.target} ${measured}`);
        }
      }
    });
  }

  return { drift, unchecked, checked, historical, inherited };
}

// ── main ─────────────────────────────────────────────────────────────────────

assertKlar3();

console.log('Pairings (audit/pairings.json)');
const P = checkPairings();
console.log(`  ${P.checked} enforced, ${P.exempted} exempt, ${P.failures.length} failing`);
for (const f of P.failures) console.log(`  ✗  ${f}`);
for (const u of P.unresolved) console.log(`  ?  UNCHECKED ${u}`);

console.log('\nRecorded figures (token descriptions)');
const R = checkRecordedFigures();
console.log(
  `  ${R.checked} re-measured, ${R.historical} historical + ${R.inherited} light-authored-inherited-by-dark (skipped), ${R.drift.length} drifted`
);
for (const d of R.drift) console.log(`  ✗  ${d}`);
for (const u of R.unchecked) console.log(`  ?  UNCHECKED ${u}`);

const failed = P.failures.length + R.drift.length;
console.log(failed ? `\n✗  ${failed} problem(s)` : '\n✓  no drift');
process.exit(failed ? 1 : 0);
