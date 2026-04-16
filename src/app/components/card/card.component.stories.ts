import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'Components/Card',
  component: CardComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Versatile surface container. Three variants cover the standard layering hierarchy: \`default\` (surface), \`elevated\` (floats above surface), \`outlined\` (page background with border).

**Light-mode surface layering**

In light mode \`--color-bg-page\` and \`--color-bg-elevated\` are both near-white. Colour alone cannot create visible depth — the \`elevated\` variant relies on \`box-shadow\` for its lift signal. If you are building a card-on-card layout, the inner card should be \`outlined\` or \`default\` (surface tint) rather than another \`elevated\`.

**Styling projected content**

Angular's emulated encapsulation prevents parent SCSS from reaching inside \`CardComponent\`'s template slots. A selector like \`app-card .card__body { ... }\` in a parent component has no effect. The correct approach is to wrap slot content in a \`<div>\` and style that wrapper:

\`\`\`html
<!-- ✓ Wrap slot content and style the wrapper from the parent -->
<app-card>
  <div class="my-content">...</div>
</app-card>
\`\`\`
\`\`\`scss
// parent.component.scss
.my-content { padding: 0; }
\`\`\`

**Copying component styles (\`ViewEncapsulation.None\`)**

If you copy Candor component SCSS into a \`ViewEncapsulation.None\` component, Angular's \`:host\` pseudo-class stops working — styles must be anchored to a host element class instead:

\`\`\`scss
// ✗ Breaks under ViewEncapsulation.None
:host { display: block; }

// ✓ Replace :host with a host-element class
.my-component { display: block; }
\`\`\`
        `.trim(),
      },
    },
  },
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

export const SlotEncapsulation: Story = {
  name: 'Slot encapsulation — wrapper pattern',
  parameters: {
    docs: {
      description: {
        story: `
Parent SCSS cannot reach inside \`CardComponent\`'s template slots. Wrap slot content in a \`<div>\` and style that wrapper from the parent instead. The inner \`<div>\` in this example carries explicit styles to show the boundary.
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 24rem;">
        <app-card variant="outlined" padding="md">
          <div slot="header">Styled slot content</div>
          <!-- Wrapper div — style this from your parent component SCSS -->
          <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
            <p style="margin: 0;">Wrap slot content in a <code>&lt;div&gt;</code> and apply styles to the wrapper.</p>
            <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-subtle);">
              Selectors like <code>app-card .card__body</code> in a parent SCSS have no effect due to Angular's emulated encapsulation.
            </p>
          </div>
        </app-card>
      </div>
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
          <p>Lightness-elevated background with shadow — readable in light and dark mode.</p>
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
