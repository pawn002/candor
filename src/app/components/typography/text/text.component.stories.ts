import type { Meta, StoryObj } from '@storybook/angular';
import { TextComponent } from './text.component';

const meta: Meta<TextComponent> = {
  title: 'Angular Components/Typography/Text',
  component: TextComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`TextComponent\` covers body copy, captions, and UI chrome labels. Three variants:

| Variant | Typeface | Use case |
|---|---|---|
| \`body\` | Noto Serif | General body text, descriptions, explanatory copy |
| \`caption\` | Noto Serif italic | Supplementary context, figure captions, timestamps |
| \`label\` | Roboto Flex | UI chrome — button text, tab labels, field annotations |

**Text vs. AccessibleText:** Use \`TextComponent\` for body content rendered in Noto Serif or
Roboto Flex. Use \`AccessibleTextComponent\` (Atkinson Hyperlegible) for critical functional text —
form labels, error messages, status indicators — where legibility under stress is the priority.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'caption', 'label'],
      description: 'Text style variant — body (Noto Serif, editorial), caption (italic supplementary), label (Roboto Flex, UI chrome)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Text size. xs (12px) is decorative only. Caption is typically sm (14px). xl–3xl are heading territory — prefer HeadingComponent for structural headings.',
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

export const Default: Story = {
  args: { variant: 'body', size: 'md', color: 'primary', bold: false },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines, it produces results that faster methods cannot.</app-text>`,
  }),
};

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
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">xs · 12px</app-text>
          <app-text variant="body" size="xs">Decorative only — icons, badge chrome, non-readable metadata.</app-text>
        </div>
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">sm · 14px</app-text>
          <app-text variant="body" size="sm">System floor for readable text. Dense UI, captions, secondary prose.</app-text>
        </div>
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">md · 16px</app-text>
          <app-text variant="body" size="md">Default body size. Comfortable baseline for sustained reading.</app-text>
        </div>
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">lg · 20px</app-text>
          <app-text variant="body" size="lg">Intro paragraphs, pull quotes, lead text above an article.</app-text>
        </div>
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">xl · 25px</app-text>
          <app-text variant="body" size="xl">Large display text. Prefer HeadingComponent for structural headings.</app-text>
        </div>
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">2xl · 31px</app-text>
          <app-text variant="body" size="2xl">Display scale — use HeadingComponent (h2) for semantic heading use.</app-text>
        </div>
        <div style="display: flex; align-items: baseline; gap: 1rem;">
          <app-text variant="label" size="xs" color="secondary" style="min-width: 7ch;">3xl · 39px</app-text>
          <app-text variant="body" size="3xl">Hero display — use HeadingComponent (h1) for semantic heading use.</app-text>
        </div>
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
