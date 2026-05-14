import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Modal',
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { heading: 'Confirm action', size: 'md' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('demo-modal').open = true">Open modal</candor-button>
      <candor-modal id="demo-modal" heading="${args['heading']}" size="${args['size']}">
        <p style="margin:0">Are you sure you want to proceed? This action cannot be undone.</p>
        <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <candor-button variant="secondary" onclick="document.getElementById('demo-modal').open = false">Cancel</candor-button>
          <candor-button onclick="document.getElementById('demo-modal').open = false">Confirm</candor-button>
        </div>
      </candor-modal>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
