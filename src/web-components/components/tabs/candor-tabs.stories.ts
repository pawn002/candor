import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Tabs',
  tags: ['autodocs'],
  render: () => ({
    template: `<candor-tabs id="demo-tabs" aria-label="Product details">
      <candor-tab-panel panel-id="overview" active>
        <p style="margin:0">Overview content — rendered when the Overview tab is selected.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="specs">
        <p style="margin:0">Specifications content.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="reviews">
        <p style="margin:0">Customer reviews.</p>
      </candor-tab-panel>
    </candor-tabs>
    <script>
      const tabs = document.getElementById('demo-tabs');
      tabs.tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'specs', label: 'Specifications' },
        { id: 'reviews', label: 'Reviews' }
      ];
      tabs.activeId = 'overview';
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
