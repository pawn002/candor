import type { Preview, Decorator } from '@storybook/web-components-vite';
import '../src/styles.scss';
import '../src/web-components/index';

// Applies data-theme to the iframe <html> element without wrapping the story,
// so the theme switch never disturbs the rendered markup.
const withTheme: Decorator = (story, context) => {
  const theme = (context.globals['theme'] as string) ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return story();
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
        order: ['Introduction', 'Design Tokens', 'Typography', 'Components', 'Examples'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    viewport: { defaultViewport: 'reset' },
  },

  initialGlobals: {
    theme: 'light',
  }
};

export default preview;
