import type { Preview, StoryContext, StoryFn } from '@storybook/angular';
import '../src/web-components/index';

// Applies data-theme to the iframe <html> element without wrapping the story,
// which avoids the Angular rendering issues caused by withThemeByDataAttribute.
const withTheme = (story: StoryFn, context: StoryContext) => {
  const theme = (context.globals['theme'] as string) ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return story(context.args, context);
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color scheme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light theme' },
          { value: 'dark', title: 'Dark theme' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [withTheme],

  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Design Tokens', 'Typography', 'Button', 'Form', 'Components', 'Examples'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },

  initialGlobals: {
    theme: 'light',
  }
};

export default preview;
