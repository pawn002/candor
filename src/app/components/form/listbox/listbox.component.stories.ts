import type { Meta, StoryObj } from '@storybook/angular';
import { ListboxComponent } from './listbox.component';

const COUNTRIES: { value: string; label: string }[] = [
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

const ROLES: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'owner', label: 'Owner', disabled: true },
];

const meta: Meta<ListboxComponent> = {
  title: 'Angular Components/Form/Listbox',
  component: ListboxComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Custom select alternative using \`role="listbox"\` + \`role="option"\`. Use when native \`<select>\` styling is insufficient — custom option rendering, visual coherence with other Candor form components, or complex option layouts.

**Listbox vs. native Select**

| Use | When |
|---|---|
| \`app-select\` | Simple option lists, forms requiring maximum AT compatibility, mobile contexts where the OS native picker is preferable |
| \`app-listbox\` | Long option lists needing visual coherence, when you need the checkmark indicator, or when the OS picker feel is unwanted |

**Keyboard contract:** ArrowDown/Up navigate options; Home/End jump to first/last; Enter or Space selects; Escape closes; Tab closes without selecting; typing characters jumps to the first matching option (typeahead, 500ms reset).

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
type Story = StoryObj<ListboxComponent>;

export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
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

export const WithDisabledOptions: Story = {
  args: {
    label: 'Role',
    hint: 'Owner role cannot be assigned after project creation.',
    options: ROLES,
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
    label: 'Country',
    hint: 'Used to determine local content and date format.',
    options: COUNTRIES,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: COUNTRIES,
    value: 'ca',
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 320px;"><app-listbox [label]="label" [options]="options" [value]="value" [disabled]="true"></app-listbox></div>`,
  }),
};

export const LongList: Story = {
  name: 'Long list (scroll)',
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRIES,
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 320px;"><app-listbox [label]="label" [placeholder]="placeholder" [options]="options"></app-listbox></div>`,
  }),
};

export const NoLabel: Story = {
  args: {
    placeholder: 'Filter by role',
    options: ROLES,
  },
};
