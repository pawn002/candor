#!/usr/bin/env node
/**
 * scripts/export-tokens-dtcg.js
 *
 * Generates audit/tokens.dtcg.json from the Candor design token SCSS files.
 * Resolves all var() references and annotates non-text tokens via $extensions.
 *
 * Also enforces the sRGB gamut invariant (#225): every authored colour must be
 * renderable in sRGB. An out-of-gamut OKLCH value is not a specification — it
 * delegates the final colour to whatever consumes it, so the token stops being
 * one colour, and every contrast figure recorded against it is undefined
 * rather than merely optimistic (OKCA is established across the sRGB gamut).
 *
 * Candor does not model or track how such values get resolved downstream —
 * that is an arms race this project does not enter. The invariant makes the
 * question moot: keep every value inside the gamut and there is nothing left
 * for anyone to resolve.
 *
 * The gate lives here rather than in check-contrast.js because gamut is a
 * property of a *token*, not of a pairing: this script sees every declaration,
 * while the contrast audit only ever sees colours someone remembered to add to
 * pairings.json.
 *
 * Usage: node scripts/export-tokens-dtcg.js [--skip-gamut]
 * The gamut gate runs by default and needs klar 3.x on PATH; --skip-gamut
 * exports without it. Nothing in the repo passes that flag.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SKIP_GAMUT = process.argv.includes('--skip-gamut');

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse all --name: value; declarations from a block of SCSS text.
 *
 * A token's annotation may sit *above* its declaration rather than trailing
 * it — several of the longest and most load-bearing ones do, because they run
 * to three lines. Capturing only the trailing comment dropped 21 of 55 light
 * tokens' descriptions entirely, including every form-control border, which is
 * why `--color-border-control`'s dark behaviour read as an unexplained
 * oversight from the artifact alone (#218, #217).
 *
 * Leading capture walks up from the declaration and stops at a blank line, a
 * box-drawing section divider, or another declaration — so a section header
 * never gets attributed to whichever token happens to be listed first under
 * it.
 *
 * BOTH are kept when both are present. #217 fixed leading-only capture but left
 * `trailing || leading`, which silently discarded the leading comment on the 17
 * declarations that carry both — and six of those discarded comments contained a
 * contrast figure, so those figures were outside the audit entirely. Not
 * UNCHECKED: absent, with nothing anywhere recording that they existed. One had
 * been wrong for as long as it had been invisible (`--color-action-primary`
 * claiming "gray-800 text on primary: OKCA 5.6" for a label that stopped being
 * gray-800). That is #217's own defect class one notch narrower, and the reason
 * the fix is to concatenate rather than to pick a winner: a capture that chooses
 * bounds every downstream guard to what it chose (#224).
 */
const DIVIDER_RE = /^\s*\/\/\s*[─—-]{3,}/;

