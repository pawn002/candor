import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Navigation',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-navigation id="nav1" brand="Candor"></candor-navigation>
    <script>
      document.getElementById('nav1').items = [
        { label: 'Home', href: '#', active: true },
        { label: 'Components', href: '#' },
        { label: 'Docs', href: '#' },
        { label: 'Inbox', href: '#', badge: '5', badgeLabel: '5 unread' }
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Inverse: Story = {
  render: () => ({
    template: `<candor-navigation id="nav2" brand="Candor" theme="inverse"></candor-navigation>
    <script>
      document.getElementById('nav2').items = [
        { label: 'Home', href: '#', active: true },
        { label: 'Components', href: '#' },
        { label: 'Docs', href: '#' }
      ];
    </script>`,
  }),
};
