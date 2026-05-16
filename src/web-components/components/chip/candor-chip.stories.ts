import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-chip>\` — small pill-shaped element for tags, filters, and selections. Three
interaction modes:

- **Selectable** (\`selectable\`) — toggles an active state; use for filter chips where the user turns options on and off
- **Dismissible** (\`dismissible\`) — shows a close button; use for input chips that can be removed (tags on a post, applied filters)
- **Link** (\`link-href="/tags/foo"\`) — renders as \`<a>\`; use when the chip navigates to another page (taxonomy archive, tag cloud). Mutually exclusive with selectable and dismissible.

**Chip vs. Badge:** Badges are static indicators (status, count). Chips are interactive —
they respond to clicks and can be removed. If the element has no interaction, use a Badge.

Six color variants: \`default\`, \`primary\`, \`secondary\`, \`success\`, \`warning\`,
\`error\`. Emits \`selected-change\` and \`dismissed\` CustomEvents.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Chip text' },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      type: { name: 'string' },
      description: 'Color variant',
    },
    selectable: { control: 'boolean', type: { name: 'boolean' }, description: 'Toggle on click' },
    dismissible: { control: 'boolean', type: { name: 'boolean' }, description: 'Render close button' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
    selected: { control: 'boolean', type: { name: 'boolean' }, description: 'Selected state (when selectable)' },
    linkHref: { control: 'text', type: { name: 'string' }, description: 'href; when set, renders as <a> (mutually exclusive with selectable and dismissible)' },
  },
  args: { label: 'Tag', variant: 'default', selectable: false, dismissible: false, disabled: false, selected: false },
  render: (args) => ({
    template: `<candor-chip label="${args['label']}" variant="${args['variant']}" ${args['selectable'] ? 'selectable' : ''} ${args['dismissible'] ? 'dismissible' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['selected'] ? 'selected' : ''}></candor-chip>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const SelectableSelected: Story = {
  args: { label: 'TypeScript', variant: 'primary', selectable: true, selected: true },
};

export const Link: Story = {
  args: { label: 'Accessibility', variant: 'default' },
  render: () => ({ template: `<candor-chip label="Accessibility" link-href="/tags/accessibility/"></candor-chip>` }),
};

export const Disabled: Story = {
  args: { label: 'Unavailable', variant: 'default', selectable: true, disabled: true },
};

export const Selectable: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <candor-chip label="React" selectable></candor-chip>
        <candor-chip label="Angular" selectable selected></candor-chip>
        <candor-chip label="Vue" selectable></candor-chip>
      </div>
    `,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <candor-chip label="JavaScript" dismissible></candor-chip>
        <candor-chip label="TypeScript" dismissible></candor-chip>
        <candor-chip label="Python" dismissible variant="success"></candor-chip>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <candor-chip label="Default"></candor-chip>
        <candor-chip label="Primary" variant="primary"></candor-chip>
        <candor-chip label="Secondary" variant="secondary"></candor-chip>
        <candor-chip label="Success" variant="success"></candor-chip>
        <candor-chip label="Warning" variant="warning"></candor-chip>
        <candor-chip label="Error" variant="error"></candor-chip>
      </div>
    `,
  }),
};

export const FilterGroup: Story = {
  render: () => ({
    template: `
      <div role="group" aria-label="Filter by technology" style="display:flex;flex-wrap:wrap;gap:0.5rem;">
        <candor-chip label="Angular" variant="primary" selectable selected></candor-chip>
        <candor-chip label="React" variant="primary" selectable></candor-chip>
        <candor-chip label="Vue" variant="primary" selectable></candor-chip>
        <candor-chip label="Svelte" variant="primary" selectable></candor-chip>
        <candor-chip label="Solid" variant="primary" selectable disabled></candor-chip>
      </div>
    `,
  }),
};

export const TagList: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
        <candor-chip label="accessibility" variant="default" dismissible></candor-chip>
        <candor-chip label="design-system" variant="primary" dismissible></candor-chip>
        <candor-chip label="angular" variant="secondary" dismissible></candor-chip>
        <candor-chip label="wcag" variant="success" dismissible></candor-chip>
        <candor-chip label="oklch" variant="primary" dismissible></candor-chip>
      </div>
    `,
  }),
};

export const TaxonomyLinks: Story = {
  name: 'Taxonomy Links',
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
        <candor-chip label="Accessibility" variant="default" link-href="/tags/accessibility/"></candor-chip>
        <candor-chip label="Design Systems" variant="primary" link-href="/tags/design-systems/"></candor-chip>
        <candor-chip label="Angular" variant="secondary" link-href="/tags/angular/"></candor-chip>
        <candor-chip label="WCAG" variant="success" link-href="/tags/wcag/"></candor-chip>
        <candor-chip label="OKLCH" variant="default" link-href="/tags/oklch/"></candor-chip>
      </div>
    `,
  }),
};
