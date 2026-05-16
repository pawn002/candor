import type { Meta, StoryObj } from '@storybook/angular';

const defaultItems = JSON.stringify([
  { label: 'Home', href: '#home', active: true },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]);

const meta: Meta = {
  title: 'Web Components/Navigation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-navigation>\` — site or section navigation bar. Two orientations: \`horizontal\`
(top header) and \`vertical\` (sidebar). Two themes: \`default\` and \`inverse\` (dark/navy
background).

Pass \`items\` as an array of \`{ label, href, active?, badge? }\` objects via the JS
property (or JSON-encoded as an attribute in static markup). The \`active\` flag applies
\`aria-current="page"\` and the active link style. Optional \`badge\` renders a numeric
indicator on the nav item — useful for notification counts.

**Responsive behaviour (horizontal):** Below 640px the brand and item list wrap to two
rows. The brand stays on row one; the list drops flush-left to row two. No JavaScript
required.
        `.trim(),
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      type: { name: 'string' },
      description: 'Navigation layout direction',
    },
    theme: {
      control: 'select',
      options: ['default', 'inverse'],
      type: { name: 'string' },
      description: 'default renders on a light surface; inverse renders on the dark inverse surface',
    },
    brand: { control: 'text', type: { name: 'string' }, description: 'Brand/logo text' },
  },
  args: { orientation: 'horizontal', theme: 'default', brand: 'Candor' },
  render: (args) => ({
    template: `<candor-navigation brand="${args['brand']}" orientation="${args['orientation']}" theme="${args['theme']}" items='${defaultItems}'></candor-navigation>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const Inverse: Story = {
  args: { theme: 'inverse' },
};

export const WithBadges: Story = {
  render: () => ({
    template: `<candor-navigation brand="Candor" items='[{"label":"Dashboard","href":"#dashboard","active":true},{"label":"Inbox","href":"#inbox","badge":"12","badgeLabel":"12 unread"},{"label":"Tasks","href":"#tasks","badge":"3","badgeLabel":"3 pending"},{"label":"Settings","href":"#settings"}]'></candor-navigation>`,
  }),
};
