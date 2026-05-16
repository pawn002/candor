import type { Meta, StoryObj } from '@storybook/angular';
import { ComboboxComponent } from './combobox.component';

const COUNTRIES = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'cn', label: 'China' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
  { value: 'mx', label: 'Mexico' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'sg', label: 'Singapore' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'za', label: 'South Africa' },
];

const TIMEZONES = [
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
];

const meta: Meta<ComboboxComponent> = {
  title: 'Angular Components/Form/Combobox',
  component: ComboboxComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Text input + filterable listbox dropdown. Implements the APG \`list\` autocomplete pattern — the user can type freely and suggestions filter in real time.

**ARIA contract:** \`role="combobox"\` on the input with \`aria-expanded\` and \`aria-controls\` pointing to the listbox. DOM focus stays on the input at all times — \`aria-activedescendant\` on the input tracks the keyboard-highlighted option.

**Keyboard:** ArrowDown/Up navigate options; Enter selects the active option (or the only remaining match); Escape closes the dropdown (second Escape clears the input); Tab closes.

**Combobox vs. Listbox vs. native Select**

| Use | When |
|---|---|
| \`app-select\` | Short lists (≤10), maximum AT compatibility, mobile-first |
| \`app-listbox\` | Medium lists, click-to-select without typing, full visual control |
| \`app-combobox\` | Long lists, user knows part of the name, search/autocomplete UX |

Implements \`ControlValueAccessor\` — works with Angular template-driven and reactive forms.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ComboboxComponent>;

export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Search countries…',
    options: COUNTRIES,
  },
};

export const WithPreselectedValue: Story = {
  args: {
    label: 'Country',
    options: COUNTRIES,
    value: 'jp',
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    options: COUNTRIES,
    error: 'Please select a country.',
    required: true,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Timezone',
    hint: 'Used for scheduling notifications and meeting times.',
    placeholder: 'Search timezones…',
    options: TIMEZONES,
  },
};

export const LongLabels: Story = {
  name: 'Long labels (timezone search)',
  args: {
    label: 'Timezone',
    placeholder: 'Search timezones…',
    options: TIMEZONES,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: 'Search countries…',
    options: COUNTRIES,
  },
};
