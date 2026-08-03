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
 *   3. STORY FIGURES — the same numbers written into story prose. Check 2 was
 *      scoped to token comments while the convention it enforces ("every
 *      recorded figure must be re-measurable") was never so limited, so this
 *      third surface drifted freely (#223). It is the surface developers copy
 *      from, and it is where the tier rules are taught by worked example — a
 *      story that argues from a stale number teaches the wrong threshold.
 *
 *      Values are a different problem from figures and get a different fix: a
 *      story that *displays* a token's colour reads it from the artifact via
 *      src/web-components/design-tokens/token-values.ts, so there is no copy to
 *      go stale. Only prose — where the number is part of an argument and
 *      cannot be derived — is guarded here.
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
        '\n' +
        '   This guard is deliberately a hard stop rather than a warning, because it is\n' +
        '   the only thing in the repo that forces klar\'s docs to be re-read. A linked\n' +
        '   reference gets skipped; a failing build does not.\n' +
        '\n' +
        '   BEFORE widening this check, read BOTH:\n' +
        '     https://github.com/pawn002/klar/blob/main/README.md          (command reference)\n' +
        '     https://github.com/pawn002/klar/blob/main/AGENT_PLAYBOOK.md  (worked examples)\n' +
        '   and verify the claims against the installed CLI — on the 2.x→3.x bump the\n' +
        '   release notes and the issue-resolution comment disagreed about the shipped\n' +
        '   default, and only testing the binary settled it.\n' +
        '\n' +
        '   Then check each of these, which is what actually changed last time:\n' +
        '     1. Did the default algorithm recalibrate? (2.0.0 moved OKCA +0.4 in the 3-7\n' +
        '        band.) If so EVERY recorded figure is stale, not just the failing ones.\n' +
        '     2. Did scoring precision change? (3.0.0 went full-precision; 102 of 216\n' +
        '        pairings moved by 0.1.)\n' +
        '     3. Do flags this script relies on still mean the same thing? It pins\n' +
        '        --gamut-map (KLAR_GAMUT_MAP can otherwise change results per-machine)\n' +
        '        and deliberately omits --allow-out-of-gamut so exit 1 stays fatal.\n' +
        '     4. Did the exit-code contract change? 0/1/2 is load-bearing here.\n' +
        '\n' +
        '   Re-baseline with `npm run audit:contrast` and update CLAUDE.md -> Integration\n' +
        '   Points in the same commit. Do not widen the range and move on.'
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
// A target may name a mode explicitly ("OKCA 3.5 on dark page"). That is not
// redundancy: a token declared only in the light mixin is *inherited* by dark,
// so its single comment is the only place its dark behaviour can be recorded —
// and without this, that figure is unverifiable where it necessarily lives
// (#217, #218). Absent a prefix, the claim is about the mode being walked.
const CLAIM_RE =
  /(?:(?!was\s)([a-z0-9-]+)\s+)?(was\s+)?OKCA\s+(\d+(?:\.\d+)?)(?:\s+on\s+(this bg|(?:dark|light)\s+[a-z-]+|[a-z-]+))?/gi;

function claimsFor(mode, dotted, description) {
  const out = [];
  for (const m of description.matchAll(CLAIM_RE)) {
    const [, fgName, historical, num, target] = m;
    if (historical) { out.push({ kind: 'historical' }); continue; }
    let key = target?.toLowerCase();
    // An explicit "dark …" / "light …" prefix overrides the mode being walked.
    let claimMode = mode;
    const modePrefix = key && /^(dark|light)\s+(.+)$/.exec(key);
    if (modePrefix) { claimMode = modePrefix[1]; key = modePrefix[2]; }
    if (!key || !(key in BG_ALIASES)) { out.push({ kind: 'unchecked', text: m[0].trim() }); continue; }

    const bgPath = BG_ALIASES[key];
    const bg = bgPath === null ? 'oklch(1 0 0)'
      : bgPath === 'SELF' ? value(claimMode, dotted)
      : value(claimMode, bgPath);

    const fgAlias = fgName && FG_ALIASES[fgName.toLowerCase()];
    const fg = fgAlias
      ? (fgAlias.startsWith('oklch(') ? fgAlias : value(claimMode, fgAlias))
      : value(claimMode, dotted);

    if (!fg || !bg) { out.push({ kind: 'unchecked', text: m[0].trim() }); continue; }
    out.push({ kind: 'checkable', claimed: Number(num), fg, bg, target: modePrefix ? `${claimMode} ${key}` : key });
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

// ── 3. recorded figures in story prose ───────────────────────────────────────

/**
 * A token comment has a free anchor: the declaration it sits on says which
 * colour the figure is about. Story prose has none — that is the gap #223
 * identified — so the anchor must be written into the sentence. Two forms
 * count, both of which a reader needs anyway for the sentence to mean
 * anything:
 *
 *   a custom property   "--color-text-subtle (OKCA 5.0 on page) fails …"
 *   a hex literal       "**Navy** `#082840` — primary action (OKCA 13.9 on white)"
 *
 * The anchor is the nearest one to the LEFT of the figure, which is what lets a
 * single line carry two claims about two colours ("decorative at OKCA 2.6 on
 * white; `--color-link` steps to L=0.49 for OKCA 5.3 on white").
 *
 * Unanchored figures are UNCHECKED, never guessed. Guessing is how a guard
 * ends up reporting a number about the wrong colour, which is worse than
 * reporting nothing.
 */
const STORY_GLOB_DIRS = ['src'];
const STORY_FILE_RE = /\.stories\.ts$/;

const ANCHOR_RE = /--[a-z][a-z0-9-]*|#[0-9a-fA-F]{6}\b/g;
const STORY_CLAIM_RE = /OKCA\s+(\d+(?:\.\d+)?)(?:\s+on\s+((?:dark|light)\s+[a-z-]+|[a-z-]+))?/gi;

// "OKCA 4.5 bold threshold" states the floor a component must clear; it is not
// a claim about any colour, so measuring it would invent a failure. The tier
// tables are the source for these, and they are prose by nature.
const THRESHOLD_RE = /^\s*(?:\S+\s+)?(?:threshold|floor|minimum)\b/i;

/** cssVar → dotted DTCG path, built by walking the artifact (names do not decompose naively). */
function cssVarIndex() {
  const index = new Map();
  walk('light', dtcg.light, '', (dotted) => index.set('--' + dotted.split('.').join('-'), dotted));
  return index;
}

function storyFiles() {
  const out = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (STORY_FILE_RE.test(entry.name)) out.push(full);
    }
  };
  for (const d of STORY_GLOB_DIRS) visit(path.join(ROOT, d));
  return out.sort();
}

function checkStoryFigures() {
  const drift = [];
  const unchecked = [];
  let checked = 0;
  let thresholds = 0;

  const byCssVar = cssVarIndex();

  for (const file of storyFiles()) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

    lines.forEach((line, i) => {
      const where = `${rel}:${i + 1}`;
      for (const m of line.matchAll(STORY_CLAIM_RE)) {
        const rest = line.slice(m.index + m[0].length);
        if (THRESHOLD_RE.test(rest)) { thresholds++; continue; }

        let key = m[2]?.toLowerCase();
        let mode = 'light';
        const modePrefix = key && /^(dark|light)\s+(.+)$/.exec(key);
        if (modePrefix) { mode = modePrefix[1]; key = modePrefix[2]; }

        if (!key || !(key in BG_ALIASES)) {
          unchecked.push(`${where} — "${m[0].trim()}" names no background the audit knows`);
          continue;
        }

        // Nearest anchor to the left of the figure.
        const before = line.slice(0, m.index);
        const anchors = [...before.matchAll(ANCHOR_RE)];
        const anchor = anchors.length ? anchors[anchors.length - 1][0] : null;
        if (!anchor) {
          unchecked.push(`${where} — "${m[0].trim()}" has no token or hex anchor to its left`);
          continue;
        }

        const fg = anchor.startsWith('#')
          ? anchor
          : byCssVar.has(anchor)
            ? value(mode, byCssVar.get(anchor))
            : null;
        if (!fg) {
          unchecked.push(`${where} — anchor ${anchor} does not resolve to a token value`);
          continue;
        }

        const bgPath = BG_ALIASES[key];
        const bg = bgPath === null ? 'oklch(1 0 0)' : bgPath === 'SELF' ? null : value(mode, bgPath);
        if (!bg) {
          unchecked.push(`${where} — "${m[0].trim()}" resolves no background ("this bg" needs a declaring token)`);
          continue;
        }

        checked++;
        const claimed = Number(m[1]);
        const measured = okca(fg, bg);
        if (measured !== claimed) {
          drift.push(`${where} — ${anchor} on ${modePrefix ? `${mode} ${key}` : key}: recorded ${claimed}, measured ${measured}`);
        } else if (VERBOSE) {
          console.log(`  ok      ${where} ${anchor} on ${key} ${measured}`);
        }
      }
    });
  }

  return { drift, unchecked, checked, thresholds };
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

console.log('\nStory figures (prose in *.stories.ts)');
const S = checkStoryFigures();
console.log(`  ${S.checked} re-measured, ${S.thresholds} threshold statement(s) (not claims), ${S.drift.length} drifted`);
for (const d of S.drift) console.log(`  ✗  ${d}`);
for (const u of S.unchecked) console.log(`  ?  UNCHECKED ${u}`);

const failed = P.failures.length + R.drift.length + S.drift.length;
console.log(failed ? `\n✗  ${failed} problem(s)` : '\n✓  no drift');
process.exit(failed ? 1 : 0);
