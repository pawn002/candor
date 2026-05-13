import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Toolbar',
  tags: ['autodocs'],
  render: () => ({
    template: `
      <candor-toolbar aria-label="Text formatting">
        <button>Bold</button>
        <button>Italic</button>
        <button>Underline</button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <button>Align left</button>
        <button>Center</button>
        <button>Align right</button>
      </candor-toolbar>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
