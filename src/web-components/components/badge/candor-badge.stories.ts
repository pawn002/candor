import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<candor-badge>` — status label using Atkinson Hyperlegible with semantic color variants.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'error', 'warning'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { variant: 'default', size: 'md' },
  render: (args) => ({
    template: `<candor-badge variant="${args['variant']}" size="${args['size']}">Label</candor-badge>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
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
      <div style="display:flex;gap:0.5rem;align-items:center;">
        <candor-badge variant="primary" size="sm">Small</candor-badge>
        <candor-badge variant="primary" size="md">Medium</candor-badge>
      </div>
    `,
  }),
};
