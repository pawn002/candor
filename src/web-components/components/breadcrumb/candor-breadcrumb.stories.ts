import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-breadcrumb>\` — navigation trail showing the current page's location within the
site hierarchy.

- Ancestor items render as \`<a>\` links; current location renders as \`<span aria-current="page">\`
- All text is bold weight — required to meet Tier 2 contrast at 14px (OKCA 4.5 bold threshold)
- Separators use \`--color-text-subtle\` at Tier 3 (meaning is redundantly coded by position)
- The \`/\` separator uses CSS \`content: '/' / ''\` to mark itself decorative — screen readers skip it

Pass \`items\` as a \`{ label, href? }[]\` array via the JS property (or JSON-encoded as an
attribute). The last item is treated as the current page and rendered without a link.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<candor-breadcrumb items='[{"label":"Home","href":"/"},{"label":"Settings","href":"/settings"},{"label":"Profile"}]'></candor-breadcrumb>`,
};

export const TwoLevels: Story = {
  render: () => html`<candor-breadcrumb items='[{"label":"Home","href":"/"},{"label":"Dashboard"}]'></candor-breadcrumb>`,
};

export const Deep: Story = {
  render: () => html`<candor-breadcrumb items='[{"label":"Home","href":"/"},{"label":"Products","href":"/products"},{"label":"Electronics","href":"/products/electronics"},{"label":"Laptops","href":"/products/electronics/laptops"},{"label":"ThinkPad X1 Carbon"}]'></candor-breadcrumb>`,
};

export const SingleLevel: Story = {
  render: () => html`<candor-breadcrumb items='[{"label":"Dashboard"}]'></candor-breadcrumb>`,
};
