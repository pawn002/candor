import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Tooltip',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  args: { text: 'Helpful information', position: 'top' },
  render: (args) => ({
    template: `
      <div style="padding:4rem;display:flex;justify-content:center;">
        <candor-tooltip text="${args['text']}" position="${args['position']}">
          <candor-button variant="secondary">Hover or focus me</candor-button>
        </candor-tooltip>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div style="padding:4rem;display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;">
        <candor-tooltip text="Top tooltip" position="top"><candor-button variant="secondary">Top</candor-button></candor-tooltip>
        <candor-tooltip text="Bottom tooltip" position="bottom"><candor-button variant="secondary">Bottom</candor-button></candor-tooltip>
        <candor-tooltip text="Left tooltip" position="left"><candor-button variant="secondary">Left</candor-button></candor-tooltip>
        <candor-tooltip text="Right tooltip" position="right"><candor-button variant="secondary">Right</candor-button></candor-tooltip>
      </div>
    `,
  }),
};
