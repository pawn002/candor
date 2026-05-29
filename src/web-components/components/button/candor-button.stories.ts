import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<candor-button>` — five variants covering the full hierarchy of actions. Emits a `clicked` CustomEvent.',
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
  render: (args) => ({
    template: `<candor-button variant="${args['variant']}" size="${args['size']}" type="${args['type']}" ${args['disabled'] ? 'disabled' : ''}>Save changes</candor-button>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary', size: 'medium' }, render: () => ({ template: `<candor-button variant="secondary" size="medium">Export</candor-button>` }) };
export const Tertiary: Story = { args: { variant: 'tertiary', size: 'medium' }, render: () => ({ template: `<candor-button variant="tertiary" size="medium">Learn more</candor-button>` }) };
export const Ghost: Story = { args: { variant: 'ghost', size: 'medium' }, render: () => ({ template: `<candor-button variant="ghost" size="medium">Cancel</candor-button>` }) };
export const Destructive: Story = { args: { variant: 'destructive', size: 'medium' }, render: () => ({ template: `<candor-button variant="destructive" size="medium">Delete</candor-button>` }) };

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
        <candor-button variant="primary">Save changes</candor-button>
        <candor-button variant="secondary">Export</candor-button>
        <candor-button variant="tertiary">Learn more</candor-button>
        <candor-button variant="ghost">Cancel</candor-button>
        <candor-button variant="destructive">Delete</candor-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
        <candor-button variant="primary" size="small">Small</candor-button>
        <candor-button variant="primary" size="medium">Medium</candor-button>
        <candor-button variant="primary" size="large">Large</candor-button>
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
        <candor-button variant="primary" disabled>Save changes</candor-button>
        <candor-button variant="secondary" disabled>Export</candor-button>
        <candor-button variant="tertiary" disabled>Learn more</candor-button>
        <candor-button variant="ghost" disabled>Cancel</candor-button>
        <candor-button variant="destructive" disabled>Delete</candor-button>
      </div>
    `,
  }),
};

export const DestructiveInContext: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <div>
          <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Paired with primary — typical confirm/cancel/delete layout</p>
          <div style="display:flex;gap:1rem;align-items:center;">
            <candor-button variant="primary">Save changes</candor-button>
            <candor-button variant="ghost">Cancel</candor-button>
            <candor-button variant="destructive">Delete</candor-button>
          </div>
        </div>
        <div>
          <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">With error state nearby — hue separation from hue=25 error</p>
          <p style="color:var(--color-status-error-text);font-family:var(--font-family-accessible);font-size:var(--font-size-sm);margin-bottom:var(--spacing-sm);">⚠ This action cannot be undone. 3 records will be permanently deleted.</p>
          <div style="display:flex;gap:1rem;">
            <candor-button variant="ghost">Cancel</candor-button>
            <candor-button variant="destructive">Delete permanently</candor-button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const FullMatrix: Story = {
  render: () => ({
    template: `
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
  }),
};
