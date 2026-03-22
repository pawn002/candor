import type { Meta, StoryObj } from '@storybook/angular';
import { NavigationComponent, NavItem } from './navigation.component';

const meta: Meta<NavigationComponent> = {
  title: 'Components/Navigation',
  component: NavigationComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Navigation layout direction',
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
