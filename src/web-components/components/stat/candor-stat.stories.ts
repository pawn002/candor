import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Stat',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    unit: { control: 'text' },
    label: { control: 'text' },
    color: { control: 'select', options: ['default', 'success', 'warning', 'error', 'info'] },
  },
  args: { value: '1,284', unit: '', label: 'Monthly active users', color: 'default' },
  render: (args) => ({
    template: `<candor-stat value="${args['value']}" unit="${args['unit']}" label="${args['label']}" color="${args['color']}"></candor-stat>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const ContrastRatio: Story = {
  name: 'Contrast ratio — warning state',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="max-width:320px;padding:1rem;">
        <candor-card variant="elevated">
          <div style="padding:0.5rem 0;">
            <candor-stat value="3.9" unit=":1" label="WCAG 2.1 contrast ratio" color="warning">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;">
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
      <div style="display:flex;gap:2rem;flex-wrap:wrap;justify-content:center;">
        <candor-stat value="98.7" unit="%" label="Uptime" color="success"></candor-stat>
        <candor-stat value="42" label="Pending" color="warning"></candor-stat>
        <candor-stat value="3" label="Failures" color="error"></candor-stat>
        <candor-stat value="1,284" label="Users" color="default"></candor-stat>
      </div>
    `,
  }),
};
