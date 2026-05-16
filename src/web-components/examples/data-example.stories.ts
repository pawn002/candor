import type { Meta, StoryObj } from '@storybook/angular';

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

export const FilterableTable: Story = {
  render: () => ({
    template: `
      <div style="padding: clamp(1rem, 4vw, 2rem); max-width: 900px;">

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
          <div>
            <candor-heading level="h1" style="margin-bottom: 0.25rem;">Submissions</candor-heading>
            <candor-text variant="body" style="color: var(--color-text-subtle);">247 results · Page 3 of 25</candor-text>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding-top: 6px; padding-right: 0.5rem;">
            <candor-input
              placeholder="Search submissions..."
              style="flex: 1; min-width: 120px; max-width: 220px;">
            </candor-input>
            <div style="position: relative; display: inline-flex; align-items: center;">
              <candor-button id="open-filters" variant="secondary">
                <i class="ph ph-funnel" aria-hidden="true" style="margin-right: 0.4em;"></i>
                Filters
              </candor-button>
              <candor-badge
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
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Applicant</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Status</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Submitted</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Reviewer</th>
                <th scope="col" style="text-align: left; padding: var(--spacing-xs) var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">Miriam Okonkwo</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);"><candor-badge variant="warning">In review</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">12 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">J. Harlow</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">74</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">Thomas Brandt</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);"><candor-badge variant="success">Approved</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">11 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">S. Patel</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">91</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">Aiko Sato</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);"><candor-badge variant="error">Declined</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">10 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">J. Harlow</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">38</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">Carlos Reyes</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);"><candor-badge variant="warning">In review</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">9 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">M. Chen</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">67</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">Priya Nair</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);"><candor-badge variant="success">Approved</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">8 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">S. Patel</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong);">88</td>
              </tr>
              <tr>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">Lena Fischer</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);"><candor-badge variant="default">Pending</candor-badge></td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">7 Apr 2026</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">—</td>
                <td style="padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-strong); background: oklch(0.85 0 0);">—</td>
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
          id="filter-drawer"
          heading="Filters"
          position="right"
          size="sm">

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">

            <candor-select
              id="filter-status"
              label="Status"
              value="in-review">
            </candor-select>

            <candor-select
              id="filter-reviewer"
              label="Reviewer"
              placeholder="Any reviewer">
            </candor-select>

            <candor-input
              label="Submitted after"
              type="date">
            </candor-input>

            <fieldset style="border: none; padding: 0; margin: 0;">
              <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); margin-bottom: 0.75rem; letter-spacing: 0.02em;">Score range</legend>
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
            <candor-button id="apply-filters" variant="primary" style="flex: 1;">Apply filters</candor-button>
            <candor-button id="clear-filters" variant="ghost">Clear all</candor-button>
          </div>

        </candor-drawer>

      </div>

      <script>
        (function() {
          var s = document.getElementById('filter-status');
          if (s) s.options = ${STATUS_OPTIONS};
          var r = document.getElementById('filter-reviewer');
          if (r) r.options = ${REVIEWER_OPTIONS};

          var drawer = document.getElementById('filter-drawer');
          var openBtn = document.getElementById('open-filters');
          var applyBtn = document.getElementById('apply-filters');
          var clearBtn = document.getElementById('clear-filters');
          if (openBtn && drawer) openBtn.addEventListener('clicked', function() { drawer.open = true; });
          if (applyBtn && drawer) applyBtn.addEventListener('clicked', function() { drawer.open = false; });
          if (clearBtn && drawer) clearBtn.addEventListener('clicked', function() { drawer.open = false; });
        })();
      </script>
    `,
  }),
};