function leadingComment(lines, declIndex) {
  const out = [];
  for (let j = declIndex - 1; j >= 0; j--) {
    const line = lines[j];
    if (!/^\s*\/\//.test(line)) break;      // blank line or code — stop
    if (DIVIDER_RE.test(line)) break;       // section divider — not this token's
    out.unshift(line.replace(/^\s*\/\/\s?/, '').trim());
  }
  return out.join(' ').trim();
}

function parseDeclarations(scss) {
  const result = {};
  const lines = scss.split(/\r?\n/);
  const declRe = /^\s*(--[\w-]+)\s*:\s*([^;]+?)\s*;[ \t]*(?:\/\/[ \t]*(.*))?$/;
  lines.forEach((line, i) => {
    const m = declRe.exec(line);
    if (!m) return;
    const trailing = (m[3] || '').trim();
    const leading = leadingComment(lines, i);
    const both = [leading, trailing].filter(Boolean).join(' — ');
    result[m[1]] = { raw: m[2].trim(), comment: both };
  });
  return result;
}

/** Extract the body of @mixin name { ... } from SCSS text. */
function extractMixin(scss, name) {
  const marker = `@mixin ${name}`;
  const start = scss.indexOf(marker);
  if (start === -1) return '';
  let depth = 0;
  let i = scss.indexOf('{', start);
  const bodyStart = i + 1;
  for (; i < scss.length; i++) {
    if (scss[i] === '{') depth++;
    if (scss[i] === '}') { depth--; if (depth === 0) break; }
  }
  return scss.slice(bodyStart, i);
}

/**
 * Resolve var() references until all values are concrete or unresolvable.
 * Handles up to 5 levels of indirection (semantic → semantic → primitive).
 */
function resolveAll(tokens, primitives) {
  // Build a combined lookup: primitives + all token raw values
  const lookup = { ...primitives };
  for (const [k, { raw }] of Object.entries(tokens)) lookup[k] = raw;

  const resolved = {};
  for (const [name, { raw, comment }] of Object.entries(tokens)) {
    let value = raw;
    for (let pass = 0; pass < 5; pass++) {
      const m = value.match(/^var\((--[\w-]+)\)$/);
      if (!m) break;
      const next = lookup[m[1]];
      if (!next || next === value) break;
      value = next;
    }
    resolved[name] = { value, comment };
  }
  return resolved;
}

/**
 * Convert a CSS custom property name to a DTCG nested path array.
 * --color-status-error-text → ['color', 'status', 'error-text']
 * --color-bg-page           → ['color', 'bg', 'page']
 * --color-link              → ['color', 'link']
 * --color-link-hover        → ['color', 'link-hover']   (see collision note)
 *
 * `declared` is the set of every declared custom-property name across both
 * modes, used to avoid emitting a token inside a token.
 */
function toDtcgPath(cssVar, declared) {
  const parts = cssVar.replace(/^--/, '').split('-');
  if (parts.length <= 2) return parts;
  // Collision guard: when the two-part prefix is itself a declared token
  // (--color-link exists alongside --color-link-hover), the default split
  // would nest a token *inside* a token — invalid DTCG, since a node is
  // either a token or a group and never both. Keep the remainder joined to
  // the second segment instead, mirroring the custom-property name:
  // --color-link-hover → color.link-hover.
  if (declared.has(`--${parts[0]}-${parts[1]}`)) {
    return [parts[0], parts.slice(1).join('-')];
  }
  // parts[0] = 'color', parts[1] = category, parts[2+] = remainder (rejoined)
  return [parts[0], parts[1], parts.slice(2).join('-')];
}

/** Visit every emitted token node in a built DTCG tree. */
function walkTokens(obj, visit) {
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object' && '$value' in v) visit(v);
    else if (v && typeof v === 'object') walkTokens(v, visit);
  }
}

/** Set a value at a nested path within an object, creating nodes as needed. */
function setPath(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    cur[pathArr[i]] ??= {};
    cur = cur[pathArr[i]];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

// ── sRGB gamut gate (#225) ───────────────────────────────────────────────────

/**
 * Is this colour renderable in sRGB? klar exits 1 on out-of-gamut input and
 * still prints, so --allow-out-of-gamut keeps it on exit 0 and we read the
 * verdict from the JSON instead of the exit code.
 *
 * Do NOT reach for culori's clampChroma/toGamut here despite culori being a
 * dependency. They answer "what should this colour be replaced with", which is
 * a question Candor deliberately has no opinion on; the only question here is
 * the boolean "is this value renderable at all".
 */
function isInGamut(color) {
  const out = execSync(
    `klar contrast "${color}" "#000" --allow-out-of-gamut --json`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  );
  return !JSON.parse(out).gamut.outOfGamut;
}

/**
 * The largest chroma that renders at this colour's authored L and H.
 *
 * Steps *down* in 0.01 and never rounds to nearest: the in-gamut maximum sits
 * exactly on the sRGB boundary, so nearest-rounding at 2dp pushes roughly half
 * of these values straight back out. Inward is the only safe direction.
 */
function suggestInGamut(color) {
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(color);
  if (!m) return null;
  const [, L, C, H] = m;
  for (let c = Number(C); c > 0; c -= 0.01) {
    const candidate = `oklch(${L} ${c.toFixed(2)} ${H})`;
    if (isInGamut(candidate)) return candidate;
  }
  return null;
}

/**
 * Every oklch() literal in a stylesheet, with the line it sits on.
 *
 * Scans raw text rather than the parsed token map for two reasons. Parsing
 * semantics.scss as one map would collide light and dark on the same token
 * name and silently drop one of the two values. And an oklch() that is *not* a
 * custom-property declaration — a hard-coded fill in a rule body — is exactly
 * as unrenderable as one that is, so the gate should see it.
 */
function scanOklch(file) {
  const text = fs.readFileSync(file, 'utf8');
  const found = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, ''); // figures in comments are prose, not colours
    for (const m of code.matchAll(/oklch\([^)]*\)/g)) {
      const decl = /(--[\w-]+)\s*:/.exec(code.slice(0, m.index));
      found.push({ name: decl ? decl[1] : '(inline)', raw: m[0], line: i + 1 });
    }
  });
  return found;
}

