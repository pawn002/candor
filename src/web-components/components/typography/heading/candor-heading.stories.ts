import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Typography/Heading',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Roboto Flex** — the display and body typeface, used here at heading scale.

\`<candor-heading>\` maps a semantic level (\`h1\`–\`h6\`) to the correct token from the
Major Third type scale (1.25× ratio from a 16px base). Use it any time a heading needs to
live outside of \`<candor-article>\`'s prose context — page titles, section headers, card
headings, dashboard panels.

---

### Type scale

| Level | Token | Size |
|---|---|---|
| h1 | \`--font-size-h1\` | ~40px |
| h2 | \`--font-size-h2\` | ~32px |
| h3 | \`--font-size-h3\` | ~25px |
| h4 | \`--font-size-h4\` | ~20px |
| h5 | \`--font-size-h5\` | 16px |
| h6 | \`--font-size-h6\` | 14px |

**h6** follows the Major Third scale to ~13px but is floored at \`--font-size-sm\` (14px) — Candor's minimum for any readable text.

---

### Roboto Flex variable axes

Roboto Flex is a **variable font**. The component sets \`font-optical-sizing: auto\`, which
instructs the browser to activate the \`opsz\` axis — stroke weight adapts to the computed
font size automatically. A rendered h1 gets heavier strokes than an h4 without any manual
\`font-weight\` adjustment.

---

### Semantic vs. visual level

The \`level\` attribute controls both the visual size and the ARIA heading level
(\`role="heading"\` + \`aria-level\`). These must match the document outline — do not use
\`h1\` for visual impact when the content is a subsection.
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
  args: { level: 'h1', color: 'primary' },
  render: (args) => ({
    template: `<candor-heading level="${args['level']}" color="${args['color']}">The quick brown fox jumps over the lazy dog</candor-heading>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllHeadings: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);">
        <candor-heading level="h1">The Case for Slower Reading</candor-heading>
        <candor-heading level="h2">What Slow Reading Actually Means</candor-heading>
        <candor-heading level="h3">The Neuroscience of Attention</candor-heading>
        <candor-heading level="h4">A Note on Environment</candor-heading>
        <candor-heading level="h5">Recommended conditions</candor-heading>
        <candor-heading level="h6">On annotation tools</candor-heading>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
        <candor-heading level="h2" color="primary">Primary Color</candor-heading>
        <candor-heading level="h2" color="secondary">Secondary Color</candor-heading>
        <candor-heading level="h2" color="disabled">Disabled Color</candor-heading>
      </div>
    `,
  }),
};
