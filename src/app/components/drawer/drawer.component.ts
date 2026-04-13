import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

export type DrawerPosition = 'left' | 'right' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

let nextId = 0;

@Component({
  selector: 'app-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <dialog
      #dialog
      [class]="'drawer drawer--' + position() + ' drawer--' + size()"
      [attr.aria-labelledby]="heading() ? headingId : null"
      [attr.aria-label]="heading() ? null : 'Drawer'"
      (click)="onBackdropClick($event)"
      (cancel)="onCancel($event)"
      (close)="onDialogClose()"
    >
      <div class="drawer__panel">
        <!-- role="none" suppresses the implicit banner landmark Chrome assigns to <header> inside <dialog> -->
        <header class="drawer__header" role="none">
          @if (heading()) {
            <h2 class="drawer__title" [id]="headingId">{{ heading() }}</h2>
          }
          <button class="drawer__close" type="button" aria-label="Close" (click)="close()">
            <i class="ph-fill ph-x" aria-hidden="true"></i>
          </button>
        </header>

        <div class="drawer__body" tabindex="0" aria-label="Drawer content">
          <ng-content></ng-content>
        </div>

        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </dialog>
  `,
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  open = input(false);
  heading = input('');
  position = input<DrawerPosition>('right');
  size = input<DrawerSize>('md');
  /** When true, clicking the backdrop closes the drawer. */
  dismissOnBackdrop = input(true);

  closed = output<void>();

  private dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  readonly headingId = `drawer-title-${nextId++}`;

  constructor() {
    effect(() => {
      const dialog = this.dialogRef()?.nativeElement;
      if (!dialog) return;
      this.open() ? dialog.showModal() : dialog.close();
    });
  }

  close(): void {
    this.dialogRef()?.nativeElement.close();
  }

  onCancel(event: Event): void {
    // Prevent the browser from closing the dialog natively on Escape —
    // we want the closed output to be the single signal back to the parent.
    event.preventDefault();
    this.close();
  }

  onDialogClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.dismissOnBackdrop()) return;
    // The click target is the <dialog> element itself (the transparent backdrop area),
    // not the inner panel.
    if (event.target === this.dialogRef()?.nativeElement) {
      this.close();
    }
  }
}
