import type { Meta, StoryObj } from '@storybook/angular';
import { ChipComponent } from './chip.component';

const meta: Meta<ChipComponent> = {
  title: 'Components/Chip',
  component: ChipComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
    },
    label: { control: 'text' },
    selectable: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ChipComponent>;

export const Default: Story = {
  args: { label: 'Design', variant: 'default' },
};

export const Selectable: Story = {
  args: { label: 'Angular', variant: 'primary', selectable: true },
};

export const SelectableSelected: Story = {
  args: { label: 'TypeScript', variant: 'primary', selectable: true, selected: true },
};

export const Dismissible: Story = {
  args: { label: 'React', variant: 'default', dismissible: true },
};

export const Disabled: Story = {
  args: { label: 'Unavailable', variant: 'default', selectable: true, disabled: true },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
        <app-chip label="Default" variant="default"></app-chip>
        <app-chip label="Primary" variant="primary"></app-chip>
        <app-chip label="Secondary" variant="secondary"></app-chip>
        <app-chip label="Success" variant="success"></app-chip>
        <app-chip label="Warning" variant="warning"></app-chip>
        <app-chip label="Error" variant="error"></app-chip>
      </div>
    `,
  }),
};

export const FilterGroup: Story = {
  render: () => ({
    template: `
      <div role="group" aria-label="Filter by technology" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <app-chip label="Angular" variant="primary" [selectable]="true" [selected]="true"></app-chip>
        <app-chip label="React" variant="primary" [selectable]="true"></app-chip>
        <app-chip label="Vue" variant="primary" [selectable]="true"></app-chip>
        <app-chip label="Svelte" variant="primary" [selectable]="true"></app-chip>
        <app-chip label="Solid" variant="primary" [selectable]="true" [disabled]="true"></app-chip>
      </div>
    `,
  }),
};

export const TagList: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <app-chip label="accessibility" variant="default" [dismissible]="true"></app-chip>
        <app-chip label="design-system" variant="primary" [dismissible]="true"></app-chip>
        <app-chip label="angular" variant="secondary" [dismissible]="true"></app-chip>
        <app-chip label="wcag" variant="success" [dismissible]="true"></app-chip>
        <app-chip label="oklch" variant="primary" [dismissible]="true"></app-chip>
      </div>
    `,
  }),
};
