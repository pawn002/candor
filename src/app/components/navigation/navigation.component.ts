import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [class]="'nav nav--' + orientation()" aria-label="Main navigation">
      @if (brand()) {
        <span class="nav__brand">{{ brand() }}</span>
      }
      <ul class="nav__list" role="list">
        @for (item of items(); track item.href) {
          <li class="nav__item">
            <a
              class="nav__link"
              [class.nav__link--active]="item.active"
              [href]="item.href"
              [attr.aria-current]="item.active ? 'page' : null"
            >
              {{ item.label }}
              @if (item.badge) {
                <span class="nav__badge">{{ item.badge }}</span>
              }
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  items = input<NavItem[]>([]);
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  brand = input('');
}
