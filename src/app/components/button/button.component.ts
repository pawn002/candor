import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  disabled = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  ariaLabel = input<string>();

  clicked = output<Event>();

  onClick(event: Event) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
