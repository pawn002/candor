# Web components publish handoff

Picks up from commit `95fb8b9` on branch `claude/add-lit-web-components-u3XU3`.

The branch is ready to merge and ship. All packaging/CI work is done. Three steps remain — one of them only you can do.

---

## Step 1 — Configure npm trusted publishing for `@candor-design/web-components`

**Only you can do this. The first publish will fail without it.**

`@candor-design/tokens` already uses OIDC trusted publishing via GitHub Actions (no npm token). The new package needs the same setup.

1. Sign in at https://www.npmjs.com/ as the package owner.
2. Either:
   - **If the package does not yet exist on npm:** create a placeholder publish manually one time, OR rely on the first GitHub Actions publish to create the package. With trusted publishing, the first GHA publish will create it. (Recommended.)
   - **Set up the trusted publisher:** go to the org / your account → Packages → `@candor-design/web-components` → Settings → Publishing access → "Add trusted publisher" → GitHub Actions.
     - Organization or user: `pawn002`
     - Repository: `candor`
     - Workflow filename: `publish.yml`
     - Environment name: leave blank (the workflow doesn't use a GH environment)
3. If the package doesn't exist yet on npm, you can pre-create the trusted publisher entry on a "pending" name — npm allows configuring trusted publishers for names not yet published.

Reference: https://docs.npmjs.com/trusted-publishers

If trusted publishing is not in place at release time, `publish-web-components` will fail with an auth error. The tokens job will still succeed. You can re-run the failed job after configuring.

---

## Step 2 — Merge the branch to `main`

```bash
git checkout main
git pull origin main
git merge claude/add-lit-web-components-u3XU3
git push origin main
```

Or open a PR and merge through GitHub. Either way, the merge commit must land on `main` — `draft-release.yml` refuses tags that aren't on `main`.

CI will run `build-tokens` and `build-web-components` matrices. Both must be green.

---

## Step 3 — Cut the release

From a clean `main` checkout:

```bash
# Pick one based on changes since 3.0.0:
npm run release:minor   # most likely — new web-components package is additive
# or release:patch / release:major
```

What happens, in order:
1. Root `package.json` bumps (`@candor-design/tokens` → new version)
2. The `version` lifecycle hook bumps `web-components/package.json` to the same version and stages it
3. Both files commit together
4. Tag `vX.Y.Z` is created on the same commit
5. Tag + commit push to `origin/main`
6. `draft-release.yml` fires → creates a draft release with auto-generated notes
7. **Review the draft on GitHub.** Edit notes if needed. Then click **Publish release**.
8. `publish.yml` fires two parallel jobs:
   - `publish-tokens` → publishes `@candor-design/tokens@X.Y.Z` (this is the existing flow)
   - `publish-web-components` → builds and publishes `@candor-design/web-components@X.Y.Z`

Both packages share the same version going forward.

---

## Step 4 — Post-release housekeeping (existing convention)

From `CLAUDE.md`:
- Update `src/Introduction.mdx` line 3 with the new version string (e.g. `**Version 3.1 · May 2026**`). Chromatic won't show the new version until this is pushed to `main`.
- Move the `## [Unreleased]` block in `CHANGELOG.md` under a new `## [X.Y.Z] - YYYY-MM-DD` heading.

---

## Verification after publish

```bash
npm view @candor-design/tokens version
npm view @candor-design/web-components version
# Both should report the same new version.

# Spot-check the WC package contents:
npm view @candor-design/web-components dist.tarball
# Download and untar, confirm: dist/candor-web-components.js, .umd.cjs, index.d.ts, README.md
```

A smoke test in a fresh project:

```bash
mkdir /tmp/candor-smoke && cd /tmp/candor-smoke
npm init -y
npm install @candor-design/web-components @candor-design/tokens
node -e "import('@candor-design/web-components').then(m => console.log(Object.keys(m).filter(k=>k.startsWith('Candor')).length, 'exports'))"
# Expect: 34+ exports
```

---

## If something goes wrong

**`publish-tokens` succeeded, `publish-web-components` failed (trusted publishing misconfigured):**
- Fix the npm trusted publisher config.
- Re-run only the failed job from the Actions run page. The release does not need to be re-cut.

**Both fail:**
- Investigate the workflow logs.
- The tag and release already exist. To retry, just re-run the workflow run from Actions. If the version was published partially, `npm publish` will refuse to overwrite — you'll need to cut a new patch version.

**Version drifted between the two `package.json` files:**
- Should not happen because of the `version` lifecycle hook in root `package.json`.
- If it does, manually align `web-components/package.json` to match root, commit, and re-tag.

---

## Reference — what's in the branch

Commits since `main` (most recent first):
- `95fb8b9` — chore(web-components): finish publish pipeline (this work)
- `27ce4b2` — fix(web-components): Toolbar parity + shadow DOM box-sizing
- `ea256fe` — feat(web-components): story parity audit + Phosphor icons
- `784a340` — feat(web-components): close Angular/WC parity gaps
- `a130753` — fix(web-components): replace bare `<button>` with `<candor-button>`
- `17b1e1d` — fix(web-components): correct rendering failures
- `5d12099` — chore: update package-lock.json
- `e628126` — fix(web-components): CUSTOM_ELEMENTS_SCHEMA + class field shadowing
- `ec2846d` — fix(web-components): override modifier on inherited members
- `69090b6` — docs: update all docs for @candor-design/web-components launch
- `73db9ef` — chore(web-components): align version to 3.0.0
- `7dd0c26` — feat: add @candor-design/web-components Lit 3 library

Build output (verified):
- `dist/candor-web-components.js` — 169 kB ESM (31 kB gzipped, includes Lit)
- `dist/candor-web-components.umd.cjs` — 157 kB UMD
- `dist/index.d.ts` + 33 per-component `.d.ts`
- Pack: 40 files, 68 kB packed, 357 kB unpacked
