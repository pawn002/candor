import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Typography/Text',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-text>\` covers body copy, captions, and UI chrome labels. Three variants:

| Variant | Typeface | Use case |
|---|---|---|
| \`body\` | Noto Serif | General body text, descriptions, explanatory copy |
| \`caption\` | Noto Serif italic | Supplementary context, figure captions, timestamps |
| \`label\` | Roboto Flex | UI chrome — button text, tab labels, field annotations |

**Text vs. AccessibleText:** Use \`<candor-text>\` for body content rendered in Noto Serif
or Roboto Flex. Use \`<candor-accessible-text>\` (Atkinson Hyperlegible) for critical
functional text — form labels, error messages, status indicators — where legibility under
stress is the priority.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'caption', 'label'],
      description: 'Text style variant — body (Noto Serif, editorial), caption (italic supplementary), label (Roboto Flex, UI chrome)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Text size. xs (12px) is decorative only.',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
      description: 'Text color',
    },
    bold: {
      control: 'boolean',
      description: 'Bold weight — for label: use only for structural hierarchy, not urgency.',
    },
  },
  args: { variant: 'body', size: 'md', color: 'primary', bold: false },
  render: (args) => ({
    template: `<candor-text variant="${args['variant']}" size="${args['size']}" color="${args['color']}" ${args['bold'] ? 'bold' : ''}>Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines, it produces results that faster methods cannot.</candor-text>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Body: Story = {
  args: { variant: 'body', size: 'md', color: 'primary', bold: false },
};

export const Caption: Story = {
  args: { variant: 'caption', size: 'sm', color: 'secondary', bold: false },
  render: () => ({
    template: `<candor-text variant="caption" size="sm" color="secondary">Figure 1. Optical sizing in Roboto Flex means stroke weight adapts to the rendered size — larger text naturally carries heavier strokes.</candor-text>`,
  }),
};

export const Label: Story = {
  args: { variant: 'label', size: 'sm', color: 'primary', bold: false },
  render: () => ({
    template: `<candor-text variant="label" size="sm">Section title</candor-text>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">xs · 12px</candor-text>
          <candor-text variant="body" size="xs">Decorative only — icons, badge chrome, non-readable metadata.</candor-text>
        </div>
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">sm · 14px</candor-text>
          <candor-text variant="body" size="sm">System floor for readable text. Dense UI, captions, secondary prose.</candor-text>
        </div>
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">md · 16px</candor-text>
          <candor-text variant="body" size="md">Default body size. Comfortable baseline for sustained reading.</candor-text>
        </div>
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">lg · 20px</candor-text>
          <candor-text variant="body" size="lg">Intro paragraphs, pull quotes, lead text above an article.</candor-text>
        </div>
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">xl · 25px</candor-text>
          <candor-text variant="body" size="xl">Large display text. Prefer HeadingComponent for structural headings.</candor-text>
        </div>
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">2xl · 31px</candor-text>
          <candor-text variant="body" size="2xl">Display scale — use HeadingComponent (h2) for semantic heading use.</candor-text>
        </div>
        <div style="display:flex;align-items:baseline;gap:1rem;">
          <candor-text variant="label" size="xs" color="secondary" style="min-width:7ch;">3xl · 39px</candor-text>
          <candor-text variant="body" size="3xl">Hero display — use HeadingComponent (h1) for semantic heading use.</candor-text>
        </div>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-text variant="body">Primary — default body color</candor-text>
        <candor-text variant="body" color="secondary">Secondary — subtle, for supporting content</candor-text>
        <candor-text variant="body" color="disabled">Disabled — for inactive or unavailable text</candor-text>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <div>
          <candor-text variant="label" size="sm" color="secondary">Body</candor-text><br>
          <candor-text variant="body">Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines, it produces results that faster methods cannot.</candor-text>
        </div>
        <div>
          <candor-text variant="label" size="sm" color="secondary">Caption</candor-text><br>
          <candor-text variant="caption" size="sm" color="secondary">Figure 1. Optical sizing in Roboto Flex means stroke weight adapts to the rendered size — larger text naturally carries heavier strokes.</candor-text>
        </div>
        <div>
          <candor-text variant="label" size="sm" color="secondary">Label</candor-text><br>
          <candor-text variant="label">Section title</candor-text>
        </div>
        <div>
          <candor-text variant="label" size="sm" color="secondary">Label — bold (structural hierarchy)</candor-text><br>
          <candor-text variant="label" bold>Column header</candor-text>
        </div>
      </div>
    `,
  }),
};
