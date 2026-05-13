import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Menu',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-menu id="demo-menu" label="Actions"></candor-menu>
    <script>
      document.getElementById('demo-menu').entries = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        'separator',
        { label: 'Share' },
        'separator',
        { label: 'Delete', disabled: false }
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
