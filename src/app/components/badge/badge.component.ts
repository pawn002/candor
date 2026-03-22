import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'badge badge--' + variant() + ' badge--' + size()"><ng-content></ng-content></span>`,
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  size = input<BadgeSize>('md');
}
