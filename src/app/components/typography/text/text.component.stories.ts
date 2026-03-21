import type { Meta, StoryObj } from '@storybook/angular';
import { TextComponent } from './text.component';

const meta: Meta<TextComponent> = {
  title: 'Typography/Text',
  component: TextComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'caption', 'label'],
      description: 'Text style variant — body (Noto Serif, editorial), caption (italic supplementary), label (Roboto Flex, UI chrome)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size. Caption is typically sm (14px). lg (20px) suits intro paragraphs or pull quotes.',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
      description: 'Text color',
    },
    bold: {
      control: 'boolean',
      description: 'Bold weight. For label: use only for structural hierarchy (column headers, section anchors), not for urgency.',
    },
  },
};

export default meta;
type Story = StoryObj<TextComponent>;

export const Body: Story = {
  args: {
    variant: 'body',
    size: 'md',
    color: 'primary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">
      Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines,
      it produces results that faster methods cannot.
    </app-text>`,
  }),
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    size: 'sm',
    color: 'secondary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">
      Figure 1. Optical sizing in Roboto Flex means stroke weight adapts to the rendered size —
      larger text naturally carries heavier strokes.
    </app-text>`,
  }),
};

export const Label: Story = {
  args: {
    variant: 'label',
    size: 'sm',
    color: 'primary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">
      Section title
    </app-text>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-text variant="body" size="sm">Small — 14px. Dense UI contexts, metadata, secondary prose.</app-text>
        <app-text variant="body" size="md">Medium — 16px. Default body size for readable prose.</app-text>
        <app-text variant="body" size="lg">Large — 20px. Intro paragraphs, pull quotes, lead text.</app-text>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-text variant="body">Primary — default body color</app-text>
        <app-text variant="body" color="secondary">Secondary — subtle, for supporting content</app-text>
        <app-text variant="body" color="disabled">Disabled — for inactive or unavailable text</app-text>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <app-text variant="label" size="sm" color="secondary">Body</app-text>
          <br>
          <app-text variant="body">
            Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines,
            it produces results that faster methods cannot.
          </app-text>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary">Caption</app-text>
          <br>
          <app-text variant="caption" size="sm" color="secondary">
            Figure 1. Optical sizing in Roboto Flex means stroke weight adapts to the rendered size —
            larger text naturally carries heavier strokes.
          </app-text>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary">Label</app-text>
          <br>
          <app-text variant="label">Section title</app-text>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary">Label — bold (structural hierarchy)</app-text>
          <br>
          <app-text variant="label" [bold]="true">Column header</app-text>
        </div>
      </div>
    `,
  }),
};
