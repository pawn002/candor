# Candor Design System — Production Roadmap

Tracks the remaining work to make Candor distributable across products and media.
Items are grouped by priority tier and ordered within each tier by suggested execution order.

---

## Tier 1 — Must-have before distributing

- [ ] **Token CSS export** — Generate a standalone flat CSS file of custom properties (light + dark) that any product can consume via `<link>`, regardless of framework. Also produce a JSON export for design tooling. This unblocks every non-Angular product immediately.

- [ ] **Merge pending branches** — Merge `fix/article-projected-content-styles` (PR #17) and `dark-theme` into `main` before external adoption locks in the current state.

- [ ] **Angular library restructure** — Convert the repo from an Angular app to an Angular library (`ng-packagr`). Add proper barrel exports and a public API surface so other Angular projects can install Candor as an npm dependency with tree-shaking support.

- [ ] **npm publish** — Configure `package.json` for publishing (registry, `files`, `exports`, `sideEffects`). Publish initial release to npm (public or private registry).

- [ ] **CI/CD pipeline** — Add GitHub Actions workflows:
  - Run Playwright tests on every PR
  - Build Storybook on merge to `main`
  - Publish npm package on release tag

- [ ] **Semantic versioning + releases** — `package.json` is frozen at `1.0.0`. Wire Changesets or semantic-release to the commit conventions so products have a versioning contract and know when to expect breaking changes. Add `CHANGELOG.md`.

---

## Tier 2 — Important, follow shortly after

- [ ] **Deploy Storybook** — Publish Storybook to a stable public URL (Chromatic is already installed). This becomes the shared reference for designers and developers across all products — no one should need to run it locally.

- [ ] **OKLCH browser fallbacks** — OKLCH is not supported in older Chrome/Edge/Samsung Browser. Add hex or P3 fallbacks to the token output, or document a minimum browser support matrix that explicitly rules out those browsers.

- [ ] **Cross-browser Playwright tests** — Currently Chromium-only. Add Firefox and WebKit to `playwright.config.ts` and lock in visual regression baselines before multiple products depend on the system.

- [ ] **WCAG 2.1 AA conformance statement** — Accessibility work is strong but informal. Add a stated conformance level to the docs so product teams have something to reference for audits and legal requirements.

---

## Tier 3 — Nice-to-have

- [ ] **Component expansion** — Foundational components (button, form, typography) are solid. First asks from product teams will likely be: card/container, modal/dialog, badge, toast/alert, tabs, navigation. Prioritize based on actual product needs.

- [ ] **Figma token sync** — Sync Candor tokens to a Figma Variables library (via Tokens Studio or the native Figma Variables API) to close the design-to-code loop and prevent token drift across products.

- [ ] **Component API documentation** — Add prop/input/output tables to each Storybook story (via `argTypes` descriptions). Products adopting the library need to know the public API without reading source.

- [ ] **Contribution guide** — Document how external teams can propose new components, report bugs, and submit PRs against Candor.

---

## Reference: Current state

| Area | Status | Notes |
|---|---|---|
| Package structure | ❌ App-only | Not set up for npm distribution |
| Token formats | ⚠️ SCSS + CSS vars | No JSON or standalone CSS export |
| Component coverage | ✅ Foundational | Button, form, typography complete |
| Dark mode | ✅ Complete | Token system + Storybook toggle working |
| Accessibility | ✅ Strong | Contrast validated, a11y tests present |
| Testing | ⚠️ Partial | Playwright only, Chromium-only, no unit tests |
| CI/CD | ❌ None | No automated pipeline |
| Versioning | ❌ None | Frozen at 1.0.0, no changelog |
| Storybook deploy | ❌ None | Local only |
| Documentation | ✅ Strong | README, CLAUDE.md, docs/ all comprehensive |
