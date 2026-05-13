import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Stat',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    unit: { control: 'text' },
    label: { control: 'text' },
    color: { control: 'select', options: ['default', 'success', 'warning', 'error', 'info'] },
  },
  args: { value: '1,284', unit: '', label: 'Monthly active users', color: 'default' },
  render: (args) => ({
    template: `<candor-stat value="${args['value']}" unit="${args['unit']}" label="${args['label']}" color="${args['color']}"></candor-stat>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:2rem;flex-wrap:wrap;justify-content:center;">
        <candor-stat value="98.7" unit="%" label="Uptime" color="success"></candor-stat>
        <candor-stat value="42" label="Pending" color="warning"></candor-stat>
        <candor-stat value="3" label="Failures" color="error"></candor-stat>
        <candor-stat value="1,284" label="Users" color="default"></candor-stat>
      </div>
    `,
  }),
};
