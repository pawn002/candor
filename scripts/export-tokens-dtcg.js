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

/** Parse all --name: value; declarations from a block of SCSS text. */
function parseDeclarations(scss) {
  const result = {};
  const re = /^\s*(--[\w-]+)\s*:\s*([^;]+?)\s*;[ \t]*(?:\/\/[ \t]*(.*))?$/gm;
  for (const m of scss.matchAll(re)) {
    result[m[1]] = { raw: m[2].trim(), comment: (m[3] || '').trim() };
  }
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

/** Build a DTCG token entry. Adds $extensions.usage for non-text tokens. */
function dtcgEntry(value, comment) {
  const entry = { $type: 'color', $value: value };
  if (comment) entry.$description = comment;
  if (/icon\/border use/i.test(comment)) {
    entry.$extensions = { usage: 'non-text' };
  }
  return entry;
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
  setPath(output.light, toDtcgPath(name, declared), dtcgEntry(value, comment));
  lightCount++;
}

for (const [name, { value, comment }] of Object.entries(darkTokens)) {
  if (!name.startsWith('--color-')) continue;
  if (!isEmittableColor(value)) { skipped.dark.push(`${name} → ${value}`); continue; }
  setPath(output.dark, toDtcgPath(name, declared), dtcgEntry(value, comment));
  darkCount++;
}

// 5. Write output
const outDir  = path.join(ROOT, 'audit');
const outFile = path.join(outDir, 'tokens.dtcg.json');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n');

console.log(`✓  audit/tokens.dtcg.json`);
console.log(`   light: ${lightCount} color tokens`);
console.log(`   dark:  ${darkCount} color tokens`);

if (lightCount !== darkCount) {
  console.warn(`⚠  mode asymmetry: light and dark should carry the same token set`);
}
for (const mode of ['light', 'dark']) {
  if (skipped[mode].length) {
    console.warn(`⚠  ${mode}: ${skipped[mode].length} token(s) skipped — value is not an emittable color`);
    for (const s of skipped[mode]) console.warn(`     ${s}`);
  }
}
