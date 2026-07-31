#!/usr/bin/env node
/**
 * scripts/export-tokens-dtcg.js
 *
 * Generates audit/tokens.dtcg.json from the Candor design token SCSS files.
 * Resolves all var() references and annotates non-text tokens via $extensions.
 *
 * Usage: node scripts/export-tokens-dtcg.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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
const darkRaw  = { ...lightRaw, ...parseDeclarations(extractMixin(semanticsScss, 'dark-color-tokens')) };

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
