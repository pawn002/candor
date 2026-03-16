import { Component, Input } from '@angular/core';

type AccessibleTextRole = 'label' | 'message' | 'status' | 'annotation';
type AccessibleTextSize = 'sm' | 'md' | 'lg';
type AccessibleTextColor = 'primary' | 'secondary' | 'disabled' | 'error';

@Component({
  selector: 'app-accessible-text',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./accessible-text.component.scss'],
  host: {
    '[class]': '"accessible-text accessible-text--role-" + role + " accessible-text--size-" + size + " accessible-text--color-" + color + (bold ? " accessible-text--bold" : "")',
  },
})
export class AccessibleTextComponent {
  @Input() role: AccessibleTextRole = 'label';
  @Input() size: AccessibleTextSize = 'md';
  @Input() color: AccessibleTextColor = 'primary';
  @Input() bold: boolean = false;
}
