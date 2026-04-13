import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  heading?: string;
  duration: number; // ms; 0 = persistent until dismissed
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(
    message: string,
    variant: ToastVariant = 'info',
    options: { heading?: string; duration?: number } = {}
  ): string {
    const id = `toast-${Math.random().toString(36).slice(2, 9)}`;
    const duration = options.duration ?? 5000;

    this.toasts.update(list => [
      ...list,
      { id, message, variant, heading: options.heading, duration },
    ]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
