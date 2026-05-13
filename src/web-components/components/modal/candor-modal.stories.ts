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
      <button onclick="document.getElementById('demo-modal').open = true">Open modal</button>
      <candor-modal id="demo-modal" heading="${args['heading']}" size="${args['size']}">
        <p style="margin:0">Are you sure you want to proceed? This action cannot be undone.</p>
        <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <button onclick="document.getElementById('demo-modal').open = false">Cancel</button>
          <button onclick="document.getElementById('demo-modal').open = false">Confirm</button>
        </div>
      </candor-modal>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
