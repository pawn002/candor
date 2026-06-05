import type { Meta, StoryObj } from '@storybook/angular';

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
  render: (args) => ({
    template: `<candor-stat value="${args['value']}" unit="${args['unit']}" label="${args['label']}" color="${args['color']}" size="${args['size']}"></candor-stat>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
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
  }),
};

export const ContrastRatio: Story = {
  name: 'Contrast ratio — warning state',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
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
  }),
};

export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:var(--spacing-lg);flex-wrap:wrap;justify-content:center;">
        <candor-stat value="98.7" unit="%" label="Uptime" color="success" size="lg"></candor-stat>
        <candor-stat value="42" label="Pending" color="warning" size="lg"></candor-stat>
        <candor-stat value="3" label="Failures" color="error" size="lg"></candor-stat>
        <candor-stat value="1,284" label="Users" color="default" size="lg"></candor-stat>
        <candor-stat value="512" label="API calls" color="info" size="lg"></candor-stat>
      </div>
    `,
  }),
};
