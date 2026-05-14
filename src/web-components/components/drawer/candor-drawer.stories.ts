import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Drawer',
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    position: { control: 'select', options: ['left', 'right', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
  },
  args: { heading: 'Settings', position: 'right', size: 'md' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('demo-drawer').open = true">Open drawer</candor-button>
      <candor-drawer id="demo-drawer" heading="${args['heading']}" position="${args['position']}" size="${args['size']}">
        <p style="margin:0">Drawer content goes here.</p>
      </candor-drawer>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
