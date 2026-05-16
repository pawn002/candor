import type { Meta, StoryObj } from '@storybook/angular';

const COUNTRY_OPTIONS = JSON.stringify([
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]);

const meta: Meta = {
  title: 'Web Components/Form/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-select>\` — dropdown for selecting one option from a list. Wraps a native
\`<select>\` element — keyboard navigation, mobile pickers, and browser autofill work out of
the box.

**Select vs. Combobox:** Use \`Select\` for short, stable lists (5–15 items) where the user
picks from known options. Use \`Combobox\` when the list is long, dynamic, or searchable.

Accepts an array of \`{ value, label }\` option objects via the \`options\` JS property (or
JSON-encoded as an attribute in static markup). Pass a \`placeholder\` string to show a
"choose one" prompt as the first option (not pre-selected).

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
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" hint="Select your country of residence" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" error="Please select a country" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const Required: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" required options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<candor-select label="Country" value="us" disabled options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const WithDisabledOption: Story = {
  render: () => ({
    template: `<candor-select label="Priority" placeholder="Select priority" hint="Critical is currently unavailable" options='[{"value":"low","label":"Low"},{"value":"medium","label":"Medium"},{"value":"high","label":"High"},{"value":"critical","label":"Critical","disabled":true}]'></candor-select>`,
  }),
};

export const NoLabel: Story = {
  render: () => ({
    template: `<candor-select placeholder="Select an option" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:420px;">
        <candor-select label="Default" placeholder="Select a country" hint="Select your country of residence" options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="With error" placeholder="Select a country" error="Please select a country" options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="Required" placeholder="Select a country" required options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="Disabled" value="us" disabled options='${COUNTRY_OPTIONS}'></candor-select>
      </div>
    `,
  }),
};
