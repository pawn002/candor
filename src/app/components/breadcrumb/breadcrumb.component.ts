import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb" class="breadcrumb">
      <ol class="breadcrumb__list">
        @for (item of items(); track item.label; let last = $last) {
          <li class="breadcrumb__item">
            @if (last) {
              <span class="breadcrumb__current" aria-current="page">{{ item.label }}</span>
            } @else {
              <a class="breadcrumb__link" [href]="item.href || '#'">{{ item.label }}</a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
