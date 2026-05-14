import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Toolbar',
  tags: ['autodocs'],
  render: () => ({
    template: `
      <candor-toolbar aria-label="Text formatting">
        <candor-button variant="ghost" size="small">Bold</candor-button>
        <candor-button variant="ghost" size="small">Italic</candor-button>
        <candor-button variant="ghost" size="small">Underline</candor-button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <candor-button variant="ghost" size="small">Align left</candor-button>
        <candor-button variant="ghost" size="small">Center</candor-button>
        <candor-button variant="ghost" size="small">Align right</candor-button>
      </candor-toolbar>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
