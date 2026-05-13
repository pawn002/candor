import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Slider',
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    value: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: { min: 0, max: 100, value: 40, disabled: false },
  render: (args) => ({
    template: `<candor-slider label="Volume" min="${args['min']}" max="${args['max']}" value="${args['value']}" ${args['disabled'] ? 'disabled' : ''}></candor-slider>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Percentage: Story = {
  render: () => ({
    template: `<candor-slider id="pct-slider" label="Opacity" min="0" max="1" step="0.01" value="0.7"></candor-slider>
    <script>
      const s = document.getElementById('pct-slider');
      s.valueTextFn = (v) => (v * 100).toFixed(0) + '%';
    </script>`,
  }),
};
