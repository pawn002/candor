import type { Meta, StoryObj } from '@storybook/angular';
import { DisclosureComponent } from './disclosure.component';

const meta: Meta<DisclosureComponent> = {
  title: 'Components/Disclosure',
  component: DisclosureComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Disclosure renders a single show/hide toggle following the [APG Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/). It is the right choice for a **contextual, standalone reveal** — one toggle that stands alone without coordinating with siblings.

**Disclosure vs. Accordion**

| Use | When |
|---|---|
| \`app-disclosure\` | A single, contextual reveal — an expandable filter section, a "read more" beneath a summary, an inline help tip. It stands alone. |
| \`app-accordion\` | Two or more parallel sections at the same heading level that form a group — a FAQ list, a settings panel. |

If you have several independent disclosures near each other and opening one should **not** close another, use multiple \`app-disclosure\` instances — not \`app-accordion\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Trigger button label',
    },
    open: {
      control: 'boolean',
      description: 'Open/closed state (two-way bindable via `[(open)]`)',
    },
  },
};

export default meta;
type Story = StoryObj<DisclosureComponent>;

export const Default: Story = {
  args: {
    label: 'What is Candor?',
    open: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-disclosure [label]="label" [(open)]="open">
        Candor is a humanist design system built for Angular. It uses OKLCH colors,
        variable fonts, and Atkinson Hyperlegible for accessible UI text.
      </app-disclosure>
    `,
  }),
};

export const OpenByDefault: Story = {
  args: {
    label: 'Terms and conditions',
    open: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-disclosure [label]="label" [(open)]="open">
        By continuing, you agree to our terms of service and privacy policy.
        You can update your preferences at any time from your account settings.
      </app-disclosure>
    `,
  }),
};

export const FAQ: Story = {
  name: 'Pattern: FAQ List',
  render: () => ({
    template: `
      <div style="max-width: 560px;">
        <app-disclosure label="How does billing work?">
          You are billed monthly based on your plan tier. Upgrades take effect immediately
          and are prorated. Downgrades take effect at the next billing cycle.
        </app-disclosure>
        <app-disclosure label="Can I cancel at any time?">
          Yes. Cancel from your account settings at any time. Your access continues
          until the end of the current billing period.
        </app-disclosure>
        <app-disclosure label="What happens to my data if I cancel?">
          Your data is retained for 30 days after cancellation, after which it is
          permanently deleted. You can export your data at any time before deletion.
        </app-disclosure>
      </div>
    `,
  }),
};

export const ExpandableFilter: Story = {
  name: 'Pattern: Expandable Filter Section',
  render: () => ({
    template: `
      <div style="max-width: 280px;">
        <app-disclosure label="Filter by status" [open]="true">
          <div style="display: flex; flex-direction: column; gap: 0.5rem; padding-bottom: 0.25rem;">
            <label style="display: flex; gap: 0.5rem; align-items: center; font-size: var(--font-size-sm); font-family: var(--font-family-accessible); letter-spacing: 0.02em;">
              <input type="checkbox" checked> Active
            </label>
            <label style="display: flex; gap: 0.5rem; align-items: center; font-size: var(--font-size-sm); font-family: var(--font-family-accessible); letter-spacing: 0.02em;">
              <input type="checkbox"> Inactive
            </label>
            <label style="display: flex; gap: 0.5rem; align-items: center; font-size: var(--font-size-sm); font-family: var(--font-family-accessible); letter-spacing: 0.02em;">
              <input type="checkbox"> Pending
            </label>
          </div>
        </app-disclosure>
        <app-disclosure label="Filter by role">
          <div style="display: flex; flex-direction: column; gap: 0.5rem; padding-bottom: 0.25rem;">
            <label style="display: flex; gap: 0.5rem; align-items: center; font-size: var(--font-size-sm); font-family: var(--font-family-accessible); letter-spacing: 0.02em;">
              <input type="checkbox" checked> Admin
            </label>
            <label style="display: flex; gap: 0.5rem; align-items: center; font-size: var(--font-size-sm); font-family: var(--font-family-accessible); letter-spacing: 0.02em;">
              <input type="checkbox" checked> Member
            </label>
            <label style="display: flex; gap: 0.5rem; align-items: center; font-size: var(--font-size-sm); font-family: var(--font-family-accessible); letter-spacing: 0.02em;">
              <input type="checkbox"> Viewer
            </label>
          </div>
        </app-disclosure>
      </div>
    `,
  }),
};
