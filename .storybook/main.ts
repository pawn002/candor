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
  managerHead: (head) =>
    `${head}\n<link rel="icon" type="image/png" sizes="32x32" href="./favicon.png" />`,
};
export default config;
