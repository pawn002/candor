import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Form/Listbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-listbox>\` — custom select alternative using \`role="listbox"\` + \`role="option"\`.
Use when native \`<select>\` styling is insufficient — custom option rendering, visual
coherence with other Candor form components, or complex option layouts.

**Listbox vs. native Select**

| Use | When |
|---|---|
| \`candor-select\` | Simple option lists, forms requiring maximum AT compatibility, mobile contexts where the OS native picker is preferable |
| \`candor-listbox\` | Long option lists needing visual coherence, when you need the checkmark indicator, or when the OS picker feel is unwanted |

**Keyboard:** ArrowDown/Up navigate options; Home/End jump to first/last; Enter or Space
selects; Escape closes; Tab closes without selecting.

Form-associated (\`ElementInternals\`): the selected value participates in form submission.
Emits a \`change\` CustomEvent.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Field label' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Placeholder shown when no value is selected' },
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text below the field' },
    error: { control: 'text', type: { name: 'string' }, description: 'Error message (replaces hint)' },
    required: { control: 'boolean', type: { name: 'boolean' }, description: 'Required field' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
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
