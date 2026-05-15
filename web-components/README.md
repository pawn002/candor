# @candor-design/web-components

Framework-agnostic Lit 3 custom elements for the [Candor design system](https://github.com/pawn002/candor) — a humanist design system built with OKLCH colors, variable-font typography, and WCAG 2.1 AA accessibility.

**[Browse components →](https://main--69c25e2492ad056c24329876.chromatic.com)**

## Install

```bash
npm install @candor-design/web-components @candor-design/tokens
```

Both packages share a single version number — install the same version of each.

## Usage

Load the tokens stylesheet once at the document level and import the components package. CSS custom properties pierce Shadow DOM boundaries, so a single `<link>` resolves inside every component's shadow root — no per-component injection.

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.css">
<script type="module" src="node_modules/@candor-design/web-components/dist/candor-web-components.js"></script>

<candor-button variant="primary">Save changes</candor-button>
<candor-input label="Email" type="email" required></candor-input>
<candor-badge variant="success">Active</candor-badge>
```

### Bundler import

```js
import '@candor-design/web-components';
// All 34 custom elements are now registered
```

Named exports give you typed access to the element classes — useful for programmatic instantiation or TypeScript references. Importing a class still triggers `customElements.define()`, so the tag is registered as a side effect:

```ts
import { CandorButton, CandorInput } from '@candor-design/web-components';
```

## What's included

34 custom elements covering typography, display, navigation, forms, overlays, and data:

| Category | Tags |
|---|---|
| Typography | `candor-heading`, `candor-text`, `candor-accessible-text`, `candor-article` |
| Display | `candor-badge`, `candor-alert`, `candor-card`, `candor-stat`, `candor-progress` |
| Navigation | `candor-button`, `candor-chip`, `candor-breadcrumb`, `candor-pagination`, `candor-toolbar` (+ `candor-toolbar-separator`), `candor-navigation` |
| Form | `candor-input`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`, `candor-chat-input` |
| Overlays | `candor-tooltip`, `candor-modal`, `candor-drawer`, `candor-toast` (+ `candor-toast-container`) |
| Compound | `candor-tabs` (+ `candor-tab-panel`), `candor-accordion-item`, `candor-disclosure`, `candor-menu` |
| Data | `candor-table`, `candor-data-grid` |

## Form participation

Form controls (`candor-input`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`) use the [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) API with `static formAssociated = true`. They participate in native `<form>` submission — values appear in `FormData`, validation works, and `:disabled` styles apply correctly.

## Distribution

- `dist/candor-web-components.js` — ESM bundle (~170 kB, ~31 kB gzipped). Includes Lit.
- `dist/candor-web-components.umd.cjs` — UMD bundle for CDN / legacy environments.
- `dist/index.d.ts` + per-component `.d.ts` — TypeScript declarations.

## License

ISC
