import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const STATUS_OPTIONS = JSON.stringify([
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-review', label: 'In review' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
]);

const REVIEWER_OPTIONS = JSON.stringify([
  { value: 'any', label: 'Any reviewer' },
  { value: 'jharlow', label: 'J. Harlow' },
  { value: 'spatel', label: 'S. Patel' },
  { value: 'mchen', label: 'M. Chen' },
]);

const meta: Meta = {
  title: 'Examples/Data Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Filterable data table composing \`<candor-drawer>\`, \`<candor-table>\`,
\`<candor-pagination>\`, \`<candor-input>\`, \`<candor-select>\`, \`<candor-checkbox>\`,
\`<candor-disclosure>\`, \`<candor-badge>\`, \`<candor-heading>\`, \`<candor-text>\`, and
\`<candor-button>\`.

Demonstrates a canonical list-management UI:
- **Drawer** holds the filter panel, keeping the table full-width while filters are open
- **Disclosure** collapses the "Advanced filters" section inside the drawer
- **Badge** on the filter button shows the count of active filters at a glance
- **Pagination** navigates large result sets via the \`page-change\` CustomEvent
- **Table** renders sortable columns and row data

The filter drawer uses \`<aside>\` with an \`aria-label\` — landmark navigation lets
keyboard and screen reader users jump directly to filters without tabbing through the
full table first.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const openDrawer = () => {
  const drawer = document.querySelector('candor-drawer') as any;
  if (drawer) drawer.open = true;
};
const closeDrawer = () => {
  const drawer = document.querySelector('candor-drawer') as any;
  if (drawer) drawer.open = false;
};

export const FilterableTable: Story = {
  render: () => html`
      <main style="padding: clamp(1rem, 4vw, 2rem); max-width: 900px;">

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
          <div>
            <candor-heading level="h1" style="margin-bottom: 0.25rem;">Submissions</candor-heading>
            <candor-text variant="body" style="color: var(--color-text-subtle);">247 results · Page 3 of 25</candor-text>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding-top: 6px; padding-right: 0.5rem;">
            <candor-input
              aria-label="Search submissions"
              placeholder="Search submissions..."
              style="flex: 1; min-width: 120px; max-width: 220px;">
            </candor-input>
            <div style="position: relative; display: inline-flex; align-items: center;">
              <candor-button id="open-filters" variant="secondary" aria-describedby="filter-count" @click=${openDrawer}>
                Filters
              </candor-button>
              <candor-badge
                id="filter-count"
                variant="primary"
                style="position: absolute; top: -6px; right: 0; min-width: 1.25rem; text-align: center;"
                aria-label="3 active filters">
                3
              </candor-badge>
            </div>
          </div>
        </div>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="
            width: 100%;
            border-collapse: collapse;
            font-family: var(--font-family-accessible);
            font-size: var(--font-size-sm);
            color: var(--color-text-default);
            letter-spacing: 0.02em;
          ">
            <thead>
              <tr>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Applicant</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Status</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Submitted</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Reviewer</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">Miriam Okonkwo</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);"><candor-badge variant="warning" size="sm">In review</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">12 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">J. Harlow</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">74</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">Thomas Brandt</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);"><candor-badge variant="success" size="sm">Approved</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">11 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">S. Patel</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">91</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">Aiko Sato</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);"><candor-badge variant="error" size="sm">Declined</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">10 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">J. Harlow</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">38</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">Carlos Reyes</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);"><candor-badge variant="warning" size="sm">In review</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">9 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">M. Chen</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">67</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">Priya Nair</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);"><candor-badge variant="success" size="sm">Approved</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">8 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">S. Patel</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">88</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">Lena Fischer</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);"><candor-badge variant="default" size="sm">Pending</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">7 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">—</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: var(--color-bg-surface);">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <candor-pagination
          current-page="3"
          total-pages="25"
          aria-label="Submissions pages">
        </candor-pagination>

        <candor-drawer
          heading="Filters"
          position="right"
          size="sm">

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">

            <candor-select
              label="Status"
              value="in-review"
              options='${STATUS_OPTIONS}'>
            </candor-select>

            <candor-select
              label="Reviewer"
              placeholder="Any reviewer"
              options='${REVIEWER_OPTIONS}'>
            </candor-select>

            <candor-input
              label="Submitted after"
              type="date">
            </candor-input>

            <fieldset style="border: none; padding: 0; margin: 0;">
              <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin-bottom: 0.75rem;">Score range</legend>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem;">
                <candor-input label="Min" type="number" placeholder="0"></candor-input>
                <candor-input label="Max" type="number" placeholder="100"></candor-input>
              </div>
            </fieldset>

            <candor-disclosure label="Advanced filters">
              <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 0.75rem;">
                <candor-checkbox label="Exclude incomplete submissions"></candor-checkbox>
                <candor-checkbox label="Show only flagged for review"></candor-checkbox>
                <candor-checkbox label="Include archived records"></candor-checkbox>
              </div>
            </candor-disclosure>

          </div>

          <div slot="footer" style="display: flex; gap: 0.75rem;">
            <candor-button id="apply-filters" variant="primary" style="flex: 1;" @click=${closeDrawer}>Apply filters</candor-button>
            <candor-button id="clear-filters" variant="ghost" @click=${closeDrawer}>Clear all</candor-button>
          </div>

        </candor-drawer>

      </main>
  `,
};

// Open variant for Chromatic — reuses the render and opens the filter drawer via
// its trigger handler. Tagged !autodocs so the open drawer stays off the docs page.
export const FilterDrawerOpen: Story = {
  ...FilterableTable,
  name: 'Filter Drawer (open)',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, chromatic: { pauseAnimationAtEnd: true } },
  play: openDrawer,
};
