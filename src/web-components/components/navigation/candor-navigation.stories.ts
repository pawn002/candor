import type { Meta, StoryObj } from '@storybook/angular';

const defaultItems = JSON.stringify([
  { label: 'Home', href: '#home', active: true },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]);

const meta: Meta = {
  title: 'Web Components/Navigation',
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    theme: { control: 'select', options: ['default', 'inverse'] },
    brand: { control: 'text' },
  },
  args: { orientation: 'horizontal', theme: 'default', brand: 'Candor' },
  render: (args) => ({
    template: `<candor-navigation brand="${args['brand']}" orientation="${args['orientation']}" theme="${args['theme']}" items='${defaultItems}'></candor-navigation>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const Inverse: Story = {
  args: { theme: 'inverse' },
};

export const WithBadges: Story = {
  render: () => ({
    template: `<candor-navigation brand="Candor" items='[{"label":"Dashboard","href":"#dashboard","active":true},{"label":"Inbox","href":"#inbox","badge":"12","badgeLabel":"12 unread"},{"label":"Tasks","href":"#tasks","badge":"3","badgeLabel":"3 pending"},{"label":"Settings","href":"#settings"}]'></candor-navigation>`,
  }),
};
