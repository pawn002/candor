import type { Meta, StoryObj } from '@storybook/angular';

const defaultItems = JSON.stringify([
  { label: 'Home', href: '#home', active: true },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]);

const badgeItems = JSON.stringify([
  { label: 'Dashboard', href: '#dashboard', active: true },
  { label: 'Inbox', href: '#inbox', badge: '12', badgeLabel: '12 unread' },
  { label: 'Tasks', href: '#tasks', badge: '3', badgeLabel: '3 pending' },
  { label: 'Settings', href: '#settings' },
]);

const meta: Meta = {
  title: 'Components/Navigation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-navigation>\` — site or section navigation bar. Two orientations: \`horizontal\`
(top header) and \`vertical\` (sidebar). Two themes: \`default\` and \`inverse\` (dark/navy
background).

Pass \`items\` as an array of \`{ label, href, active?, badge?, badgeLabel? }\` objects via
the JS property (or JSON-encoded as an attribute in static markup). The \`active\` flag
applies \`aria-current="page"\` and the active link style. Optional \`badge\` renders a
numeric indicator — set \`badgeLabel\` to a descriptive string (e.g. "12 unread") so screen
readers announce a meaningful name rather than just the count.

Set \`label\` when a page has more than one \`<candor-navigation>\` — each \`<nav>\` must
have a unique accessible name to satisfy WCAG 2.4.1. Defaults to \`"Main navigation"\`.

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
    label: { control: 'text', type: { name: 'string' }, description: 'Accessible name for the <nav> landmark. Use a unique value when multiple navigations appear on the same page.' },
  },
  args: { orientation: 'horizontal', theme: 'default', brand: 'Candor', label: 'Main navigation' },
  render: (args) => ({
    template: `<candor-navigation brand="${args['brand']}" orientation="${args['orientation']}" theme="${args['theme']}" label="${args['label']}" items='${defaultItems}'></candor-navigation>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const Inverse: Story = {
  args: { theme: 'inverse' },
};

export const WithBadges: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `badge` for a numeric count and `badgeLabel` for a descriptive accessible name. ' +
          'Without `badgeLabel`, a screen reader announces only the number — "12" with no context. ' +
          'With it, the announcement is "Inbox, 12 unread" (the badge `aria-label` supplements the link text).',
      },
    },
  },
  render: () => ({
    template: `<candor-navigation brand="Candor" items='${badgeItems}'></candor-navigation>`,
  }),
};
