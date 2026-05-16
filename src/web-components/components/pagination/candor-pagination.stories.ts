import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-pagination>\` — page navigator for paged data sets. Shows the current page,
adjacent pages, first/last anchors, and an ellipsis when the page count is large.
Previous/Next buttons always present.

Listen for the \`page-change\` CustomEvent to trigger data fetches:

\`\`\`javascript
document.querySelector('candor-pagination')
  .addEventListener('page-change', (e) => loadPage(e.detail));
\`\`\`

Pair with \`<candor-table>\` for a complete paged data view.
        `.trim(),
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    ariaLabel_: {
      control: 'text',
      type: { name: 'string' },
      description: 'Accessible label for the nav landmark. Customize when multiple paginators appear on the same page.',
    },
  },
  args: { currentPage: 3, totalPages: 10 },
  render: (args) => ({
    template: `<candor-pagination current-page="${args['currentPage']}" total-pages="${args['totalPages']}"></candor-pagination>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 10 },
};

export const LastPage: Story = {
  args: { currentPage: 10, totalPages: 10 },
};

export const FewPages: Story = {
  name: 'Few Pages (no ellipsis)',
  render: () => ({
    template: `<candor-pagination current-page="3" total-pages="5"></candor-pagination>`,
  }),
};

export const ManyPages: Story = {
  name: 'Many Pages (with ellipsis)',
  args: { currentPage: 8, totalPages: 25 },
};

export const SinglePage: Story = {
  args: { currentPage: 1, totalPages: 1 },
};

export const WithTable: Story = {
  name: 'Pattern: Below a Table',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-table>
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
        </candor-table>
        <div style="display:flex;justify-content:flex-end;">
          <candor-pagination current-page="3" total-pages="12"></candor-pagination>
        </div>
      </div>
    `,
  }),
};

export const MultiplePaginators: Story = {
  name: 'Pattern: Multiple Paginators',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
        <div>
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-xs);">When more than one paginator exists on a page, customize <code>aria-label</code> so screen reader users can distinguish them.</p>
        </div>
        <div>
          <p style="font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);margin-bottom:0.5rem;">Documents</p>
          <candor-pagination current-page="2" total-pages="8" aria-label="Documents pagination"></candor-pagination>
        </div>
        <div>
          <p style="font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);margin-bottom:0.5rem;">Images</p>
          <candor-pagination current-page="1" total-pages="4" aria-label="Images pagination"></candor-pagination>
        </div>
      </div>
    `,
  }),
};
