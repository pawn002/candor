import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Select',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-select id="sel1" label="Country" placeholder="Choose a country…" hint="We use this to apply the correct tax rate."></candor-select>
    <script>
      document.getElementById('sel1').options = [
        { value: 'gb', label: 'United Kingdom' },
        { value: 'us', label: 'United States' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
