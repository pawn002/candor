import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { StatComponent } from './stat.component';
import { BadgeComponent } from '../badge/badge.component';
import { AccessibleTextComponent } from '../typography/accessible-text/accessible-text.component';
import { CardComponent } from '../card/card.component';

const meta: Meta<StatComponent> = {
  title: 'Components/Stat',
  component: StatComponent,
  decorators: [
    moduleMetadata({ imports: [StatComponent, BadgeComponent, AccessibleTextComponent, CardComponent] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text', type: { name: 'string' }, description: 'Numeric or string value displayed large' },
    unit: { control: 'text', type: { name: 'string' }, description: 'Unit suffix displayed after the value (e.g. % or :1)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Descriptive label below the value' },
    color: { control: 'select', options: ['default', 'success', 'warning', 'error', 'info'], type: { name: 'string' }, description: 'Semantic color variant' },
  },
};

export default meta;
type Story = StoryObj<StatComponent>;

export const Default: Story = {
  args: { value: '42', unit: '%', label: 'Completion rate' },
  render: (args) => ({
    props: args,
    template: `<div style="padding: 2rem;"><app-stat [value]="value" [unit]="unit" [label]="label"></app-stat></div>`,
  }),
};

export const ContrastRatio: Story = {
  parameters: { controls: { disable: true } },
  name: 'Contrast ratio — warning state',
  render: () => ({
    template: `
      <div style="max-width: 320px; padding: 1rem;">
        <app-card variant="elevated" style="display: block;">
          <div style="padding: 0.5rem 0;">
            <app-stat value="3.9" unit=":1" label="WCAG 2.1 contrast ratio" color="warning">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                <app-badge variant="error" size="sm">AA text ✗</app-badge>
                <app-badge variant="success" size="sm">Large text ✓</app-badge>
                <app-badge variant="success" size="sm">Non-text ✓</app-badge>
              </div>
              <app-accessible-text role="annotation" color="secondary" style="text-align: center; display: block;">
                Needs 4.5:1 for AA · 7:1 for AAA
              </app-accessible-text>
            </app-stat>
          </div>
        </app-card>
      </div>
    `,
  }),
};

export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; padding: 2rem;">
        <app-stat value="98.2" unit="%" label="Uptime" color="success"></app-stat>
        <app-stat value="3.9" unit=":1" label="Contrast ratio" color="warning"></app-stat>
        <app-stat value="12" label="Errors" color="error"></app-stat>
        <app-stat value="1.4s" label="Response time" color="info"></app-stat>
        <app-stat value="4,821" label="Total requests" color="default"></app-stat>
      </div>
    `,
  }),
};
