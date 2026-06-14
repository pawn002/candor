import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

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
| \`body\` | Noto Sans | UI body text — descriptions, help copy, onboarding paragraphs |
| \`caption\` | Noto Sans italic | Supplementary context, figure captions, timestamps |
| \`label\` | Roboto Flex | UI chrome — button text, tab labels, field annotations |

**Text vs. AccessibleText:** Use \`<candor-text>\` for body content and UI chrome labels in Noto Sans or Roboto Flex. Use \`<candor-accessible-text>\` (Atkinson Hyperlegible) for instructional text — form labels, error messages, status indicators — where the user must read precisely to know what to do next.

**Text vs. Article:** Use \`<candor-article>\` for long-form authored prose (human or AI-generated) rendered in Noto Serif. \`<candor-text variant="body">\` is for shorter UI paragraphs in Noto Sans.

\`<candor-heading>\` + \`<candor-text>\` cannot substitute for \`<candor-article>\`. The combination gives you a **UI-register content block** (Roboto Flex heading, Noto Sans body) — correct for feature descriptions, onboarding panels, and help cards where the content *explains* the UI. \`<candor-article>\` gives you a **prose-register reading surface** (Noto Serif body, full semantic HTML styling, 65ch reading measure) — correct when the content *is* the subject. The font difference between the two is intentional, not a gap.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'caption', 'label'],
      description: 'Text style variant — body (Noto Sans, UI paragraphs), caption (italic supplementary), label (Roboto Flex, UI chrome)',
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
  render: (args) => html`<candor-text variant="${args['variant']}" size="${args['size']}" color="${args['color']}" ${args['bold'] ? 'bold' : ''}>Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines, it produces results that faster methods cannot.</candor-text>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">xs · 12px</candor-text>
        <candor-text variant="body" size="xs">Decorative only — icons, badge chrome, non-readable metadata.</candor-text>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">sm · 14px</candor-text>
        <candor-text variant="body" size="sm">System floor for readable text. Dense UI, captions, secondary prose.</candor-text>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">md · 16px</candor-text>
        <candor-text variant="body" size="md">Default body size. Comfortable baseline for sustained reading.</candor-text>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">lg · 20px</candor-text>
        <candor-text variant="body" size="lg">Intro paragraphs, pull quotes, lead text above an article.</candor-text>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">xl · 25px</candor-text>
        <candor-text variant="body" size="xl">Large display text. Prefer &lt;candor-heading&gt; for structural headings.</candor-text>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">2xl · 31px</candor-text>
        <candor-text variant="body" size="2xl">Display scale — use &lt;candor-heading&gt; (h2) for semantic heading use.</candor-text>
      </div>
      <div style="display:flex;align-items:baseline;gap:var(--spacing-md);">
        <candor-text variant="label" size="sm" color="secondary" style="min-width:10ch;">3xl · 39px</candor-text>
        <candor-text variant="body" size="3xl">Hero display — use &lt;candor-heading&gt; (h1) for semantic heading use.</candor-text>
      </div>
    </div>
  `,
};

export const ColorVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
      <candor-text variant="body">Primary — default body color</candor-text>
      <candor-text variant="body" color="secondary">Secondary — subtle, for supporting content</candor-text>
      <candor-text variant="body" color="disabled">Disabled — for inactive or unavailable text</candor-text>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
      <candor-card>
        <candor-text variant="label" size="sm" color="secondary">Body</candor-text><br>
        <candor-text variant="body">Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines, it produces results that faster methods cannot.</candor-text>
      </candor-card>
      <candor-card>
        <candor-text variant="label" size="sm" color="secondary">Caption</candor-text><br>
        <candor-text variant="caption" size="sm" color="secondary">Figure 1. Optical sizing in Roboto Flex means stroke weight adapts to the rendered size — larger text naturally carries heavier strokes.</candor-text>
      </candor-card>
      <candor-card>
        <candor-text variant="label" size="sm" color="secondary">Label</candor-text><br>
        <candor-text variant="label">Section title</candor-text>
      </candor-card>
      <candor-card>
        <candor-text variant="label" size="sm" color="secondary">Label — bold (structural hierarchy)</candor-text><br>
        <candor-text variant="label" bold>Column header</candor-text>
      </candor-card>
    </div>
  `,
};
