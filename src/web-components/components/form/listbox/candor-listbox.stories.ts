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

const COUNTRIES_JSON = JSON.stringify([
  { value: 'au', label: 'Australia' }, { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' }, { value: 'cn', label: 'China' },
  { value: 'de', label: 'Germany' }, { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' }, { value: 'jp', label: 'Japan' },
  { value: 'mx', label: 'Mexico' }, { value: 'nl', label: 'Netherlands' },
  { value: 'gb', label: 'United Kingdom' }, { value: 'us', label: 'United States' },
]);

const ROLES_JSON = JSON.stringify([
  { value: 'admin', label: 'Admin' }, { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' }, { value: 'owner', label: 'Owner', disabled: true },
]);

export const Default: Story = {};

export const WithPreselectedValue: Story = {
  render: () => ({
    template: `<candor-listbox id="lb-presel" label="Country"></candor-listbox>
    <script>
      const el = document.getElementById('lb-presel');
      el.options = ${COUNTRIES_JSON};
      el.value = 'jp';
    </script>`,
  }),
};

export const WithDisabledOptions: Story = {
  render: () => ({
    template: `<candor-listbox id="lb-roles" label="Role" hint="Owner role cannot be assigned after project creation."></candor-listbox>
    <script>
      document.getElementById('lb-roles').options = ${ROLES_JSON};
    </script>`,
  }),
};

export const WithHint: Story = {
  render: () => ({
    template: `<candor-listbox id="lb-hint" label="Country" hint="Used to determine local content and date format." placeholder="Select a country"></candor-listbox>
    <script>
      document.getElementById('lb-hint').options = ${COUNTRIES_JSON};
    </script>`,
  }),
};

export const LongList: Story = {
  name: 'Long list (scroll)',
  render: () => ({
    template: `<div style="max-width:320px;"><candor-listbox id="lb-long" label="Country" placeholder="Select a country"></candor-listbox></div>
    <script>
      document.getElementById('lb-long').options = ${COUNTRIES_JSON};
    </script>`,
  }),
};

export const NoLabel: Story = {
  render: () => ({
    template: `<candor-listbox id="lb-nolabel" placeholder="Filter by role"></candor-listbox>
    <script>
      document.getElementById('lb-nolabel').options = ${ROLES_JSON};
    </script>`,
  }),
};

export const WithError: Story = {
  args: { error: 'Please select a language.', hint: '' },
};

export const Disabled: Story = {
  args: { disabled: true, hint: '' },
};
