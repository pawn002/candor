#!/usr/bin/env node
'use strict';

/**
 * sync-wc-version.js
 *
 * npm `version` lifecycle script — keeps web-components/package.json's
 * version in lockstep with the root package.json version.
 *
 * npm runs lifecycle scripts through whatever `npm config get script-shell`
 * resolves to, which on Windows is `cmd.exe` by default (`script-shell` is
 * null). The previous inline script relied on POSIX `$npm_package_version`
 * shell expansion, which `cmd.exe` treats as a literal string, not a
 * variable — breaking every release cut from Windows.
 *
 * This script sidesteps the shell entirely: it reads the version in Node
 * (where `process.env.npm_package_version` is populated identically
 * regardless of platform/shell) and spawns `npm` directly via
 * child_process, which runs the same way under cmd.exe and bash.
 *
 * Usage: node scripts/sync-wc-version.js
 *   (invoked automatically by the root "version" npm lifecycle script)
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// npm populates process.env.npm_package_version for lifecycle scripts on
// every platform/shell. Fall back to reading package.json directly in case
// this is ever invoked outside an npm lifecycle context.
const version =
  process.env.npm_package_version ||
  require(path.join(ROOT, 'package.json')).version;

if (!version) {
  console.error('sync-wc-version: could not resolve a version to sync.');
  process.exit(1);
}

execSync(
  `npm --prefix web-components version ${version} --no-git-tag-version --allow-same-version`,
  { cwd: ROOT, stdio: 'inherit' },
);

console.log(`sync-wc-version: web-components/package.json -> ${version}`);
