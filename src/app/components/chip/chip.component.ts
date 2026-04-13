import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="'chip chip--' + variant()"
      [class.chip--selected]="selected()"
      [class.chip--disabled]="disabled()"
    >
      @if (selectable()) {
        <button
          class="chip__body chip__body--button"
          [attr.aria-pressed]="selected()"
          [attr.aria-disabled]="disabled() || null"
          [disabled]="disabled() || null"
          (click)="onToggle()"
        >{{ label() }}</button>
      } @else {
        <span class="chip__body">{{ label() }}</span>
      }
      @if (dismissible()) {
        <button
          class="chip__dismiss"
          [attr.aria-label]="'Remove ' + label()"
          [disabled]="disabled() || null"
          (click)="onDismiss()"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      }
    </span>
  `,
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent {
  label = input('');
  variant = input<ChipVariant>('default');
  selectable = input(false);
  dismissible = input(false);
  disabled = input(false);
  selected = model(false);

  dismissed = output<void>();

  onToggle(): void {
    if (this.disabled()) return;
    this.selected.set(!this.selected());
  }

  onDismiss(): void {
    if (this.disabled()) return;
    this.dismissed.emit();
  }
}
