import type { Preview, Decorator } from '@storybook/web-components-vite';
import '../src/styles.scss';
import { CandorDocsContainer } from './candor-docs';

// Deliberately NOT `import '../src/web-components/index'`. That barrel registers
// all 40 elements in one module, and anything preview.ts imports lands in every
// story's dependency graph — so a one-line change to any component marked all 49
// story files dirty and TurboSnap's `onlyChanged` selected the whole Storybook
// on every build (#281). Each story now imports the components it renders, which
// is the edge the graph was missing.
//
// `untraced` on the barrel would have silenced the symptom and severed the only
// path from a component to its story, so a real regression would have gone
// un-snapshotted and green. Registration lives with the story that needs it
// instead. `audit:docs` gates that every tag a story renders is imported by it.

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
    docs: {
      container: CandorDocsContainer,
    },
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
