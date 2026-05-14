import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Breadcrumb',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-breadcrumb items='[{"label":"Home","href":"#"},{"label":"Settings","href":"#"},{"label":"Account"}]'></candor-breadcrumb>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
