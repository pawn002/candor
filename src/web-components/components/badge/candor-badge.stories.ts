import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Badge',
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

**Badge text uses Atkinson Hyperlegible.** The \`sm\` size (14px) uses bold — at 14px bold
unlocks a lower OKCA threshold and Atkinson only ships in 400 and 700, so bold is the
correct weight for small labeled elements. The \`md\` size (16px) uses regular — at 16px
both weights require the same 4.5 contrast floor, so the lighter weight is preferred.
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
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:560px;padding:var(--spacing-md);">
        <div style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);line-height:var(--line-height-relaxed);display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <p style="margin:0;">Use the existing status token triplets to express ordered severity scales. The label is read as a semantic term — Atkinson bold ensures it is legible at small sizes.</p>
          <p style="margin:0;"><strong style="color:var(--color-text-default);font-weight:var(--font-weight-semibold);">Mapping rule:</strong> low/minor/suggestion → success (green) · medium/moderate/recommendation → warning (amber) · high/critical/fundamental → error (red)</p>
        </div>
        <candor-card variant="outlined">
          <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Disagreement severity</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <candor-badge variant="success">Minor</candor-badge>
            <candor-badge variant="warning">Moderate</candor-badge>
            <candor-badge variant="error">Fundamental</candor-badge>
          </div>
        </candor-card>
        <candor-card variant="outlined">
          <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Security finding severity</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <candor-badge variant="success">Low</candor-badge>
            <candor-badge variant="warning">Medium</candor-badge>
            <candor-badge variant="error">High</candor-badge>
            <candor-badge variant="error">Critical</candor-badge>
          </div>
        </candor-card>
        <candor-card variant="outlined">
          <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Audit finding type</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <candor-badge variant="success">Suggestion</candor-badge>
            <candor-badge variant="warning">Recommendation</candor-badge>
            <candor-badge variant="error">Requirement</candor-badge>
          </div>
        </candor-card>
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
