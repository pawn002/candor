import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'Components/Card',
  component: CardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      description: 'Card visual style',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Card padding size',
    },
  },
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding">
        <p>This is a default card with some content inside. Cards are versatile containers for grouping related information.</p>
      </app-card>
    `,
  }),
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding">
        <p>This is an elevated card with a shadow to create visual hierarchy.</p>
      </app-card>
    `,
  }),
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding">
        <p>This is an outlined card with a border for subtle separation.</p>
      </app-card>
    `,
  }),
};

export const WithHeaderAndFooter: Story = {
  render: () => ({
    template: `
      <app-card variant="outlined" padding="md">
        <div slot="header">Card Header</div>
        <p>Card body content goes here. This card has both a header and footer slot populated.</p>
        <div slot="footer">Card Footer — Additional info or actions</div>
      </app-card>
    `,
  }),
};

export const CardGrid: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 48rem;">
        <app-card variant="default" padding="md">
          <div slot="header">Default</div>
          <p>Surface background, no border, no shadow.</p>
        </app-card>
        <app-card variant="elevated" padding="md">
          <div slot="header">Elevated</div>
          <p>Page background with a medium shadow.</p>
        </app-card>
        <app-card variant="outlined" padding="md">
          <div slot="header">Outlined</div>
          <p>Page background with a thin border.</p>
        </app-card>
        <app-card variant="elevated" padding="lg">
          <div slot="header">Elevated — Large Padding</div>
          <p>Same elevated style with larger internal spacing.</p>
          <div slot="footer">Footer content</div>
        </app-card>
      </div>
    `,
  }),
};
