import type { Meta, StoryObj } from '@storybook/angular';
import { SelectComponent } from './select.component';

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical', disabled: true },
];

const meta: Meta<SelectComponent> = {
  title: 'Angular Components/Form/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Dropdown for selecting one option from a list. Wraps a native \`<select>\` element — keyboard
navigation, mobile pickers, and browser autofill work out of the box.

**Select vs. Combobox:** Use \`Select\` for short, stable lists (5–15 items) where the user
picks from known options. Use \`Combobox\` when the list is long, dynamic, or searchable.

Accepts an array of \`{ value, label }\` option objects. Pass an empty \`placeholder\` string
to show a "choose one" prompt as the first option (not pre-selected).
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    placeholder: { control: 'text', description: 'Placeholder shown when no value is selected' },
    hint: { control: 'text', description: 'Helper text below the field' },
    error: { control: 'text', description: 'Error message (replaces hint)' },
    required: { control: 'boolean', description: 'Required field' },
    disabled: { control: 'boolean', description: 'Disabled state' },
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRIES,
    hint: 'Select your country of residence',
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRIES,
    error: 'Please select a country',
  },
};

export const Required: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRIES,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: COUNTRIES,
    value: 'gb',
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Priority',
    placeholder: 'Select priority',
    options: PRIORITY_OPTIONS,
    hint: 'Critical is currently unavailable',
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: 'Select an option',
    options: COUNTRIES,
  },
};

export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
        <app-select
          label="Default"
          placeholder="Select a country"
          [options]="countries"
          hint="Select your country of residence"
        ></app-select>
        <app-select
          label="With error"
          placeholder="Select a country"
          [options]="countries"
          error="Please select a country"
        ></app-select>
        <app-select
          label="Required"
          placeholder="Select a country"
          [options]="countries"
          [required]="true"
        ></app-select>
        <app-select
          label="Disabled"
          [options]="countries"
          value="gb"
          [disabled]="true"
        ></app-select>
      </div>
    `,
    props: { countries: COUNTRIES },
  }),
};
