import type { Meta, StoryObj } from '@storybook/angular';
import { NavigationComponent, NavItem } from './navigation.component';

const meta: Meta<NavigationComponent> = {
  title: 'Components/Navigation',
  component: NavigationComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Site or section navigation bar. Two orientations: \`horizontal\` (top header) and \`vertical\`
(sidebar). Two themes: \`default\` and \`inverse\` (dark/navy background).

Pass \`items\` as an array of \`{ label, href, active?, badge? }\` objects. The \`active\` flag
applies \`aria-current="page"\` and the active link style. Optional \`badge\` renders a numeric
indicator on the nav item — useful for notification counts.

**Responsive behaviour (horizontal):** Below 640px the brand and item list wrap to two rows.
The brand stays on row one; the list drops flush-left to row two. No JavaScript required.
        `.trim(),
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Navigation layout direction',
    },
    theme: {
      control: 'select',
      options: ['default', 'inverse'],
      description: 'default renders on a light surface; inverse renders on the dark inverse surface (--color-bg-inverse)',
    },
    brand: {
      control: 'text',
      description: 'Brand/logo text',
    },
  },
};

export default meta;
type Story = StoryObj<NavigationComponent>;

const defaultItems: NavItem[] = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    orientation: 'horizontal',
    brand: 'Candor',
  },
  render: (args) => ({
    props: args,
    template: `<app-navigation [items]="items" [orientation]="orientation" [brand]="brand"></app-navigation>`,
  }),
};

export const Horizontal: Story = {
  args: {
    items: defaultItems,
    orientation: 'horizontal',
    brand: 'Candor',
  },
  render: (args) => ({
    props: args,
    template: `<app-navigation [items]="items" [orientation]="orientation" [brand]="brand"></app-navigation>`,
  }),
};

export const Vertical: Story = {
  args: {
    items: defaultItems,
    orientation: 'vertical',
    brand: 'Candor',
  },
  render: (args) => ({
    props: args,
    template: `<app-navigation [items]="items" [orientation]="orientation" [brand]="brand"></app-navigation>`,
  }),
};

export const Inverse: Story = {
  args: {
    items: defaultItems,
    orientation: 'horizontal',
    theme: 'inverse',
    brand: 'Candor',
  },
  render: (args) => ({
    props: args,
    template: `<app-navigation [items]="items" [orientation]="orientation" [theme]="theme" [brand]="brand"></app-navigation>`,
  }),
};

export const WithBadges: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '#dashboard', active: true },
      { label: 'Inbox', href: '#inbox', badge: '12', badgeLabel: '12 unread' },
      { label: 'Tasks', href: '#tasks', badge: '3', badgeLabel: '3 pending' },
      { label: 'Settings', href: '#settings' },
    ] as NavItem[],
    orientation: 'horizontal',
    brand: 'Candor',
  },
  render: (args) => ({
    props: args,
    template: `<app-navigation [items]="items" [orientation]="orientation" [brand]="brand"></app-navigation>`,
  }),
};
