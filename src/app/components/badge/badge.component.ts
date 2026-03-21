import { Component, Input } from '@angular/core';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="'badge badge--' + variant + ' badge--' + size"><ng-content></ng-content></span>`,
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
}
