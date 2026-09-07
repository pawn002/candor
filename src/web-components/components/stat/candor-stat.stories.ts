import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../badge/candor-badge';
import '../card/candor-card';
import '../typography/accessible-text/candor-accessible-text';
import './candor-stat';

const meta: Meta = {
  title: 'Components/Stat',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-stat>\` — numeric display for metrics, KPIs, and profile stats.

**Three sizes** for different hierarchy levels:
- \`size="sm"\` (25px value) — compact stats inside cards, profile panels, sidebars
- \`size="md"\` (31px value, default) — standard dashboard metrics and section-level KPIs
- \`size="lg"\` (39px value) — hero KPIs and prominent page-level statistics

Five semantic color variants signal the metric's state: \`default\`, \`success\`,
\`warning\`, \`error\`, \`info\`. The color applies to the value and unit, not the label.

**When you use a status colour, put the verdict in the slot too.** A stat's label names *what
is measured*, not whether the number is good — so unlike a badge, colour here can end up as
the only thing saying "this is a problem". \`<candor-accessible-text role_="state">\` is the
intended occupant: its icon is rendered by the component, so the redundancy cannot be
forgotten. See *Rule: colour is not the channel* (#214).

Compose with \`<candor-badge>\` for trend indicators (↑ 12% vs. last month) and with
\`<candor-card>\` when the stat lives inside a surface panel.
        `.trim(),
      },
    },
  },
  argTypes: {
    value: { control: 'text', type: { name: 'string' }, description: 'Numeric or string value displayed large' },
    unit: { control: 'text', type: { name: 'string' }, description: 'Unit suffix displayed after the value (e.g. % or :1)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Descriptive label above the value' },
    color: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      type: { name: 'string' },
      description: 'Semantic color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      type: { name: 'string' },
      description: 'Value font size — sm (25px), md (31px, default), lg (39px)',
    },
  },
  args: { value: '1,284', unit: '', label: 'Monthly active users', color: 'default', size: 'md' },
  render: (args) => html`<candor-stat value="${args['value']}" unit="${args['unit']}" label="${args['label']}" color="${args['color']}" size="${args['size']}"></candor-stat>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;gap:var(--spacing-xl);flex-wrap:wrap;align-items:flex-end;">
      <div style="text-align:center;">
        <candor-stat value="1,284" label="Users" size="sm"></candor-stat>
        <candor-accessible-text role_="annotation" style="display:block;margin-top:var(--spacing-xs);">size="sm"</candor-accessible-text>
      </div>
      <div style="text-align:center;">
        <candor-stat value="1,284" label="Users" size="md"></candor-stat>
        <candor-accessible-text role_="annotation" style="display:block;margin-top:var(--spacing-xs);">size="md" (default)</candor-accessible-text>
      </div>
      <div style="text-align:center;">
        <candor-stat value="1,284" label="Users" size="lg"></candor-stat>
        <candor-accessible-text role_="annotation" style="display:block;margin-top:var(--spacing-xs);">size="lg"</candor-accessible-text>
      </div>
    </div>
  `,
};

export const ContrastRatio: Story = {
  name: 'Contrast ratio — warning state',
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="max-width:320px;padding:var(--spacing-sm);">
      <candor-card variant="elevated">
        <div style="padding:var(--spacing-xs) 0;">
          <candor-stat value="3.9" unit=":1" label="WCAG 2.1 contrast ratio" color="warning">
            <div style="display:flex;gap:var(--spacing-xs);flex-wrap:wrap;justify-content:center;">
              <candor-badge variant="error" size="sm">AA text ✗</candor-badge>
              <candor-badge variant="success" size="sm">Large text ✓</candor-badge>
              <candor-badge variant="success" size="sm">Non-text ✓</candor-badge>
            </div>
            <candor-accessible-text role_="annotation" color="secondary" style="text-align:center;display:block;">
              Needs 4.5:1 for AA · 7:1 for AAA
            </candor-accessible-text>
          </candor-stat>
        </div>
      </candor-card>
    </div>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--spacing-lg);flex-wrap:wrap;justify-content:center;">
      <candor-stat value="98.7" unit="%" label="Uptime" color="success" size="lg"></candor-stat>
      <candor-stat value="42" label="Pending" color="warning" size="lg"></candor-stat>
      <candor-stat value="3" label="Failures" color="error" size="lg"></candor-stat>
      <candor-stat value="1,284" label="Users" color="default" size="lg"></candor-stat>
      <candor-stat value="512" label="API calls" color="info" size="lg"></candor-stat>
    </div>
  `,
};

export const ColourIsNotTheChannel: Story = {
  name: 'Rule: colour is not the channel',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `
Stat differs from badge, and the difference decides the rule.

A badge's label states the condition — "3 failed" — so the text carries the meaning and the
fill is decoration. A stat's label states **what is measured**, not the verdict. "Response
time 847 ms" is the same sentence whether that number is excellent or alarming; only the
colour says which. That makes colour the sole channel, which is exactly what the Tier 3
discount is not allowed to rest on.

The fix is already in the component: \`<candor-stat>\` has a default slot. Put
\`<candor-accessible-text role_="state">\` in it. Its tone icon is rendered by that component
rather than hand-placed, so the redundant channel cannot be omitted by accident — and its
text stays \`--color-text-default\`, so it clears every floor with margin while the icon does
the colour work.

Note the first row is not *wrong* in every context — a reader who knows the thresholds can
read it. It is wrong as a **default**, because it makes correct interpretation conditional on
knowledge the interface never supplied.
        `.trim(),
      },
    },
  },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:620px;padding:var(--spacing-md);">
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-md);">Colour alone — the verdict is unstated</p>
        <div style="display:flex;gap:var(--spacing-xl);flex-wrap:wrap;justify-content:center;">
          <candor-stat value="847" unit="ms" label="Response time" color="warning" size="lg"></candor-stat>
          <candor-stat value="99.2" unit="%" label="Uptime" color="success" size="lg"></candor-stat>
          <candor-stat value="12" label="Open incidents" color="error" size="lg"></candor-stat>
        </div>
      </div>
      <hr style="border:none;border-top:var(--border-width-thin) solid var(--color-border-default);margin:0;width:100%;" />
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-md);">With a state element in the slot</p>
        <div style="display:flex;gap:var(--spacing-xl);flex-wrap:wrap;justify-content:center;">
          <candor-stat value="847" unit="ms" label="Response time" color="warning" size="lg">
            <candor-accessible-text role_="state" tone="warning">Above target</candor-accessible-text>
          </candor-stat>
          <candor-stat value="99.2" unit="%" label="Uptime" color="success" size="lg">
            <candor-accessible-text role_="state" tone="success">Meeting SLA</candor-accessible-text>
          </candor-stat>
          <candor-stat value="12" label="Open incidents" color="error" size="lg">
            <candor-accessible-text role_="state" tone="error">Needs attention</candor-accessible-text>
          </candor-stat>
        </div>
      </div>
    </div>
  `,
};
