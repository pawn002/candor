import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../components/button/button.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { DrawerComponent } from '../components/drawer/drawer.component';
import { DisclosureComponent } from '../components/disclosure/disclosure.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { InputComponent } from '../components/form/input/input.component';
import { SelectComponent } from '../components/form/select/select.component';
import { CheckboxComponent } from '../components/form/checkbox/checkbox.component';
import { TableComponent } from '../components/table/table.component';
import { HeadingComponent } from '../components/typography/heading/heading.component';
import { TextComponent } from '../components/typography/text/text.component';

const meta: Meta = {
  title: 'Examples/Data Example',
  decorators: [
    moduleMetadata({
      imports: [
        ButtonComponent,
        BadgeComponent,
        DrawerComponent,
        DisclosureComponent,
        PaginationComponent,
        InputComponent,
        SelectComponent,
        CheckboxComponent,
        TableComponent,
        HeadingComponent,
        TextComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Demonstrates: app-drawer (filter panel), app-select + app-input + app-checkbox (filter controls),
// app-badge (active filter count), app-table (results), app-pagination (page navigation),
// app-disclosure (advanced filters section inside the drawer).
export const FilterableTable: Story = {
  render: () => ({
    props: {
      drawerOpen: false,
      currentPage: 3,
    },
    template: `
      <div style="padding: 2rem; max-width: 900px;">

        <!-- Page header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
          <div>
            <app-heading [level]="1" style="margin-bottom: 0.25rem;">Submissions</app-heading>
            <app-text variant="body" style="color: var(--color-text-subtle);">247 results · Page 3 of 25</app-text>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding-top: 6px;">
            <app-input
              placeholder="Search submissions..."
              style="width: 220px;">
            </app-input>
            <div style="position: relative; display: inline-flex; align-items: center;">
              <app-button variant="secondary" (clicked)="drawerOpen = true">
                <i class="ph ph-funnel" aria-hidden="true" style="margin-right: 0.4em;"></i>
                Filters
              </app-button>
              <!-- Active filter badge -->
              <app-badge
                variant="primary"
                style="position: absolute; top: -6px; right: -6px; min-width: 1.25rem; text-align: center;"
                aria-label="3 active filters">
                3
              </app-badge>
            </div>
          </div>
        </div>

        <!-- Results table -->
        <app-table style="display: block; margin-bottom: 1.5rem;">
          <table>
            <thead>
              <tr>
                <th scope="col">Applicant</th>
                <th scope="col">Status</th>
                <th scope="col">Submitted</th>
                <th scope="col">Reviewer</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Miriam Okonkwo</td>
                <td><app-badge variant="warning">In review</app-badge></td>
                <td>12 Apr 2026</td>
                <td>J. Harlow</td>
                <td>74</td>
              </tr>
              <tr>
                <td>Thomas Brandt</td>
                <td><app-badge variant="success">Approved</app-badge></td>
                <td>11 Apr 2026</td>
                <td>S. Patel</td>
                <td>91</td>
              </tr>
              <tr>
                <td>Aiko Sato</td>
                <td><app-badge variant="error">Declined</app-badge></td>
                <td>10 Apr 2026</td>
                <td>J. Harlow</td>
                <td>38</td>
              </tr>
              <tr>
                <td>Carlos Reyes</td>
                <td><app-badge variant="warning">In review</app-badge></td>
                <td>9 Apr 2026</td>
                <td>M. Chen</td>
                <td>67</td>
              </tr>
              <tr>
                <td>Priya Nair</td>
                <td><app-badge variant="success">Approved</app-badge></td>
                <td>8 Apr 2026</td>
                <td>S. Patel</td>
                <td>88</td>
              </tr>
              <tr>
                <td>Lena Fischer</td>
                <td><app-badge variant="default">Pending</app-badge></td>
                <td>7 Apr 2026</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>James Otieno</td>
                <td><app-badge variant="success">Approved</app-badge></td>
                <td>6 Apr 2026</td>
                <td>M. Chen</td>
                <td>82</td>
              </tr>
              <tr>
                <td>Fatima Al-Rashid</td>
                <td><app-badge variant="warning">In review</app-badge></td>
                <td>5 Apr 2026</td>
                <td>J. Harlow</td>
                <td>71</td>
              </tr>
            </tbody>
          </table>
        </app-table>

        <!-- Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [totalPages]="25"
          (currentPageChange)="currentPage = $event"
          ariaLabel="Submissions pages">
        </app-pagination>

        <!-- Filter drawer -->
        <app-drawer
          heading="Filters"
          position="right"
          size="sm"
          [open]="drawerOpen"
          (closed)="drawerOpen = false">

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">

            <app-select
              label="Status"
              [options]="[
                { value: 'all', label: 'All statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'in-review', label: 'In review' },
                { value: 'approved', label: 'Approved' },
                { value: 'declined', label: 'Declined' }
              ]"
              [value]="'in-review'">
            </app-select>

            <app-select
              label="Reviewer"
              [options]="[
                { value: 'any', label: 'Any reviewer' },
                { value: 'jharlow', label: 'J. Harlow' },
                { value: 'spatel', label: 'S. Patel' },
                { value: 'mchen', label: 'M. Chen' }
              ]"
              placeholder="Any reviewer">
            </app-select>

            <app-input
              label="Submitted after"
              type="date">
            </app-input>

            <fieldset style="border: none; padding: 0; margin: 0;">
              <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); margin-bottom: 0.75rem; letter-spacing: 0.02em;">Score range</legend>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem;">
                <app-input label="Min" type="number" placeholder="0"></app-input>
                <app-input label="Max" type="number" placeholder="100"></app-input>
              </div>
            </fieldset>

            <!-- Advanced filters — collapsed by default -->
            <app-disclosure label="Advanced filters">
              <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 0.75rem;">
                <app-checkbox label="Exclude incomplete submissions"></app-checkbox>
                <app-checkbox label="Show only flagged for review"></app-checkbox>
                <app-checkbox label="Include archived records"></app-checkbox>
              </div>
            </app-disclosure>

          </div>

          <div slot="footer" style="display: flex; gap: 0.75rem; padding: var(--spacing-md); border-top: var(--border-width-thin) solid var(--color-border-default);">
            <app-button variant="primary" style="flex: 1;" (clicked)="drawerOpen = false">Apply filters</app-button>
            <app-button variant="ghost" (clicked)="drawerOpen = false">Clear all</app-button>
          </div>

        </app-drawer>

      </div>
    `,
  }),
};
