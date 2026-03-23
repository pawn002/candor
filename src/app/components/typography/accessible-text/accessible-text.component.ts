import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type AccessibleTextRole = 'label' | 'message' | 'status' | 'annotation';
type AccessibleTextSize = 'sm' | 'md' | 'lg';
type AccessibleTextColor = 'primary' | 'secondary' | 'disabled' | 'error';

@Component({
  selector: 'app-accessible-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./accessible-text.component.scss'],
  host: {
    '[class]': '"accessible-text accessible-text--role-" + role() + " accessible-text--size-" + size() + " accessible-text--color-" + color() + (bold() ? " accessible-text--bold" : "")',
    '[attr.role]': 'null',  // role is a styling API, not an ARIA role — prevent attribute forwarding
  },
})
export class AccessibleTextComponent {
  role = input<AccessibleTextRole>('label');
  size = input<AccessibleTextSize>('md');
  color = input<AccessibleTextColor>('primary');
  bold = input(false);
}
