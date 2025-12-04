import type { Meta, StoryObj } from '@storybook/angular';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Components/Form/Radio',
  component: RadioComponent,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<RadioComponent>;

export const Default: Story = {
  args: {
    label: 'Option 1',
    value: 'option1',
    name: 'demo',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Cannot select',
    value: 'disabled',
    name: 'demo',
    disabled: true,
  },
};

export const RadioGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-radio label="Option 1" value="option1" name="group1"></app-radio>
        <app-radio label="Option 2" value="option2" name="group1"></app-radio>
        <app-radio label="Option 3" value="option3" name="group1"></app-radio>
        <app-radio label="Disabled option" value="option4" name="group1" [disabled]="true"></app-radio>
      </div>
    `,
  }),
};

export const MultipleGroups: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 3rem;">
        <div>
          <h4 style="margin-bottom: 1rem;">Size</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <app-radio label="Small" value="small" name="size"></app-radio>
            <app-radio label="Medium" value="medium" name="size"></app-radio>
            <app-radio label="Large" value="large" name="size"></app-radio>
          </div>
        </div>
        <div>
          <h4 style="margin-bottom: 1rem;">Color</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <app-radio label="Red" value="red" name="color"></app-radio>
            <app-radio label="Blue" value="blue" name="color"></app-radio>
            <app-radio label="Green" value="green" name="color"></app-radio>
          </div>
        </div>
      </div>
    `,
  }),
};
