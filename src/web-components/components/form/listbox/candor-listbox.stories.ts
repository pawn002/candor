import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const LANGUAGES_JSON = JSON.stringify([
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese', disabled: true },
]);

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

**Which picker to use**

| Component | When |
|---|---|
| \`candor-select\` | Simple lists (≤ ~15 options), forms requiring maximum AT compatibility, mobile contexts where the OS native picker is preferable |
| \`candor-listbox\` | Moderate lists (≤ ~15 options) needing visual coherence or the checkmark indicator; options must be scannable without scrolling |
| \`candor-combobox\` | Large lists (16+ options) where users must search rather than scan — filter-as-you-type makes the list tractable |

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
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text above the trigger (below the label); remains visible alongside error' },
    error: { control: 'text', type: { name: 'string' }, description: 'Validation error message shown below the trigger; displayed alongside hint when both are set' },
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
  render: (args) => html`<candor-listbox
    label="${args['label']}"
    placeholder="${args['placeholder']}"
    ${args['disabled'] ? 'disabled' : ''}
    ${args['required'] ? 'required' : ''}
    error="${args['error'] || ''}"
    hint="${args['hint'] || ''}"
    options='${LANGUAGES_JSON}'
  ></candor-listbox>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithPreselectedValue: Story = {
  render: () => html`<candor-listbox
    label="Country"
    options='${COUNTRIES_JSON}'
    value="jp"
  ></candor-listbox>`,
};

export const WithDisabledOptions: Story = {
  render: () => html`<candor-listbox
    label="Role"
    hint="Owner role cannot be assigned after project creation."
    options='${ROLES_JSON}'
  ></candor-listbox>`,
};

export const WithHint: Story = {
  render: () => html`<candor-listbox
    label="Country"
    hint="Used to determine local content and date format."
    placeholder="Select a country"
    options='${COUNTRIES_JSON}'
  ></candor-listbox>`,
};

export const LongList: Story = {
  name: 'Long list (scroll)',
  parameters: {
    docs: {
      description: {
        story: '12-item list (all 12 months) shown at its scrollable limit. This is the practical ceiling for ' +
          'a listbox — the complete, bounded set fits without user search. ' +
          'For lists of 16+ options, or any list that is a subset of a larger dataset (e.g. countries), ' +
          'use `<candor-combobox>` with filter-as-you-type instead.',
      },
    },
  },
  render: () => html`<div style="max-width:320px;"><candor-listbox
    label="Birth month"
    placeholder="Select a month"
    options='${JSON.stringify([
      { value: '01', label: 'January' }, { value: '02', label: 'February' },
      { value: '03', label: 'March' }, { value: '04', label: 'April' },
      { value: '05', label: 'May' }, { value: '06', label: 'June' },
      { value: '07', label: 'July' }, { value: '08', label: 'August' },
      { value: '09', label: 'September' }, { value: '10', label: 'October' },
      { value: '11', label: 'November' }, { value: '12', label: 'December' },
    ])}'
  ></candor-listbox></div>`,
};

export const NoLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When no visible label is present, set `aria-label` on the host element. ' +
          'The component strips it from the host and forwards it to the inner trigger button, ' +
          'preventing the host from being named twice in the accessibility tree.',
      },
    },
  },
  render: () => html`<candor-listbox
    aria-label="Filter by role"
    placeholder="Filter by role"
    options='${ROLES_JSON}'
  ></candor-listbox>`,
};

export const WithError: Story = {
  args: { error: 'Please select a language.', hint: '' },
};

export const Disabled: Story = {
  args: { disabled: true, hint: '' },
};
