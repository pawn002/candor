import type { Meta, StoryObj } from '@storybook/angular';
import { SpacingShowcaseComponent } from './spacing-showcase.component';

const meta: Meta<SpacingShowcaseComponent> = {
  title: 'Design Tokens/Spacing',
  component: SpacingShowcaseComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SpacingShowcaseComponent>;

export const SpacingScale: Story = {
  render: () => ({
    template: `<app-spacing-showcase></app-spacing-showcase>`,
  }),
};

export const SpacingInComponents: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <h3 style="margin-bottom: 1.5rem;">Spacing Applied to Components</h3>

        <div style="display: flex; flex-direction: column; gap: 2rem;">
          <div>
            <h4 style="margin-bottom: 0.5rem;">Tight Spacing (xs)</h4>
            <div style="display: flex; gap: 0.5rem;">
              <div style="padding: 0.5rem; background: #e5e5e5; border-radius: 4px;">Item 1</div>
              <div style="padding: 0.5rem; background: #e5e5e5; border-radius: 4px;">Item 2</div>
              <div style="padding: 0.5rem; background: #e5e5e5; border-radius: 4px;">Item 3</div>
            </div>
          </div>

          <div>
            <h4 style="margin-bottom: 0.5rem;">Comfortable Spacing (md)</h4>
            <div style="display: flex; gap: 1.5rem;">
              <div style="padding: 1rem; background: #e5e5e5; border-radius: 4px;">Item 1</div>
              <div style="padding: 1rem; background: #e5e5e5; border-radius: 4px;">Item 2</div>
              <div style="padding: 1rem; background: #e5e5e5; border-radius: 4px;">Item 3</div>
            </div>
          </div>

          <div>
            <h4 style="margin-bottom: 0.5rem;">Loose Spacing (xl)</h4>
            <div style="display: flex; gap: 3rem;">
              <div style="padding: 1.5rem; background: #e5e5e5; border-radius: 4px;">Item 1</div>
              <div style="padding: 1.5rem; background: #e5e5e5; border-radius: 4px;">Item 2</div>
              <div style="padding: 1.5rem; background: #e5e5e5; border-radius: 4px;">Item 3</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
