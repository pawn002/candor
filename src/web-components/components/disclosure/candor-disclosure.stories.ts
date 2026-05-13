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
