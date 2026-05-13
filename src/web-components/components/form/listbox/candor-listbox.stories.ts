import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Listbox',
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
    label: 'Preferred language',
    placeholder: 'Select a language',
    disabled: false,
    required: false,
    error: '',
    hint: 'Used for UI and documentation.',
  },
  render: (args) => ({
    template: `<candor-listbox
      id="demo-listbox"
      label="${args['label']}"
      placeholder="${args['placeholder']}"
      ${args['disabled'] ? 'disabled' : ''}
      ${args['required'] ? 'required' : ''}
      error="${args['error'] || ''}"
      hint="${args['hint'] || ''}"
    ></candor-listbox>
    <script>
      document.getElementById('demo-listbox').options = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'es', label: 'Spanish' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'ja', label: 'Japanese', disabled: true },
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Please select a language.', hint: '' },
};

export const Disabled: Story = {
  args: { disabled: true, hint: '' },
};
