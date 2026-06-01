import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Disclosure',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-disclosure>\` renders a single show/hide toggle following the
[APG Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/). It is the
right choice for a **contextual, standalone reveal** — one toggle that stands alone
without coordinating with siblings.

**Disclosure vs. Accordion**

| Use | When |
|---|---|
| \`candor-disclosure\` | A single, contextual reveal — an expandable filter section, a "read more" beneath a summary, an inline help tip. It stands alone. |
| \`candor-accordion-item\` | Two or more parallel sections at the same heading level that form a group — a FAQ list, a settings panel. |

If you have several independent disclosures near each other and opening one should **not**
close another, use multiple \`<candor-disclosure>\` instances — not a coordinated accordion.

Emits a \`toggle\` CustomEvent with \`{ detail: open }\` on each transition.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Trigger button label' },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Open/closed state' },
  },
  args: { label: 'Advanced options', open: false },
  render: (args) => ({
    template: `<candor-disclosure label="${args['label']}" ${args['open'] ? 'open' : ''}>
      <p style="margin:0;color:var(--color-text-default)">Hidden content revealed when expanded. Use for optional, secondary, or space-constrained information.</p>
    </candor-disclosure>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const OpenByDefault: Story = {
  args: { label: 'Filter options', open: true },
};

export const FAQ: Story = {
  name: 'Pattern: FAQ List',
  render: () => ({
    template: `
      <div style="max-width:560px;">
        <candor-disclosure label="How does billing work?">
          <p style="margin:0;color:var(--color-text-default)">You are billed monthly based on your plan tier. Upgrades take effect immediately and are prorated. Downgrades take effect at the next billing cycle.</p>
        </candor-disclosure>
        <candor-disclosure label="Can I cancel at any time?">
          <p style="margin:0;color:var(--color-text-default)">Yes. Cancel from your account settings at any time. Your access continues until the end of the current billing period.</p>
        </candor-disclosure>
        <candor-disclosure label="What happens to my data if I cancel?">
          <p style="margin:0;color:var(--color-text-default)">Your data is retained for 30 days after cancellation, after which it is permanently deleted. You can export your data at any time before deletion.</p>
        </candor-disclosure>
      </div>
    `,
  }),
};

export const ExpandableFilter: Story = {
  name: 'Pattern: Expandable Filter Section',
  render: () => ({
    template: `
      <div style="max-width:280px;">
        <candor-disclosure label="Filter by status" open>
          <div style="display:flex;flex-direction:column;gap:0.5rem;padding-bottom:0.25rem;">
            <candor-checkbox label="Active" checked></candor-checkbox>
            <candor-checkbox label="Inactive"></candor-checkbox>
            <candor-checkbox label="Pending"></candor-checkbox>
          </div>
        </candor-disclosure>
        <candor-disclosure label="Filter by role">
          <div style="display:flex;flex-direction:column;gap:0.5rem;padding-bottom:0.25rem;">
            <candor-checkbox label="Admin" checked></candor-checkbox>
            <candor-checkbox label="Member" checked></candor-checkbox>
            <candor-checkbox label="Viewer"></candor-checkbox>
          </div>
        </candor-disclosure>
      </div>
    `,
  }),
};
