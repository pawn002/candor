import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './candor-code';

const meta: Meta = {
  title: 'Components/Code',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-code>\` renders **inline code** with the \`--color-bg-code\` / \`--color-text-code\`
token pair applied together — plus the mono font, padding, radius, and border. It exists to
remove a footgun (#170): \`--color-bg-code\` is a dark navy, so setting it on a raw \`<code>\`
without also setting \`--color-text-code\` yields invisible dark-on-dark text. This element
can't be half-applied.

The inner \`<code>\` is exposed as \`::part(code)\` for consumer restyle. For multiline / block
code, wrap in a \`<pre>\` rather than using this inline element.
        `.trim(),
      },
    },
  },
  render: () => html`
    <p style="font-family:var(--font-family-base);font-size:var(--font-size-md);color:var(--color-text-default);max-width:40ch;">
      Run <candor-code>npm run build:tokens</candor-code> to emit the CSS, then import
      <candor-code>@candor-design/tokens/candor-tokens.css</candor-code> once at the app root.
    </p>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const InProse: Story = {
  name: 'Inline within prose',
  render: () => html`
    <p style="font-family:var(--font-family-base);font-size:var(--font-size-md);color:var(--color-text-default);line-height:var(--line-height-relaxed);max-width:52ch;">
      The <candor-code>observeHostAriaLabel</candor-code> helper installs a
      <candor-code>MutationObserver</candor-code> on the host, mirrors the value inward, and
      strips <candor-code>aria-label</candor-code> off the host so screen readers don't hear
      the name twice.
    </p>
  `,
};
