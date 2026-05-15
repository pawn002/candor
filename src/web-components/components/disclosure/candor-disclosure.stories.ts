import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Disclosure',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
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
            <label style="display:flex;gap:0.5rem;align-items:center;font-size:var(--font-size-sm);font-family:var(--font-family-accessible);letter-spacing:0.02em;"><input type="checkbox" checked> Active</label>
            <label style="display:flex;gap:0.5rem;align-items:center;font-size:var(--font-size-sm);font-family:var(--font-family-accessible);letter-spacing:0.02em;"><input type="checkbox"> Inactive</label>
            <label style="display:flex;gap:0.5rem;align-items:center;font-size:var(--font-size-sm);font-family:var(--font-family-accessible);letter-spacing:0.02em;"><input type="checkbox"> Pending</label>
          </div>
        </candor-disclosure>
        <candor-disclosure label="Filter by role">
          <div style="display:flex;flex-direction:column;gap:0.5rem;padding-bottom:0.25rem;">
            <label style="display:flex;gap:0.5rem;align-items:center;font-size:var(--font-size-sm);font-family:var(--font-family-accessible);letter-spacing:0.02em;"><input type="checkbox" checked> Admin</label>
            <label style="display:flex;gap:0.5rem;align-items:center;font-size:var(--font-size-sm);font-family:var(--font-family-accessible);letter-spacing:0.02em;"><input type="checkbox" checked> Member</label>
            <label style="display:flex;gap:0.5rem;align-items:center;font-size:var(--font-size-sm);font-family:var(--font-family-accessible);letter-spacing:0.02em;"><input type="checkbox"> Viewer</label>
          </div>
        </candor-disclosure>
      </div>
    `,
  }),
};
