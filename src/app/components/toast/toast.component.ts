import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'toast toast--' + variant()" [attr.role]="variant() === 'warning' || variant() === 'error' ? 'alert' : 'status'">
      @switch (variant()) {
        @case ('info')    { <i class="ph ph-info toast__icon" aria-hidden="true"></i> }
        @case ('success') { <i class="ph ph-check-circle toast__icon" aria-hidden="true"></i> }
        @case ('warning') { <i class="ph ph-warning toast__icon" aria-hidden="true"></i> }
        @case ('error')   { <i class="ph ph-x-circle toast__icon" aria-hidden="true"></i> }
      }
      <div class="toast__content">
        @if (heading()) {
          <div class="toast__title">{{ heading() }}</div>
        }
        <div class="toast__message">{{ message() }}</div>
      </div>
      @if (dismissible()) {
        <button class="toast__dismiss" (click)="dismiss()" aria-label="Dismiss notification">
          <i class="ph-fill ph-x" aria-hidden="true"></i>
        </button>
      }
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  variant = input<ToastVariant>('info');
  heading = input('');
  message = input('');
  dismissible = input(true);

  dismissed = output<void>();

  dismiss(): void {
    this.dismissed.emit();
  }
}