/**
 * Fail the export if any authored colour falls outside sRGB.
 *
 * Checks *authored* literals rather than resolved semantic values: a semantic
 * that aliases a primitive is the same colour, so scanning literals covers
 * every distinct colour exactly once and reports the declaration a contributor
 * actually has to edit. Covers every stylesheet in src/design-tokens/, not
 * just the two this script exports from — syntax.scss is not in the DTCG
 * artifact but its colours are still authored Candor colours, and six of them
 * were outside sRGB when the gate was written.
 */
function checkGamut(sources) {
  try {
    const v = execSync('klar --version', { encoding: 'utf8' }).trim();
    if (!/^3\./.test(v)) {
      console.error(
        `✗  klar ${v} found — the gamut gate needs 3.x.\n` +
          '   Run `npm run audit:contrast`: its version guard carries the full checklist\n' +
          '   for what to verify in klar\'s docs before widening either range.'
      );
      process.exit(2);
    }
  } catch {
    console.error('✗  klar is not on PATH. Install klar 3.x, or re-run with --skip-gamut.');
    process.exit(2);
  }

  const violations = [];
  const seen = new Map(); // value → verdict, so a repeated colour costs one klar call
  let checked = 0;
  for (const file of sources) {
    for (const { name, raw, line } of scanOklch(path.join(ROOT, 'src/design-tokens', file))) {
      // Alpha does not affect whether the base colour is renderable; measure
      // the opaque form so a translucent token is still held to the invariant.
      const opaque = raw.replace(/\s*\/\s*[^)]+\)/, ')');
      checked++;
      if (!seen.has(opaque)) seen.set(opaque, isInGamut(opaque));
      if (!seen.get(opaque)) {
        violations.push({ file, name, line, raw, suggested: suggestInGamut(opaque) });
      }
    }
  }

  if (!violations.length) {
    console.log(`✓  sRGB gamut: ${checked} authored colours (${seen.size} distinct), all renderable`);
    return;
  }

  console.error(`\n✗  ${violations.length} of ${checked} authored colours fall outside sRGB.`);
  console.error(
    '   An out-of-gamut OKLCH value is not a specification — it delegates the\n' +
    '   colour to whatever consumes it, and OKCA is not defined there, so every\n' +
    '   contrast figure recorded against it is undefined too.\n' +
    '   Hold the authored L and H and pull chroma to the boundary (#225):\n'
  );
  for (const v of violations) {
    console.error(`   ${v.file}:${v.line}  ${v.name}`);
    console.error(`     authored  ${v.raw}`);
    console.error(`     in gamut  ${v.suggested ?? '(no chroma at this L and H renders — reconsider L)'}`);
  }
  console.error('\n   Re-measure every OKCA figure in the changed declarations before committing.');
  process.exit(1);
}

// ── non-text usage flag (#218) ───────────────────────────────────────────────

