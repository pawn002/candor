import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@chromatic-com/storybook"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  docs: {},
};
export default config;
