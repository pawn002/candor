import type { Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<BreadcrumbComponent> = {
  title: 'Angular Components/Breadcrumb',
  component: BreadcrumbComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Navigation trail showing the current page's location within the site hierarchy.

- Ancestor items render as \`<a>\` links; current location renders as \`<span aria-current="page">\`
- All text is bold weight — required to meet Tier 2 contrast at 14px (OKCA 4.5 bold threshold). See \`docs/CONTRAST-TIERS.md\`
- Separators use \`--color-text-subtle\` at Tier 3 (meaning is redundantly coded by position)
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<BreadcrumbComponent>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Profile' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Dashboard' },
    ],
  },
};

export const Deep: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Laptops', href: '/products/electronics/laptops' },
      { label: 'ThinkPad X1 Carbon' },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};
