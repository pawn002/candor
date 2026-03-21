import { Component, Input, Output, EventEmitter } from '@angular/core';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div [class]="'toast toast--' + variant" [attr.role]="variant === 'warning' || variant === 'error' ? 'alert' : 'status'">
      <svg class="toast__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        @switch (variant) {
          @case ('info') {
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          }
          @case ('success') {
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          }
          @case ('warning') {
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          }
          @case ('error') {
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          }
        }
      </svg>
      <div class="toast__content">
        @if (title) {
          <div class="toast__title">{{ title }}</div>
        }
        <div class="toast__message">{{ message }}</div>
      </div>
      @if (dismissible) {
        <button class="toast__dismiss" (click)="dismiss()" aria-label="Dismiss notification">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      }
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() variant: ToastVariant = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() dismissible = true;

  @Output() dismissed = new EventEmitter<void>();

  dismiss(): void {
    this.dismissed.emit();
  }
}
