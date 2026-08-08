# @candor-design/web-components

Framework-agnostic Lit 3 custom elements for the [Candor design system](https://github.com/pawn002/candor) — a humanist design system built with OKLCH colors, variable-font typography, and WCAG 2.1 AA accessibility.

**[Component catalog and usage rules →](https://main--69c25e2492ad056c24329876.chromatic.com)**

## Documentation

**This package ships API surface only.** The type declarations give you member names and types. They do not carry Candor's usage rules, and several of those rules are not expressible in a `.d.ts` at all — so finding nothing in `node_modules` does not establish that Candor is silent on a question. It establishes that you have not looked yet.

The rules live in the **[component catalog](https://main--69c25e2492ad056c24329876.chromatic.com)**, which is canonical. Questions it answers and this package cannot:

- What markup a `candor-radio` group requires. The grouping is structural, not `name`-based as it is for native inputs, and getting it wrong disables arrow-key navigation *and* mutual exclusion with no error raised.
- Which typeface a given piece of text takes, and why that is a decision rather than a preference.
- Which contrast floor applies to a given piece of text — the floor depends on font size *and* use-case tier, so a colour compliant in one component is not automatically compliant in another.
- Which icon set Candor uses and how an icon's weight is chosen. The icon font is not shipped in this package.
- Which parts of a component are safe to restyle, and which are unsupported.

Three facts about this package's own API, recorded here because *absence* is invisible in a declaration file:

- The form controls emit **`change`** and **`input`**. There is no `changed` event — a listener bound to it never fires, and nothing reports that.
- **`candor-button` dispatches no custom events.** Bind `@click` on the host element. (The full set across the library is `cell-activate`, `change`, `close`, `color-select`, `dismiss`, `input`, `select`, `send` and `toggle` — checked against the source by `npm run audit:docs`.)
- **There is no `size="icon"`.** Sizes are `small`, `medium` and `large`; an unrecognised value is accepted silently and does nothing.

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
// All 40 custom elements are now registered
```

Named exports give you typed access to the element classes — useful for programmatic instantiation or TypeScript references. Importing a class still triggers `customElements.define()`, so the tag is registered as a side effect:

```ts
import { CandorButton, CandorInput } from '@candor-design/web-components';
```

## What's included

37 components, registering 40 custom elements, covering typography, display, navigation, forms, overlays, and data. The two counts differ because three components register a companion element alongside the parent — shown as `(+ …)` below:

| Category | Tags |
|---|---|
| Typography | `candor-heading`, `candor-text`, `candor-accessible-text`, `candor-article`, `candor-code` |
| Display | `candor-badge`, `candor-alert`, `candor-card`, `candor-stat`, `candor-progress` |
| Navigation | `candor-button`, `candor-chip`, `candor-breadcrumb`, `candor-pagination`, `candor-toolbar` (+ `candor-toolbar-separator`), `candor-navigation` |
| Form | `candor-input`, `candor-autocomplete`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`, `candor-chat-input` |
| Overlays | `candor-tooltip`, `candor-modal`, `candor-drawer`, `candor-toast` (+ `candor-toast-container`) |
| Compound | `candor-tabs` (+ `candor-tab-panel`), `candor-accordion-item`, `candor-disclosure`, `candor-menu` |
| Data | `candor-table`, `candor-data-grid`, `candor-tone-picker` |

## Form participation

Form controls (`candor-input`, `candor-checkbox`, `candor-radio`, `candor-switch`, `candor-select`, `candor-slider`, `candor-listbox`, `candor-combobox`) use the [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) API with `static formAssociated = true`. They participate in native `<form>` submission — values appear in `FormData`, validation works, and `:disabled` styles apply correctly.

## Distribution

- `dist/candor-web-components.js` — ESM bundle (~170 kB, ~31 kB gzipped). Includes Lit.
- `dist/candor-web-components.umd.cjs` — UMD bundle for CDN / legacy environments.
- `dist/index.d.ts` + per-component `.d.ts` — TypeScript declarations.

## License

ISC
