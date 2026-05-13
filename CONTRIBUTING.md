# Contributing to Candor

Candor is a humanist design system. Every contribution — components, tokens, stories, documentation — is held to the same standard: it should feel like a considered, human-authored artifact. Not a library of parts. See `CLAUDE.md` for the full design philosophy.

## Getting started

```bash
npm install
npm run storybook        # http://localhost:6006 — primary development environment (published: https://main--69c25e2492ad056c24329876.chromatic.com)
npm start                # http://localhost:4200 — Angular dev server
npm run build:wc         # Build @candor-design/web-components → web-components/dist/
npm run test:playwright  # Playwright tests (auto-starts Storybook)
npm test                 # Angular unit tests
```

Node 20.16+, 22.19+, or 24+ is required (Storybook 10 ESM).

## Before you open a PR

Read `CLAUDE.md`. It covers:
- Design token conventions (OKLCH format, no hard-coded values)
- Angular patterns in use (zoneless mode, `@if`/`@for`, signal types, `ViewEncapsulation.None`)
- Accessibility authoring conventions (live regions, host element ARIA trap, landmark pollution)
- Typography rules (Roboto Flex variable axes, Atkinson bold usage, tracking requirements)
- Common pitfalls

## The PR checklist

Every PR uses `.github/PULL_REQUEST_TEMPLATE.md`. The checklist is tiered:

- **Universal** — applies to all PRs (tokens, control flow syntax, stories, accessible names)
- **Component** — applies when adding or modifying a component (API surface, live regions, landmark pollution, story patterns)
- **Composite widget** — applies to any component that builds a custom interaction model from generic elements (custom grids, dialogs, menus, pickers, tab sets)

The composite widget section requires a **screen reader walkthrough** before merge. This is not optional. Composite widgets generated 50% of all AT issues found during the initial 26-component audit. Visual review does not catch AT failures.

See `docs/A11Y-AUDIT.md` for per-component audit findings, `docs/A11Y-ANALYSIS.md` for the cross-cutting patterns that informed the checklist, and `docs/ACCESSIBILITY-CONFORMANCE.md` for the library's formal conformance statement.

## Design tokens

All color values must use OKLCH format. Use `cpqi meta <hex>` to convert any incoming hex color to OKLCH before adding it to `src/design-tokens/colors.scss`. Use `cpqi contrast <fg> <bg> -q` to verify contrast before finalising.

Do not add a new semantic token without a corresponding usage in at least one component story.

## Component authoring

### Angular components

1. Create the component in `src/app/components/<category>/`
2. Each component needs: `.ts`, `.scss`, `.stories.ts`
3. Import tokens: `@use '../../../design-tokens' as tokens;`
4. Stories use CSF3 format — see existing stories for examples
5. Stories must demonstrate correct consumer-level markup (see PR checklist — "Stories as AT documentation")

### Lit web components

When adding a new Angular component, add a corresponding Lit custom element in `src/web-components/components/<category>/`:

1. Create `candor-<name>.ts` — extend `LitElement`, use `@customElement('candor-<name>')`, translate Angular SCSS to a `static styles = css\`...\`` template literal (CSS custom properties pierce Shadow DOM, so all `var(--...)` tokens resolve automatically)
2. Create `candor-<name>.stories.ts` — use `title: 'Web Components/<Category>'` and the Angular Storybook `render: (args) => ({ template: '...' })` pattern with raw HTML custom element tags
3. Re-export from `src/web-components/index.ts`
4. Run `npm run build:wc` to verify the build is clean

**Form controls** use `ElementInternals` for native form participation:
```typescript
static formAssociated = true;
private _internals = this.attachInternals();
// On value change:
this._internals.setFormValue(this.value);
```

**`candor-article`** uses light DOM to let prose styles reach projected content:
```typescript
override createRenderRoot() { return this; }
```

**Version:** keep `web-components/package.json` version in sync with `package.json`. Both are bumped together via the release scripts.

## Breaking changes

A breaking change is anything that requires a consumer to update their code or markup without a TypeScript error telling them to. This includes:

- Renaming or removing a design token — consumers using `var(--old-name)` in plain CSS will silently break
- Renaming or removing a component input or output
- Changing an ARIA pattern that consumer markup or tests rely on
- Any visual change significant enough to fail screenshot regression tests

Breaking changes require:
1. The "breaking change" box checked in the PR template
2. A version bump to the next major version
3. An entry in `CHANGELOG.md` describing what changed and how to migrate

The full taxonomy and migration note template are in `docs/BREAKING-CHANGES.md`. When in doubt about whether a change is breaking, assume it is.

## Review expectations

PRs that touch composite widgets will receive a review comment requesting evidence of an SR walkthrough — either a Playwright AT snapshot or a written trace of what NVDA + Chrome announces at each interaction phase (tab-in, navigation, activation, pre-set state). The PR checklist item is the author's self-declaration; the review comment is the second check.

All other PRs: standard code review plus a visual pass in Storybook.
