import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Breadcrumb',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-breadcrumb id="bc"></candor-breadcrumb>
    <script>
      document.getElementById('bc').items = [
        { label: 'Home', href: '#' },
        { label: 'Settings', href: '#' },
        { label: 'Account' }
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
