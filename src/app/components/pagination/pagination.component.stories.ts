import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { PaginationComponent } from './pagination.component';
import { TableComponent } from '../table/table.component';

const meta: Meta<PaginationComponent> = {
  title: 'Components/Pagination',
  component: PaginationComponent,
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page (two-way bindable via `[(currentPage)]`)',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible label for the nav landmark. Customize when multiple paginators appear on the same page.',
    },
  },
};

export default meta;
type Story = StoryObj<PaginationComponent>;

export const Default: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};

export const FewPages: Story = {
  name: 'Few Pages (no ellipsis)',
  args: {
    currentPage: 3,
    totalPages: 5,
  },
};

export const ManyPages: Story = {
  name: 'Many Pages (with ellipsis)',
  args: {
    currentPage: 8,
    totalPages: 25,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const WithTable: Story = {
  name: 'Pattern: Below a Table',
  decorators: [moduleMetadata({ imports: [TableComponent] })],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
        <app-table>
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Alice Chen</td><td>Engineer</td><td>Active</td></tr>
              <tr><td>Ben Morris</td><td>Designer</td><td>Active</td></tr>
              <tr><td>Clara Kim</td><td>Manager</td><td>Away</td></tr>
              <tr><td>Dan Park</td><td>Engineer</td><td>Active</td></tr>
              <tr><td>Eva Rose</td><td>Analyst</td><td>Active</td></tr>
            </tbody>
          </table>
        </app-table>
        <div style="display: flex; justify-content: flex-end;">
          <app-pagination [currentPage]="3" [totalPages]="12"></app-pagination>
        </div>
      </div>
    `,
  }),
};

export const MultiplePaginators: Story = {
  name: 'Pattern: Multiple Paginators',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
        <div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: var(--spacing-xs);">
            When more than one paginator exists on a page, customize
            <code>ariaLabel</code> so screen reader users can distinguish them.
          </p>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); margin-bottom: 0.5rem;">Documents</p>
          <app-pagination [currentPage]="2" [totalPages]="8" ariaLabel="Documents pagination"></app-pagination>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); margin-bottom: 0.5rem;">Images</p>
          <app-pagination [currentPage]="1" [totalPages]="4" ariaLabel="Images pagination"></app-pagination>
        </div>
      </div>
    `,
  }),
};
