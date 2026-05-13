import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Button',
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
