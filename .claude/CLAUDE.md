# Candor — Project Instructions (Claude-specific)

## Versioning & Release

Candor follows semver. The token package is stable at 1.0.0 — treat MINOR as additive changes, MAJOR as breaking changes to token names or structure.

### Release workflow

1. Update `CHANGELOG.md` with the changes under a new `[X.Y.Z] - YYYY-MM-DD` heading
2. Run the appropriate release script from `main`:
   - `npm run release:patch` — bug fixes, doc corrections
   - `npm run release:minor` — new tokens, non-breaking additions
   - `npm run release:major` — renamed/removed tokens, breaking changes
3. This bumps `package.json`, commits, tags `vX.Y.Z`, and pushes the tag
4. GitHub Actions (`draft-release.yml`) creates a draft release with auto-generated notes
5. Review and edit the draft on GitHub, then click **Publish release**
6. GitHub Actions (`publish.yml`) publishes to npm via OIDC trusted publishing — no token needed

### Never do manually
- Don't `git tag` by hand — `npm version` handles it
- Don't `npm publish` directly after the bootstrap — trusted publishing takes over
- Don't push a tag from a branch other than `main` — `draft-release.yml` enforces this