/**
 * Is this token unsafe as a CSS `color:` value for text?
 *
 * Derived from what the token *is*, not from whether someone wrote a sentence
 * about it. The previous rule regex-matched the literal phrase "icon/border
 * use" in a comment, which flagged 5 of 55 tokens and — the actual bug — not a
 * single border, the archetypal non-text category. CLAUDE.md's pitfall 3a
 * tells contributors to consult this field before using a token as `color:`,
 * so an incomplete field is worse than none: it returns a confident false
 * negative for the whole category it exists to protect.
 *
 * Two structural rules plus a small explicit list:
 *
 *   1. The name contains `border`. A border is non-text by construction —
 *      --color-border-*, --color-blockquote-border, --color-action-
 *      destructive-border.
 *   2. A sibling `<name>-text` exists. The system having minted a -text
 *      variant *is* the statement that the base is not for text; this is what
 *      catches --color-status-{error,success,warning}.
 *   3. Tokens whose role is non-text but whose name cannot say so.
 *
 * `declared` is every declared custom-property name across both modes, which
 * is what makes rule 2 checkable.
 */
const NON_TEXT_BY_ROLE = new Set([
  '--color-focus',                 // focus ring — a UI indicator, never text
  '--color-slider-thumb',          // control knob fill
  '--color-highlight-decorative',  // decorative accent; below every text floor (#132)
]);

function isNonText(cssVar, declared) {
  if (/(^|-)border(-|$)/.test(cssVar)) return true;
  if (declared.has(`${cssVar}-text`)) return true;
  return NON_TEXT_BY_ROLE.has(cssVar);
}

/** Build a DTCG token entry. Adds $extensions.usage for non-text tokens. */
function dtcgEntry(cssVar, value, comment, declared) {
  const entry = { $type: 'color', $value: value };
  if (comment) entry.$description = comment;
  if (isNonText(cssVar, declared)) {
    entry.$extensions = { usage: 'non-text' };
  }
  return entry;
}

/**
 * Fail if a comment claims non-text use for a token no rule catches.
 *
 * The prose is no longer the source of truth, but it is still a second opinion
 * — and a disagreement means either a token needs adding to NON_TEXT_BY_ROLE
 * or a comment is wrong. Silently trusting the rules would reintroduce exactly
 * the failure mode this replaced: a guard that looks populated and isn't.
 */
