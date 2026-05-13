import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Progress',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['bar', 'spinner'] },
    value: { control: 'number' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { type: 'bar', value: 65, indeterminate: false, label: 'Loading data', size: 'md' },
  render: (args) => ({
    template: `<candor-progress type="${args['type']}" value="${args['value']}" label="${args['label']}" size="${args['size']}" ${args['indeterminate'] ? 'indeterminate' : ''}></candor-progress>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Indeterminate: Story = {
  render: () => ({
    template: `<candor-progress indeterminate label="Processing…"></candor-progress>`,
  }),
};

export const Spinners: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;align-items:center;">
        <candor-progress type="spinner" size="sm" label="Loading"></candor-progress>
        <candor-progress type="spinner" size="md" label="Loading"></candor-progress>
        <candor-progress type="spinner" size="lg" label="Loading"></candor-progress>
      </div>
    `,
  }),
};
