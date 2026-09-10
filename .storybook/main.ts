import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {},
  // The adaptive eye favicon lives in public/. Pointing staticDirs at it makes
  // Storybook's favicon auto-detection resolve the eye for the manager <link> in
  // BOTH dev and build — without this, the dev manager falls back to Storybook's
  // own default logo while only the build picks up the public/ copy. It replaces
  // the placeholder and clears the /favicon.ico 404 on the published site.
  // Safari ignores rel="icon" SVGs, so add a rasterised PNG fallback below —
  // browsers that support the SVG (Chrome, Edge, Firefox) prefer it.
  staticDirs: ["../public"],
  // Chromatic's `externals` is deliberately NOT set here (#281). Files in
  // public/ are served at the Storybook root but sit outside every story's
  // module graph, so TurboSnap cannot see a change to one — which is exactly
  // what that option is for.
  //
  // It would be wrong here, not merely unnecessary. Chromatic captures the
  // story iframe, and nothing in public/ reaches it: the two favicons are
  // consumed by the manager chrome and by src/index.html, and preview-head.html
  // — the one file injected into the iframe — pulls Google Fonts and inline CSS
  // and references none of them. Setting `externals` would therefore spend a
  // full 292-snapshot rebuild on every favicon edit to guard a visual change
  // that cannot occur.
  //
  // What flips that is a story rendering one of these assets. TurboSnap would
  // then bypass a build in which the image genuinely changed, and the stale
  // snapshot would pass with nothing reporting it. So the condition is checked
  // rather than trusted: `npm run audit:docs` fails if any story, MDX page or
  // preview file references a public/ asset by path while this stays unset.
  managerHead: (head) =>
    `${head}\n<link rel="icon" type="image/png" sizes="32x32" href="./favicon.png" />`,
};
export default config;
