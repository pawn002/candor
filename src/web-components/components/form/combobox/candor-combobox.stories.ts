import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { openCombobox } from '../../../story-utils';

const DEFAULT_OPTIONS_JSON = JSON.stringify([
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
]);

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

const meta: Meta = {
  title: 'Components/Form/Combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-combobox>\` — text input + filterable listbox dropdown. Implements the APG \`list\`
autocomplete pattern — the user can type freely and suggestions filter in real time.

**ARIA contract:** \`role="combobox"\` on the input with \`aria-expanded\` and
\`aria-controls\` pointing to the listbox. DOM focus stays on the input at all times —
\`aria-activedescendant\` on the input tracks the keyboard-highlighted option.

**Keyboard:** ArrowDown/Up navigate options; Enter selects the active option; Escape closes
the dropdown (second Escape clears the value); Tab closes the dropdown.

**Combobox vs. Listbox vs. native Select**

| Use | When |
|---|---|
| \`candor-select\` | Short lists (≤10), maximum AT compatibility, mobile-first |
| \`candor-listbox\` | Medium lists, click-to-select without typing, full visual control |
| \`candor-combobox\` | Long lists, user knows part of the name, search/autocomplete UX |

Form-associated (\`ElementInternals\`): the selected option's value participates in form
submission. Emits a \`change\` CustomEvent on selection.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Field label' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Placeholder shown when no value is selected' },
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text above the input (below the label)' },
    error: { control: 'text', type: { name: 'string' }, description: 'Error message (replaces hint)' },
    required: { control: 'boolean', type: { name: 'boolean' }, description: 'Required field' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
  },
  args: {
    label: 'Country',
    placeholder: 'Search countries…',
    disabled: false,
    required: false,
    error: '',
    hint: '',
  },
  render: (args) => html`<candor-combobox
    label="${args['label']}"
    placeholder="${args['placeholder']}"
    ?disabled=${args['disabled']}
    ?required=${args['required']}
    error="${args['error'] || ''}"
    hint="${args['hint'] || ''}"
    options='${DEFAULT_OPTIONS_JSON}'
  ></candor-combobox>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

// Opened via a play function (focus input + ArrowDown) so Chromatic captures the
// dropdown. Excluded from the docs page (tags: !autodocs).
export const Open: Story = {
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, chromatic: { pauseAnimationAtEnd: true } },
  render: () => html`<candor-combobox label="Country" placeholder="Search…" options='${DEFAULT_OPTIONS_JSON}'></candor-combobox>`,
  play: openCombobox('candor-combobox'),
};

export const WithPreselectedValue: Story = {
  render: () => html`<candor-combobox
    label="Country"
    options='${COUNTRIES_JSON}'
    value="jp"
  ></candor-combobox>`,
};

export const WithHint: Story = {
  render: () => html`<candor-combobox
    label="Timezone"
    hint="Used for scheduling notifications and meeting times."
    placeholder="Search timezones…"
    options='${TIMEZONES_JSON}'
  ></candor-combobox>`,
};

export const LongLabels: Story = {
  name: 'Long labels (timezone search)',
  render: () => html`<candor-combobox
    label="Timezone"
    placeholder="Search timezones…"
    options='${TIMEZONES_JSON}'
  ></candor-combobox>`,
};

export const NoLabel: Story = {
  parameters: {
    docs: { description: { story: 'When no visible label is provided, supply `aria-label` on the host — the component forwards it to the inner input and strips it from the host to avoid double-naming in the AT tree.' } }
  },
  render: () => html`<candor-combobox
    aria-label="Country"
    placeholder="Search countries…"
    options='${COUNTRIES_JSON}'
  ></candor-combobox>`,
};

export const WithError: Story = {
  args: { error: 'Please select a country.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
