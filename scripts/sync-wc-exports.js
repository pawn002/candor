#!/usr/bin/env node
/**
 * Derives `@candor-design/web-components`'s `exports` map from the barrel (#257).
 *
 * One subpath per component module the barrel re-exports, named for the file:
 * `components/form/radio/candor-radio.ts` → `@candor-design/web-components/radio`.
 * Importing a subpath registers that module's elements and nothing else, which
 * is what lets a consumer ship only what it renders and adopt Candor one
 * element at a time.
 *
 * The list is derived, never written down. A hand-kept map of 37 subpaths
 * drifts the first time a component is added, and the failure is silent:
 * the new element simply has no entry point. So this script owns the map,
 * `npm run sync:wc-exports` rewrites it, and `npm run audit:packaging` fails if
 * the committed map differs from what this derives — the same staleness gate
 * `custom-elements.json` and `audit/tokens.dtcg.json` carry.
 *
 * Names are the file name minus `candor-`, so they match the tag a module is
 * named for. Modules registering a companion element (tabs, toast, toolbar)
 * get one subpath, under the parent's name, because the companion is useless
 * without it.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BARREL = path.join(ROOT, 'src', 'web-components', 'index.ts');
const MANIFEST = path.join(ROOT, 'web-components', 'package.json');

/** The fixed entries, in the order they appear in the map. */
const FIXED = {
  '.': { types: './dist/index.d.ts', import: './dist/index.js' },
  './standalone': {
    types: './dist/index.d.ts',
    import: './dist/candor-web-components.standalone.js',
  },
  './tone-data': { types: './dist/tone-data.d.ts', import: './dist/tone-data.js' },
};

/** Component subpaths, in barrel order. */
function componentEntries() {
  const src = fs.readFileSync(BARREL, 'utf8').replace(/\/\/.*$/gm, '');
  const entries = {};
  for (const m of src.matchAll(/^export \* from '\.\/(components\/[^']+\/candor-([a-z0-9-]+))';/gm)) {
    const [, modPath, name] = m;
    if (entries[`./${name}`]) throw new Error(`two barrel modules derive the subpath ./${name}`);
    entries[`./${name}`] = { types: `./dist/${modPath}.d.ts`, import: `./dist/${modPath}.js` };
  }
  return entries;
}

function deriveExports() {
  const components = componentEntries();
  for (const key of Object.keys(components)) {
    if (FIXED[key]) throw new Error(`component subpath ${key} collides with a fixed entry`);
  }
  return { ...FIXED, ...components, './package.json': './package.json' };
}

module.exports = { deriveExports, MANIFEST };

if (require.main === module) {
  const pkg = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  pkg.exports = deriveExports();
  fs.writeFileSync(MANIFEST, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✓ wrote ${Object.keys(pkg.exports).length} exports to web-components/package.json`);
}
