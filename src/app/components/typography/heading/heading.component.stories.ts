import type { Meta, StoryObj } from '@storybook/angular';
import { HeadingComponent } from './heading.component';

const meta: Meta<HeadingComponent> = {
  title: 'Angular Components/Typography/Heading',
  component: HeadingComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Roboto Flex** — the display and body typeface, used here at heading scale.

\`HeadingComponent\` maps a semantic level (\`h1\`–\`h6\`) to the correct token from the
Major Third type scale (1.25× ratio from a 16px base). Use it any time a heading needs to
live outside of \`ArticleComponent\`'s prose context — page titles, section headers, card
headings, dashboard panels.

---

### Type scale

| Level | Token | Size |
|---|---|---|
| h1 | \`--font-size-h1\` | ~40px |
| h2 | \`--font-size-h2\` | ~32px |
| h3 | \`--font-size-h3\` | ~25px |
| h4 | \`--font-size-h4\` | ~20px |
| h5 | \`--font-size-h5\` | ~16px |
| h6 | \`--font-size-h6\` | ~13px |

---

### Roboto Flex variable axes

Roboto Flex is a **variable font**. The component sets \`font-optical-sizing: auto\`, which
instructs the browser to activate the \`opsz\` axis — stroke weight adapts to the computed
font size automatically. A rendered h1 gets heavier strokes than an h4 without any manual
\`font-weight\` adjustment. This creates hierarchy that feels designed, not engineered.

**Before reaching for a weight override, ask whether \`opsz\` already does the job.**

---

### Semantic vs. visual level

The \`level\` input controls both the visual size and the ARIA heading level
(\`role="heading"\` + \`aria-level\`). These must match the document outline —
do not use \`h1\` for visual impact when the content is a subsection. If you need
a visually large heading at a lower semantic level, that is a layout problem, not
a heading problem.
        `.trim(),
      },
    },
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Semantic heading level',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
      description: 'Text color variant',
    },
  },
};

export default meta;
type Story = StoryObj<HeadingComponent>;

export const Default: Story = {
  args: { level: 'h1', color: 'primary' },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H1: Story = {
  args: {
    level: 'h1',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H2: Story = {
  args: {
    level: 'h2',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H3: Story = {
  args: {
    level: 'h3',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H4: Story = {
  args: {
    level: 'h4',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H5: Story = {
  args: {
    level: 'h5',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H6: Story = {
  args: {
    level: 'h6',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const AllHeadings: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <app-heading level="h1" color="primary">The Case for Slower Reading</app-heading>
        <app-heading level="h2" color="primary">What Slow Reading Actually Means</app-heading>
        <app-heading level="h3" color="primary">The Neuroscience of Attention</app-heading>
        <app-heading level="h4" color="primary">A Note on Environment</app-heading>
        <app-heading level="h5" color="primary">Recommended conditions</app-heading>
        <app-heading level="h6" color="primary">On annotation tools</app-heading>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-heading level="h2" color="primary">Primary Color</app-heading>
        <app-heading level="h2" color="secondary">Secondary Color</app-heading>
        <app-heading level="h2" color="disabled">Disabled Color</app-heading>
      </div>
    `,
  }),
};
