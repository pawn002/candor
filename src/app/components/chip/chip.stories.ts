import type { Meta, StoryObj } from '@storybook/angular';
import { ChipComponent } from './chip.component';

const meta: Meta<ChipComponent> = {
  title: 'Components/Chip',
  component: ChipComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Small pill-shaped element for tags, filters, and selections. Three interaction modes:

- **Selectable** (\`[selectable]="true"\`) — toggles an active state; use for filter chips where the user turns options on and off
- **Dismissible** (\`[dismissible]="true"\`) — shows a close button; use for input chips that can be removed (tags on a post, applied filters)
- **Link** (\`[linkHref]="'/tags/foo'"\`) — renders as \`<a>\`; use when the chip navigates to another page (taxonomy archive, tag cloud). Mutually exclusive with selectable and dismissible.

**Chip vs. Badge:** Badges are static indicators (status, count). Chips are interactive — they respond to clicks and can be removed. If the element has no interaction, use a Badge.

Six color variants: \`default\`, \`primary\`, \`secondary\`, \`success\`, \`warning\`, \`error\`.
        `.trim(),
      },
    },
  },
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
    linkHref: { control: 'text' },
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

export const Link: Story = {
  args: { label: 'Accessibility', variant: 'default', linkHref: '/tags/accessibility/' },
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

export const TaxonomyLinks: Story = {
  name: 'Taxonomy Links',
  parameters: {
    docs: {
      description: {
        story: 'Use `linkHref` when chips navigate to archive pages. The chip renders as `<a>` — correct semantics for navigation, unlike a button which implies toggling.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <app-chip label="Accessibility" variant="default" linkHref="/tags/accessibility/"></app-chip>
        <app-chip label="Design Systems" variant="primary" linkHref="/tags/design-systems/"></app-chip>
        <app-chip label="Angular" variant="secondary" linkHref="/tags/angular/"></app-chip>
        <app-chip label="WCAG" variant="success" linkHref="/tags/wcag/"></app-chip>
        <app-chip label="OKLCH" variant="default" linkHref="/tags/oklch/"></app-chip>
      </div>
    `,
  }),
};
