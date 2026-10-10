# @candor-design/web-components

Framework-agnostic Lit 3 custom elements for the [Candor design system](https://github.com/pawn002/candor) — a humanist design system built with OKLCH colors, variable-font typography, and WCAG 2.1 AA accessibility.

**[Component catalog and usage rules →](https://main--69c25e2492ad056c24329876.chromatic.com)**

## Documentation

**This package ships API surface only.** The type declarations give you member names and types. They do not carry Candor's usage rules, and several of those rules are not expressible in a `.d.ts` at all — so finding nothing in `node_modules` does not establish that Candor is silent on a question. It establishes that you have not looked yet.

The rules live in the **[component catalog](https://main--69c25e2492ad056c24329876.chromatic.com)**, which is canonical. Questions it answers and this package cannot:

- What markup a `candor-radio` group requires. The grouping is structural, not `name`-based as it is for native inputs, and getting it wrong disables arrow-key navigation *and* mutual exclusion with no error raised.
- Which typeface a given piece of text takes, and why that is a decision rather than a preference.
- Which contrast floor applies to a given piece of text — the floor depends on font size *and* use-case tier, so a colour compliant in one component is not automatically compliant in another.
- How an icon's weight is chosen in a given context, and the icon-only button pattern. (Which icon set, and how to use it, is under [Icons](#icons) below.)
- Which parts of a component are safe to restyle, and which are unsupported.

The package also ships a **[Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest)** at `custom-elements.json`, declared via the `customElements` field. VS Code and JetBrains read it for tag and attribute completion, and it is the machine-readable form of everything above: every element's description, attributes, events, CSS parts and custom properties. It is generated from the component sources and checked against them in CI, so it cannot drift. It is a dev-time artifact — editors and tooling read it, and it never reaches a browser.

Three facts about this package's own API, recorded here because *absence* is invisible in a declaration file:

- The form controls emit **`change`** and **`input`**. There is no `changed` event — a listener bound to it never fires, and nothing reports that.
- **`candor-button` dispatches no custom events.** Bind `@click` on the host element. (The full set across the library is `cell-activate`, `change`, `close`, `color-select`, `dismiss`, `input`, `select`, `send` and `toggle` — checked against the source by `npm run audit:docs`.)
- **There is no `size="icon"`.** Sizes are `small`, `medium` and `large`; an unrecognised value is accepted silently and does nothing.

## Install

```bash
npm install @candor-design/web-components @candor-design/tokens lit
```

`@candor-design/web-components` and `@candor-design/tokens` share a single version number — install the same version of each. **Lit is a peer dependency** (`^3`), so your app and Candor share one copy of it. If your app already uses Lit 3, there is nothing extra to install.

## Usage

Load the tokens stylesheet once at the document level. CSS custom properties pierce Shadow DOM boundaries, so a single `<link>` resolves inside every component's shadow root — no per-component injection.

### Import only what you render

Each component has its own entry point, named for its tag without the `candor-` prefix. Importing it registers that element — and anything it composes — and nothing else:

```js
import '@candor-design/web-components/button';
import '@candor-design/web-components/radio';
// <candor-button> and <candor-radio> are now registered; nothing else is shipped
```

This is the recommended form. It is also what makes adoption incremental: an app can move to Candor one element at a time, with its own elements alongside.

Each entry point also exports the element class, for typed programmatic use:

```ts
import { CandorButton } from '@candor-design/web-components/button';
```

The tabs, toast and toolbar entry points each register a companion element as well (`candor-tab-panel`, `candor-toast-container`, `candor-toolbar-separator`).

### Import everything

```js
import '@candor-design/web-components';
// All 40 custom elements are now registered
```

The package root registers every element. **Named imports from the root still register all 40** — `import { CandorButton } from '@candor-design/web-components'` ships the whole library, because registering an element is a side effect a bundler must keep. Use the per-component entry point when size matters.

### Without a bundler

`@candor-design/web-components/standalone` is a single file with every element, Lit and culori included, for a `<script>` tag:

```html
<link rel="stylesheet" href="node_modules/@candor-design/tokens/tokens/candor-tokens.css">
<script type="module" src="node_modules/@candor-design/web-components/dist/candor-web-components.standalone.js"></script>

<candor-button variant="primary">Save changes</candor-button>
<candor-input label="Email" type="email" required></candor-input>
```

Don't import it from bundled code — it carries its own Lit, which is exactly the duplicate the peer dependency exists to avoid.

### If a `candor-*` tag is already registered

Candor skips any tag that is already defined and logs a warning naming it, instead of throwing. Every other element still registers. That is what lets a codebase with its own `candor-card` adopt the rest of the library before renaming it — though the warning means two definitions are competing for one name, and only the first one is used.

## Icons

Candor uses **[Phosphor](https://phosphoricons.com)**. When you need an icon, take it from Phosphor — [`@phosphor-icons/core`](https://www.npmjs.com/package/@phosphor-icons/core) ships the SVGs — and inline its path data in an `<svg>`, as Candor's own components do. Font-class icons (`<i class="ph ph-info">`) do not reach inside a shadow root you author yourself.

The handful of glyphs in this package are component chrome — the close, caret and status marks the components draw — not an icon set. They are not exported and will not grow into one.

Weight carries meaning: **fill** for actions, **bold** for direction, **regular** for information and status. See the [Icons page](https://main--69c25e2492ad056c24329876.chromatic.com/?path=/docs/design-tokens-icons--docs) in the catalog for the full rule and the icon-only button pattern.

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

- `dist/index.js` and `dist/components/**` — ESM, one module per source file. Imports `lit` (peer) and `culori` (dependency).
- `dist/candor-web-components.standalone.js` — every element in one ESM file, with Lit and culori bundled, for `<script type="module">`.
- `dist/**/*.d.ts` — TypeScript declarations.

ESM only: there is no CommonJS or UMD build as of 6.0.0.

## License

ISC
