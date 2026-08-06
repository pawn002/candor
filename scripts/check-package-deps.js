#!/usr/bin/env node
/**
 * Gates what the *published* packages declare against what their *built
 * artifacts* actually reference.
 *
 * The bug this exists for (#254): `@candor-design/web-components/tone-data`
 * shipped a bare `import ... from "culori"` while its package.json declared no
 * dependencies at all. It resolved anyway, because `@candor-design/tokens`
 * happened to carry culori in its own runtime dependencies — where it did not
 * belong, alongside `lit`, `tslib` and the TypeScript compiler, in a package
 * whose `files` is `["tokens"]` and which ships four CSS/JSON artifacts.
 *
 * Two mistakes cancelling out, and every existing check looked straight past
 * them: build:tokens validates the artifacts, audit:* validate colour,
 * typecheck and test:playwright run against source. Nothing read a manifest.
 * That is the whole reason this file exists — `files` and `dependencies` were
 * each individually plausible, so a human reading either one saw nothing wrong.
 *
 * Two directions, because the bug had two halves:
 *
 *   missing — a bare specifier in a published artifact that no manifest
 *             declares. This is the half that breaks a consumer's install, and
 *             it is invisible in this repo because the root node_modules has
 *             everything. It only surfaces in a clean install elsewhere.
 *
 *   unused  — a declared runtime dependency that no published artifact
 *             references. Never breaks anything; it is how a compiler ends up
 *             in the dependency tree of a stylesheet.
 *
 * `peerDependencies` are deliberately exempt from the unused check.
 * `@candor-design/tokens` is a peer of the web-components package for the CSS
 * custom properties, which no JS import references — a peer is a statement
 * about consumer coordination, not about what the bundle imports.
 *
 * There is deliberately no allowlist. Inspection at #254 found no legitimate
 * exception in either direction, and an exemption with no user is only an
 * escape hatch waiting to be used.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/**
 * Strip `/* … *\/` block comments before scanning.
 *
 * Not optional: `tokens/candor-tokens.css` opens with a usage example reading
 * `@import url("candor-tokens.css")`, and matching that would report the
 * package's own documentation as an undeclared dependency. The same shape as the
 * `12px-ok:` marker rule in CLAUDE.md — prose that demonstrates a syntax must
 * not be read as an instance of it.
 *
 * CSS has no line comments, so this is complete for the token artifacts. The JS
 * artifacts are minified, which removes ordinary comments; `//` is left alone
 * deliberately, since stripping it would eat the `//` in every `https://` URL.
 */
function stripBlockComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/** Bare specifier = not relative, not absolute, not a node: builtin. */
function isBare(spec) {
  return !spec.startsWith('.') && !spec.startsWith('/') && !spec.startsWith('node:');
}

/** `@scope/name/deep/path` → `@scope/name`; `name/deep` → `name`. */
function packageName(spec) {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

/** ESM/CJS bare specifiers in built JS: import, export-from, require, dynamic import. */
function jsSpecifiers(code) {
  const found = new Set();
  const patterns = [
    /(?:^|[^\w$])(?:import|export)[\s\S]{0,200}?from\s*["']([^"']+)["']/g,
    /(?:^|[^\w$])import\s*["']([^"']+)["']/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const re of patterns) {
    for (const m of code.matchAll(re)) if (isBare(m[1])) found.add(packageName(m[1]));
  }
  return found;
}

/** Bare specifiers in CSS `@import "…"` / `url(…)`. */
function cssSpecifiers(code) {
  const found = new Set();
  for (const m of code.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/g)) {
    if (isBare(m[1])) found.add(packageName(m[1]));
  }
  return found;
}

function walk(dir, test) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, test) : test(p) ? [p] : [];
  });
}

const targets = [
  {
    label: '@candor-design/tokens',
    manifest: path.join(ROOT, 'package.json'),
    // The published surface is `files: ["tokens"]` — the CSS/JSON artifacts only.
    files: () => walk(path.join(ROOT, 'tokens'), (p) => p.endsWith('.css') || p.endsWith('.json')),
    extract: (p, code) => (p.endsWith('.css') ? cssSpecifiers(code) : new Set()),
    buildWith: 'npm run build:tokens',
  },
  {
    label: '@candor-design/web-components',
    manifest: path.join(ROOT, 'web-components', 'package.json'),
    files: () =>
      walk(path.join(ROOT, 'web-components', 'dist'), (p) => p.endsWith('.js') || p.endsWith('.cjs')),
    extract: (_p, code) => jsSpecifiers(code),
    buildWith: 'npm run build:wc',
  },
];

let failed = false;

for (const t of targets) {
  const pkg = JSON.parse(fs.readFileSync(t.manifest, 'utf8'));
  const declared = new Set(Object.keys(pkg.dependencies ?? {}));
  const peers = new Set(Object.keys(pkg.peerDependencies ?? {}));
  const files = t.files();

  console.log(`\n${t.label}`);

  if (files.length === 0) {
    console.log(`  ✖ no built artifacts found — run \`${t.buildWith}\` first`);
    failed = true;
    continue;
  }

  const referenced = new Map(); // package name → the artifact that referenced it
  for (const f of files) {
    const code = stripBlockComments(fs.readFileSync(f, 'utf8'));
    for (const spec of t.extract(f, code)) {
      if (!referenced.has(spec)) referenced.set(spec, path.relative(ROOT, f).replace(/\\/g, '/'));
    }
  }

  // A self-reference is how the artifact documents its own public import path,
  // not a dependency on itself.
  referenced.delete(pkg.name);

  const missing = [...referenced].filter(([name]) => !declared.has(name) && !peers.has(name));
  const unused = [...declared].filter((name) => !referenced.has(name));

  console.log(
    `  ${files.length} artifact(s), ${referenced.size} bare specifier(s), ` +
      `${declared.size} dependency/-ies, ${peers.size} peer(s)`,
  );

  for (const [name, where] of missing) {
    console.log(`  ✖ undeclared: "${name}" is imported by ${where} but is not a dependency or peer`);
    failed = true;
  }
  for (const name of unused) {
    console.log(`  ✖ unused: "${name}" is a runtime dependency but no published artifact references it`);
    failed = true;
  }

  if (missing.length === 0 && unused.length === 0) {
    const list = [...referenced.keys()].sort().join(', ') || 'none';
    console.log(`  ✓ declarations match the artifacts (referenced: ${list})`);
  }
}

if (failed) {
  console.log(
    '\n✖ package dependency check failed.' +
      '\n  An undeclared import breaks a consumer install without breaking anything here —' +
      '\n  this repo has every package hoisted, so it only surfaces in a clean install.' +
      '\n  An unused runtime dependency is how a build tool ends up shipped to consumers.\n',
  );
  process.exit(1);
}

console.log('\n✓  published dependencies match the published artifacts\n');
