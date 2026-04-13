import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <app-toast
          [variant]="toast.variant"
          [heading]="toast.heading ?? ''"
          [message]="toast.message"
          [dismissible]="true"
          (dismissed)="toastService.dismiss(toast.id)"
        ></app-toast>
      }
    </div>
  `,
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
