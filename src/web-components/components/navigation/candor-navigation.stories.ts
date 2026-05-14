import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Navigation',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-navigation brand="Candor" items='[{"label":"Home","href":"#","active":true},{"label":"Components","href":"#"},{"label":"Docs","href":"#"},{"label":"Inbox","href":"#","badge":"5","badgeLabel":"5 unread"}]'></candor-navigation>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Inverse: Story = {
  render: () => ({
    template: `<candor-navigation brand="Candor" theme="inverse" items='[{"label":"Home","href":"#","active":true},{"label":"Components","href":"#"},{"label":"Docs","href":"#"}]'></candor-navigation>`,
  }),
};
