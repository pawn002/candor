import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Combobox',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    hint: { control: 'text' },
  },
  args: {
    label: 'Country',
    placeholder: 'Search countries…',
    disabled: false,
    required: false,
    error: '',
    hint: '',
  },
  render: (args) => ({
    template: `<candor-combobox
      id="demo-combobox"
      label="${args['label']}"
      placeholder="${args['placeholder']}"
      ${args['disabled'] ? 'disabled' : ''}
      ${args['required'] ? 'required' : ''}
      error="${args['error'] || ''}"
      hint="${args['hint'] || ''}"
    ></candor-combobox>
    <script>
      document.getElementById('demo-combobox').options = [
        { value: 'us', label: 'United States' },
        { value: 'gb', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
        { value: 'jp', label: 'Japan' },
        { value: 'br', label: 'Brazil' },
        { value: 'in', label: 'India' },
        { value: 'ng', label: 'Nigeria' },
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Please select a country.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