function checkNonTextAgreement(tokens, declared) {
  const missed = [];
  for (const [name, { comment }] of Object.entries(tokens)) {
    if (!name.startsWith('--color-')) continue;
    const saysNonText = /icon\/border use|non-text/i.test(comment || '');
    if (saysNonText && !isNonText(name, declared)) missed.push(name);
  }
  return missed;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const primitivesScss = fs.readFileSync(
  path.join(ROOT, 'src/design-tokens/primitives.scss'), 'utf8'
);
const semanticsScss = fs.readFileSync(
  path.join(ROOT, 'src/design-tokens/semantics.scss'), 'utf8'
);

// 1. Parse primitives — collect only direct oklch values for resolution
const primitiveDecls = parseDeclarations(primitivesScss);
const primitives = {};
for (const [k, { raw }] of Object.entries(primitiveDecls)) {
  if (raw.startsWith('oklch(')) primitives[k] = raw;
}

// 2. Parse light + dark token mixins
const lightRaw = parseDeclarations(extractMixin(semanticsScss, 'light-color-tokens'));
// Dark is an *override* layer, not a standalone set: at runtime the light
// mixin lands on :root and dark redeclares only what changes, so a token
// declared once in light still renders in dark (resolving through whatever
// mode-aware token it aliases). Building the dark tree from darkRaw alone
// made the export disagree with the cascade and left light-only tokens
// missing from the dark half of the artifact (#210).
const darkOwnRaw = parseDeclarations(extractMixin(semanticsScss, 'dark-color-tokens'));
const darkRaw  = { ...lightRaw, ...darkOwnRaw };

// 2a. Gamut gate — before anything is emitted, so a colour sRGB cannot render
// never reaches the artifact, a component, or a contrast figure. Discovered by
// listing the directory rather than named here, so a new token stylesheet is
// covered the day it lands instead of the day someone remembers this list.
if (!SKIP_GAMUT) {
  checkGamut(
    fs.readdirSync(path.join(ROOT, 'src/design-tokens'))
      .filter((f) => f.endsWith('.scss'))
      .sort()
  );
}

// 3. Resolve all var() references
const lightTokens = resolveAll(lightRaw, primitives);
const darkTokens  = resolveAll(darkRaw,  primitives);

// Every declared name across both modes — feeds the toDtcgPath collision guard
// so light and dark map to identical paths.
const declared = new Set([...Object.keys(lightRaw), ...Object.keys(darkRaw)]);

/** Values we can emit as a DTCG color. `transparent` is a real CSS color and a
 *  meaningful token value ("no fill / no border"); dropping it silently made
 *  --color-border-code look dark-only and hid --color-action-destructive from
 *  both modes. Anything else surfaces in the skip report rather than vanishing. */
const isEmittableColor = (v) => v.startsWith('oklch(') || v === 'transparent';

// 4. Build DTCG output — --color-* tokens with an emittable resolved value
const output = { light: {}, dark: {} };
const skipped = { light: [], dark: [] };
let lightCount = 0, darkCount = 0;

for (const [name, { value, comment }] of Object.entries(lightTokens)) {
  if (!name.startsWith('--color-')) continue;
  if (!isEmittableColor(value)) { skipped.light.push(`${name} → ${value}`); continue; }
  setPath(output.light, toDtcgPath(name, declared), dtcgEntry(name, value, comment, declared));
  lightCount++;
}

for (const [name, { value, comment }] of Object.entries(darkTokens)) {
  if (!name.startsWith('--color-')) continue;
  if (!isEmittableColor(value)) { skipped.dark.push(`${name} → ${value}`); continue; }
  setPath(output.dark, toDtcgPath(name, declared), dtcgEntry(name, value, comment, declared));
  darkCount++;
}

// 5. Write output
const outDir  = path.join(ROOT, 'audit');
const outFile = path.join(outDir, 'tokens.dtcg.json');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n');

// 5a. Report on the non-text guard, and fail if prose and rules disagree.
let nonTextCount = 0, noDesc = 0;
for (const [name] of Object.entries(lightTokens)) {
  if (!name.startsWith('--color-')) continue;
  if (isNonText(name, declared)) nonTextCount++;
}
walkTokens(output.light, (tok) => { if (!tok.$description) noDesc++; });

console.log(`✓  audit/tokens.dtcg.json`);
console.log(`   light: ${lightCount} color tokens`);
console.log(`   dark:  ${darkCount} color tokens`);
console.log(`   non-text: ${nonTextCount} flagged (structural — border / has a -text sibling / named role)`);
if (noDesc) console.log(`   ${noDesc} light token(s) still carry no $description`);

const missedNonText = checkNonTextAgreement(lightTokens, declared);
if (missedNonText.length) {
  console.error(
    `\n✗  ${missedNonText.length} token(s) are annotated as non-text but no structural rule catches them.\n` +
      '   Either the comment is wrong, or the token needs adding to NON_TEXT_BY_ROLE\n' +
      '   in this script. Do not leave them disagreeing — CLAUDE.md pitfall 3a tells\n' +
      '   contributors to trust this field (#218):\n'
  );
  for (const n of missedNonText) console.error(`   ${n}`);
  process.exit(1);
}

if (lightCount !== darkCount) {
  console.warn(`⚠  mode asymmetry: light and dark should carry the same token set`);
}
for (const mode of ['light', 'dark']) {
  if (skipped[mode].length) {
    console.warn(`⚠  ${mode}: ${skipped[mode].length} token(s) skipped — value is not an emittable color`);
    for (const s of skipped[mode]) console.warn(`     ${s}`);
  }
}
