import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BadgeComponent } from './badge.component';
import { CardComponent } from '../card/card.component';

const meta: Meta<BadgeComponent> = {
  title: 'Angular Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CardComponent] })],
  parameters: {
    docs: {
      description: {
        component: `
Small labeled indicator for status, category, or count. Use badges to annotate list items,
headings, or nav items — not as standalone elements.

Six color variants map to semantic intent: \`default\` (neutral), \`primary\` (brand), \`secondary\`
(supporting), \`success\`, \`warning\`, \`error\`. Two sizes: \`sm\` (14px, default) and \`md\` (16px).

**Badge text uses Atkinson Hyperlegible** at 14px bold. The text label is the primary indicator;
color variant reinforces it. Bold is appropriate here because it is a structural choice —
badges are UI labels, not prose — and Atkinson only ships in 400 and 700, so bold is the
intended weight for small labeled elements.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'error', 'warning'],
      description: 'Badge color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Badge size',
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size">Badge</app-badge>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <app-badge variant="default">Default</app-badge>
        <app-badge variant="primary">Primary</app-badge>
        <app-badge variant="secondary">Secondary</app-badge>
        <app-badge variant="success">Success</app-badge>
        <app-badge variant="error">Error</app-badge>
        <app-badge variant="warning">Warning</app-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <app-badge variant="primary" size="sm">Small</app-badge>
        <app-badge variant="primary" size="md">Medium</app-badge>
      </div>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-top: 1rem;">
        <app-badge variant="error" size="sm">Small</app-badge>
        <app-badge variant="error" size="md">Medium</app-badge>
      </div>
    `,
  }),
};

export const OrdinalSeverity: Story = {
  name: 'Pattern: Ordinal Severity Scale',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 560px; font-family: var(--font-family-base);">

        <div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: 1rem; line-height: var(--line-height-relaxed);">
            Use the existing status token triplets to express ordered severity scales.
            The label is read as a semantic term — Atkinson bold ensures it is legible at small sizes.
            Do not use info/success/warning/error as proxies for severity; map the ordinal position directly.
          </p>

          <p style="font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: 1.5rem; line-height: var(--line-height-relaxed);">
            <strong style="color: var(--color-text-default);">Mapping rule:</strong>
            low/minor/suggestion → success (green) ·
            medium/moderate/recommendation → warning (amber) ·
            high/critical/fundamental → error (red)
          </p>
        </div>

        <div>
          <p style="font-size: var(--font-size-xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-subtle); margin-bottom: 0.75rem;">Disagreement severity (Sovereign Council)</p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <app-badge variant="success">Minor</app-badge>
            <app-badge variant="warning">Moderate</app-badge>
            <app-badge variant="error">Fundamental</app-badge>
          </div>
        </div>

        <div>
          <p style="font-size: var(--font-size-xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-subtle); margin-bottom: 0.75rem;">Security finding severity</p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <app-badge variant="success">Low</app-badge>
            <app-badge variant="warning">Medium</app-badge>
            <app-badge variant="error">High</app-badge>
            <app-badge variant="error">Critical</app-badge>
          </div>
        </div>

        <div>
          <p style="font-size: var(--font-size-xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-subtle); margin-bottom: 0.75rem;">Audit finding type</p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <app-badge variant="success">Suggestion</app-badge>
            <app-badge variant="warning">Recommendation</app-badge>
            <app-badge variant="error">Requirement</app-badge>
          </div>
        </div>

        <div style="padding: var(--spacing-sm); background: var(--color-bg-surface); border-radius: var(--radius-md); border-left: 4px solid var(--color-border-strong);">
          <p style="font-size: var(--font-size-sm); color: var(--color-text-subtle); line-height: var(--line-height-relaxed); margin: 0;">
            <strong style="color: var(--color-text-default);">When to use custom variants instead:</strong>
            If your domain needs a fifth severity level, or if the green/amber/red mapping would confuse users
            (e.g. green ≠ low-risk in your context), extend the badge with domain-specific CSS variables
            following the same <code>-bg</code> / <code>-text</code> pairing convention.
            See DESIGN-TOKENS.md for the token naming pattern.
          </p>
        </div>

      </div>
    `,
  }),
};

export const InContext: Story = {
  render: () => ({
    template: `
      <app-card variant="outlined" padding="md">
        <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Notifications</span>
          <app-badge variant="primary">3 new</app-badge>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Build completed</span>
            <app-badge variant="success">Success</app-badge>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Disk usage at 90%</span>
            <app-badge variant="warning">Warning</app-badge>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Deploy failed</span>
            <app-badge variant="error">Error</app-badge>
          </div>
        </div>
      </app-card>
    `,
  }),
};
