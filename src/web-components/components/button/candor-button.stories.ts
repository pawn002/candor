import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`<candor-button>` — five variants covering the full hierarchy of actions. ' +
          'Listen for the standard DOM `click` event: the inner button\'s native click ' +
          'retargets to the host and reaches you unaided, so there is no Candor-specific ' +
          'event to learn. (A `disabled` button suppresses it natively.) The bespoke ' +
          '`clicked` event was removed in 5.0.0 — it only ever duplicated `click` (#201).',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'ghost', 'destructive'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
  args: { variant: 'primary', size: 'medium', disabled: false, type: 'button' },
  render: (args) => html`<candor-button variant="${args['variant']}" size="${args['size']}" type="${args['type']}" ?disabled=${args['disabled']}>Save changes</candor-button>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
      <candor-button variant="primary">Save changes</candor-button>
      <candor-button variant="secondary">Export</candor-button>
      <candor-button variant="tertiary">Learn more</candor-button>
      <candor-button variant="ghost">Cancel</candor-button>
      <candor-button variant="destructive">Delete</candor-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
      <candor-button variant="primary" size="small">Small</candor-button>
      <candor-button variant="primary" size="medium">Medium</candor-button>
      <candor-button variant="primary" size="large">Large</candor-button>
    </div>
  `,
};

export const DisabledStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Visual reference for the disabled treatment across variants. **In real usage, a disabled button whose label is the only cue to the unavailable action must be paired with an adjacent readable reason** — see **Disabled with reason**. The bare buttons here are a treatment showcase, not a usage template.',
      },
    },
  },
  render: () => html`
    <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
      <candor-button variant="primary" disabled>Save changes</candor-button>
      <candor-button variant="secondary" disabled>Export</candor-button>
      <candor-button variant="tertiary" disabled>Learn more</candor-button>
      <candor-button variant="ghost" disabled>Cancel</candor-button>
      <candor-button variant="destructive" disabled>Delete</candor-button>
    </div>
  `,
};

export const DisabledWithReason: Story = {
  name: 'Disabled with reason (required pattern)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A disabled label carries meaning ("Delete 3 records") that a low-vision user must still be able to read — but the dimmed label is intentionally below the contrast floor (WCAG 1.4.3 exempts inactive components). ' +
          "Candor's convention (#134): the dim label signals *unavailable*, and the **actionable** meaning is carried by a readable, enabled-contrast explanation **adjacent** to the control — here a `candor-accessible-text role_=\"annotation\"` that stays at full opacity. " +
          'Do **not** move the reason into a tooltip: native `disabled` buttons are removed from the tab order, so a focus- or hover-gated tooltip never reaches keyboard or screen-reader users. Adjacent text is encountered in document order by everyone.',
      },
    },
  },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);align-items:flex-start;max-width:36ch;">
      <candor-button variant="destructive" disabled>Delete 3 records</candor-button>
      <candor-accessible-text role_="annotation" style="display:block;">Deleting is unavailable until the export finishes.</candor-accessible-text>
    </div>
  `,
};

export const DestructiveInContext: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:560px;padding:var(--spacing-md);">
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Paired with primary</p>
        <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
          <candor-button variant="primary">Save changes</candor-button>
          <candor-button variant="ghost">Cancel</candor-button>
          <candor-button variant="destructive">Delete</candor-button>
        </div>
      </div>
      <hr style="border: none; border-top: var(--border-width-thin) solid var(--color-border-default); margin: 0; width: 100%;" />
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">With error state nearby</p>
        <p style="color:var(--color-status-error-text);font-family:var(--font-family-accessible);font-size:var(--font-size-sm);margin:0 0 var(--spacing-sm);">⚠ This action cannot be undone. 3 records will be permanently deleted.</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <candor-button variant="ghost">Cancel</candor-button>
          <candor-button variant="destructive">Delete permanently</candor-button>
        </div>
      </div>
    </div>
  `,
};

export const FullMatrix: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:2rem;">
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Primary</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <candor-button variant="primary" size="small">Small</candor-button>
          <candor-button variant="primary" size="medium">Medium</candor-button>
          <candor-button variant="primary" size="large">Large</candor-button>
          <candor-button variant="primary" disabled>Disabled</candor-button>
        </div>
      </div>
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Secondary</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <candor-button variant="secondary" size="small">Small</candor-button>
          <candor-button variant="secondary" size="medium">Medium</candor-button>
          <candor-button variant="secondary" size="large">Large</candor-button>
          <candor-button variant="secondary" disabled>Disabled</candor-button>
        </div>
      </div>
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Tertiary</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <candor-button variant="tertiary" size="small">Small</candor-button>
          <candor-button variant="tertiary" size="medium">Medium</candor-button>
          <candor-button variant="tertiary" size="large">Large</candor-button>
          <candor-button variant="tertiary" disabled>Disabled</candor-button>
        </div>
      </div>
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Ghost</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <candor-button variant="ghost" size="small">Small</candor-button>
          <candor-button variant="ghost" size="medium">Medium</candor-button>
          <candor-button variant="ghost" size="large">Large</candor-button>
          <candor-button variant="ghost" disabled>Disabled</candor-button>
        </div>
      </div>
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Destructive</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <candor-button variant="destructive" size="small">Small</candor-button>
          <candor-button variant="destructive" size="medium">Medium</candor-button>
          <candor-button variant="destructive" size="large">Large</candor-button>
          <candor-button variant="destructive" disabled>Disabled</candor-button>
        </div>
      </div>
    </div>
  `,
};

export const Overriding: Story = {
  name: 'Overriding styles (parts + custom properties)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two opt-in hooks restyle a button without forking. **Custom properties** (`--candor-button-{padding-x,padding-y,font-size,min-height,radius}`) are the blessed density knobs, each defaulting to the size token — here one button is made denser than `size="small"`. **`::part(button)`** is the escape hatch for arbitrary CSS the knobs do not cover (letter-spacing, text-transform).',
      },
    },
  },
  render: () => html`
    <style>
      .cta::part(button) { text-transform: uppercase; letter-spacing: 0.06em; }
    </style>
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
      <candor-button size="small">Default small</candor-button>
      <candor-button
        size="small"
        style="--candor-button-min-height:1.75rem;--candor-button-padding-y:0.25rem;--candor-button-padding-x:0.6rem;"
        >Denser via custom props</candor-button
      >
      <candor-button class="cta">::part restyle</candor-button>
    </div>
  `,
};
