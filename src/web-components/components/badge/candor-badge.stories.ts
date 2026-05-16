import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-badge>\` — small labeled indicator for status, category, or count. Use badges to
annotate list items, headings, or nav items — not as standalone elements.

Six color variants map to semantic intent: \`default\` (neutral), \`primary\` (brand),
\`secondary\` (supporting), \`success\`, \`warning\`, \`error\`. Two sizes: \`sm\` (14px,
default) and \`md\` (16px).

**Badge text uses Atkinson Hyperlegible** at 14px bold. The text label is the primary
indicator; color variant reinforces it. Bold is appropriate here because it is a structural
choice — badges are UI labels, not prose — and Atkinson only ships in 400 and 700, so bold
is the intended weight for small labeled elements.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'error', 'warning'],
      type: { name: 'string' },
      description: 'Badge color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      type: { name: 'string' },
      description: 'Badge size',
    },
  },
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    template: `<candor-badge variant="${args['variant']}" size="${args['size']}">Badge</candor-badge>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
        <candor-badge variant="default">Default</candor-badge>
        <candor-badge variant="primary">Primary</candor-badge>
        <candor-badge variant="secondary">Secondary</candor-badge>
        <candor-badge variant="success">Success</candor-badge>
        <candor-badge variant="error">Error</candor-badge>
        <candor-badge variant="warning">Warning</candor-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
        <candor-badge variant="primary" size="sm">Small</candor-badge>
        <candor-badge variant="primary" size="md">Medium</candor-badge>
      </div>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin-top:1rem;">
        <candor-badge variant="error" size="sm">Small</candor-badge>
        <candor-badge variant="error" size="md">Medium</candor-badge>
      </div>
    `,
  }),
};

export const OrdinalSeverity: Story = {
  name: 'Pattern: Ordinal Severity Scale',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:2rem;max-width:560px;font-family:var(--font-family-base);">
        <div>
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:1rem;line-height:var(--line-height-relaxed);">Use the existing status token triplets to express ordered severity scales. The label is read as a semantic term — Atkinson bold ensures it is legible at small sizes.</p>
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:1.5rem;line-height:var(--line-height-relaxed);">
            <strong style="color:var(--color-text-default);">Mapping rule:</strong>
            low/minor/suggestion → success (green) ·
            medium/moderate/recommendation → warning (amber) ·
            high/critical/fundamental → error (red)
          </p>
        </div>
        <div>
          <p style="font-size:var(--font-size-xs);letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-subtle);margin-bottom:0.75rem;">Disagreement severity</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <candor-badge variant="success">Minor</candor-badge>
            <candor-badge variant="warning">Moderate</candor-badge>
            <candor-badge variant="error">Fundamental</candor-badge>
          </div>
        </div>
        <div>
          <p style="font-size:var(--font-size-xs);letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-subtle);margin-bottom:0.75rem;">Security finding severity</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <candor-badge variant="success">Low</candor-badge>
            <candor-badge variant="warning">Medium</candor-badge>
            <candor-badge variant="error">High</candor-badge>
            <candor-badge variant="error">Critical</candor-badge>
          </div>
        </div>
        <div>
          <p style="font-size:var(--font-size-xs);letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-subtle);margin-bottom:0.75rem;">Audit finding type</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <candor-badge variant="success">Suggestion</candor-badge>
            <candor-badge variant="warning">Recommendation</candor-badge>
            <candor-badge variant="error">Requirement</candor-badge>
          </div>
        </div>
      </div>
    `,
  }),
};

export const InContext: Story = {
  render: () => ({
    template: `
      <candor-card variant="outlined" padding="md">
        <div slot="header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>Notifications</span>
          <candor-badge variant="primary">3 new</candor-badge>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Build completed</span>
            <candor-badge variant="success">Success</candor-badge>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Disk usage at 90%</span>
            <candor-badge variant="warning">Warning</candor-badge>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Deploy failed</span>
            <candor-badge variant="error">Error</candor-badge>
          </div>
        </div>
      </candor-card>
    `,
  }),
};
