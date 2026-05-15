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

const COUNTRIES_JSON = JSON.stringify([
  { value: 'au', label: 'Australia' }, { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' }, { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' }, { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' }, { value: 'mx', label: 'Mexico' },
  { value: 'nl', label: 'Netherlands' }, { value: 'sg', label: 'Singapore' },
  { value: 'gb', label: 'United Kingdom' }, { value: 'us', label: 'United States' },
]);

const TIMEZONES_JSON = JSON.stringify([
  { value: 'UTC-12', label: 'UTC−12:00 — Baker Island' },
  { value: 'UTC-8', label: 'UTC−08:00 — Pacific Time (US)' },
  { value: 'UTC-7', label: 'UTC−07:00 — Mountain Time (US)' },
  { value: 'UTC-6', label: 'UTC−06:00 — Central Time (US)' },
  { value: 'UTC-5', label: 'UTC−05:00 — Eastern Time (US)' },
  { value: 'UTC+0', label: 'UTC±00:00 — London, Dublin' },
  { value: 'UTC+1', label: 'UTC+01:00 — Berlin, Paris, Amsterdam' },
  { value: 'UTC+2', label: 'UTC+02:00 — Cairo, Helsinki, Kiev' },
  { value: 'UTC+3', label: 'UTC+03:00 — Moscow, Istanbul' },
  { value: 'UTC+5.5', label: 'UTC+05:30 — Mumbai, New Delhi' },
  { value: 'UTC+8', label: 'UTC+08:00 — Beijing, Singapore, Perth' },
  { value: 'UTC+9', label: 'UTC+09:00 — Tokyo, Seoul' },
  { value: 'UTC+10', label: 'UTC+10:00 — Sydney, Brisbane' },
  { value: 'UTC+12', label: 'UTC+12:00 — Auckland, Fiji' },
]);

export const Default: Story = {};

export const WithPreselectedValue: Story = {
  render: () => ({
    template: `<candor-combobox id="cb-presel" label="Country"></candor-combobox>
    <script>
      const el = document.getElementById('cb-presel');
      el.options = ${COUNTRIES_JSON};
      el.value = 'jp';
    </script>`,
  }),
};

export const WithHint: Story = {
  render: () => ({
    template: `<candor-combobox id="cb-hint" label="Timezone" hint="Used for scheduling notifications and meeting times." placeholder="Search timezones…"></candor-combobox>
    <script>
      document.getElementById('cb-hint').options = ${TIMEZONES_JSON};
    </script>`,
  }),
};

export const LongLabels: Story = {
  name: 'Long labels (timezone search)',
  render: () => ({
    template: `<candor-combobox id="cb-tz" label="Timezone" placeholder="Search timezones…"></candor-combobox>
    <script>
      document.getElementById('cb-tz').options = ${TIMEZONES_JSON};
    </script>`,
  }),
};

export const NoLabel: Story = {
  render: () => ({
    template: `<candor-combobox id="cb-nolabel" placeholder="Search countries…"></candor-combobox>
    <script>
      document.getElementById('cb-nolabel').options = ${COUNTRIES_JSON};
    </script>`,
  }),
};

export const WithError: Story = {
  args: { error: 'Please select a country.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
