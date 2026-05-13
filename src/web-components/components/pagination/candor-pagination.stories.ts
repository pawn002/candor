import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Pagination',
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
  },
  args: { currentPage: 3, totalPages: 10 },
  render: (args) => ({
    template: `<candor-pagination current-page="${args['currentPage']}" total-pages="${args['totalPages']}"></candor-pagination>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const FewPages: Story = {
  render: () => ({
    template: `<candor-pagination current-page="2" total-pages="5"></candor-pagination>`,
  }),
};
