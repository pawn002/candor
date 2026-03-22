import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TableComponent } from './table.component';

const meta: Meta<TableComponent> = {
  title: 'Components/Table',
  component: TableComponent,
  decorators: [
    moduleMetadata({ imports: [TableComponent] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Zebra striping uses \`oklch(0.85 0 0)\` for even rows — deltaE 11 from white, visible on any light background without requiring a surface container.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Default: Story = {
  args: { compact: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <app-table [compact]="compact">
          <table>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th class="numeric">Score</th>
                <th class="numeric">Threshold</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="label">WCAG 2.1</td>
                <td class="numeric">3.9</td>
                <td class="numeric">4.5</td>
              </tr>
              <tr>
                <td class="label">OKCA</td>
                <td class="numeric">4.0</td>
                <td class="numeric">4.5</td>
              </tr>
              <tr>
                <td class="label">Perceptual</td>
                <td class="numeric">60</td>
                <td class="numeric">75</td>
              </tr>
              <tr>
                <td class="label">Delta E</td>
                <td class="numeric">48</td>
                <td class="numeric">50</td>
              </tr>
            </tbody>
          </table>
        </app-table>
      </div>
    `,
  }),
};

export const Compact: Story = {
  name: 'Compact — key/value measurements',
  render: () => ({
    template: `
      <div style="max-width: 360px; padding: 1.5rem;">
        <app-table [compact]="true">
          <table>
            <tbody>
              <tr>
                <td class="label">WCAG 2.1</td>
                <td class="numeric">3.9</td>
              </tr>
              <tr>
                <td class="label">OKCA</td>
                <td class="numeric">4.0</td>
              </tr>
              <tr>
                <td class="label">Perceptual</td>
                <td class="numeric">60</td>
              </tr>
              <tr>
                <td class="label">Delta E</td>
                <td class="numeric">48</td>
              </tr>
              <tr>
                <td class="label">FG · L C H</td>
                <td class="numeric">0.55 · 0.065 · 142°</td>
              </tr>
              <tr>
                <td class="label">BG · L C H</td>
                <td class="numeric">0.94 · 0.054 · 333°</td>
              </tr>
            </tbody>
          </table>
        </app-table>
      </div>
    `,
  }),
};
