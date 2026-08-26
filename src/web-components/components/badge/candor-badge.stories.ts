import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../card/candor-card';
import './candor-badge';

// Full-width rule separating showcase scenarios (consistent with the other
// component showcases — dividers, not grouping cards).
const divider = html`<hr style="border: none; border-top: var(--border-width-thin) solid var(--color-border-default); margin: 0; width: 100%;" />`;

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

Both sizes use **Atkinson Hyperlegible**. \`sm\` (14px) is bold — small text needs the
heavier stroke for legibility and contrast. \`md\` (16px) is regular — the contrast floor
is identical for both weights at 16px, so the lighter stroke is preferred.

**The label must name the condition, not just be present.** A badge's fill is decoration on
top of its text, not a second channel — see *Rule: the label carries the meaning* for the
measurement behind that.
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
  render: (args) => html`<candor-badge variant="${args['variant']}" size="${args['size']}">Badge</candor-badge>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
      <candor-badge variant="default">Default</candor-badge>
      <candor-badge variant="primary">Primary</candor-badge>
      <candor-badge variant="secondary">Secondary</candor-badge>
      <candor-badge variant="success">Success</candor-badge>
      <candor-badge variant="error">Error</candor-badge>
      <candor-badge variant="warning">Warning</candor-badge>
    </div>
  `,
};

export const LabelCarriesTheMeaning: Story = {
  name: 'Rule: the label carries the meaning',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `
A badge's **colour is not a channel** — its label is. This is the authoring rule the
component cannot enforce, so it is demonstrated rather than only stated.

The reason is measurable, and it is not primarily about colour vision. Candor's status
background tokens sit at lightness 0.95, and the sRGB gamut permits only about 0.02 chroma
at the red and amber hues up there — green has more room, which is why success reads as
distinct and the other two do not. \`--color-status-error-bg\` and
\`--color-status-warning-bg\` are consequently **deltaE 4 apart in normal vision** (2 under
deuteranopia), where Candor's own scale calls anything under 3 imperceptible.

It cannot be fixed by adding chroma, because there is none to add at that lightness. So the
badge fill is decoration on top of the label, and the label has to do the work.

**The test:** cover the badge's colour with your thumb. Does the sentence still tell you what
happened? If not, the badge is relying on a channel that isn't there (#214).
        `.trim(),
      },
    },
  },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:560px;padding:var(--spacing-md);">
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Insufficient — the number says nothing</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <candor-badge variant="error">3</candor-badge>
          <candor-badge variant="warning">12</candor-badge>
          <candor-badge variant="success">47</candor-badge>
        </div>
        <p style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:var(--spacing-sm) 0 0;line-height:var(--line-height-relaxed);">Three counts. Only the fill distinguishes a failure from a pass, and the first two fills are not reliably distinguishable by anyone.</p>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Sufficient — the label names the condition</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <candor-badge variant="error">3 failed</candor-badge>
          <candor-badge variant="warning">12 need review</candor-badge>
          <candor-badge variant="success">47 passed</candor-badge>
        </div>
        <p style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:var(--spacing-sm) 0 0;line-height:var(--line-height-relaxed);">Same colours, same component. The meaning now survives the colour being invisible, which is what the Tier 3 discount is for.</p>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Also fine — no status meaning to carry</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <candor-badge variant="primary">3 new</candor-badge>
          <candor-badge variant="secondary">Beta</candor-badge>
          <candor-badge variant="default">Draft</candor-badge>
        </div>
        <p style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:var(--spacing-sm) 0 0;line-height:var(--line-height-relaxed);">The rule applies to badges encoding status. Used as a neutral accent there is no second meaning for a redundant channel to encode.</p>
      </div>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
      <candor-badge variant="primary" size="sm">Small</candor-badge>
      <candor-badge variant="primary" size="md">Medium</candor-badge>
    </div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin-top:1rem;">
      <candor-badge variant="error" size="sm">Small</candor-badge>
      <candor-badge variant="error" size="md">Medium</candor-badge>
    </div>
  `,
};

export const OrdinalSeverity: Story = {
  name: 'Pattern: Ordinal Severity Scale',
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:560px;padding:var(--spacing-md);">
      <div style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);line-height:var(--line-height-relaxed);display:flex;flex-direction:column;gap:var(--spacing-xs);">
        <p style="margin:0;">Use the existing status token triplets to express ordered severity scales. The label is read as a semantic term — Atkinson bold ensures it is legible at small sizes.</p>
        <p style="margin:0;"><strong style="color:var(--color-text-default);font-weight:var(--font-weight-semibold);">Mapping rule:</strong> low/minor/suggestion → success (green) · medium/moderate/recommendation → warning (amber) · high/critical/fundamental → error (red)</p>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Disagreement severity</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <candor-badge variant="success">Minor</candor-badge>
          <candor-badge variant="warning">Moderate</candor-badge>
          <candor-badge variant="error">Fundamental</candor-badge>
        </div>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Security finding severity</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <candor-badge variant="success">Low</candor-badge>
          <candor-badge variant="warning">Medium</candor-badge>
          <candor-badge variant="error">High</candor-badge>
          <candor-badge variant="error">Critical</candor-badge>
        </div>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Audit finding type</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <candor-badge variant="success">Suggestion</candor-badge>
          <candor-badge variant="warning">Recommendation</candor-badge>
          <candor-badge variant="error">Requirement</candor-badge>
        </div>
      </div>
    </div>
  `,
};

export const InContext: Story = {
  render: () => html`
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
};
