import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ButtonComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <dialog
      #dialog
      class="modal"
      [attr.aria-labelledby]="titleId"
      [attr.aria-modal]="true"
      (click)="onBackdropClick($event)"
      (close)="onDialogClose()"
      (cancel)="onDialogClose()"
    >
      <div [class]="'modal__panel modal__panel--' + size">
        <header class="modal__header">
          <h2 class="modal__title" [id]="titleId">{{ title }}</h2>
          <button class="modal__close" type="button" aria-label="Close" (click)="close()">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </header>

        <div class="modal__body" tabindex="0">
          <ng-content></ng-content>
        </div>

        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </dialog>
  `,
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit, OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';

  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') private dialogRef!: ElementRef<HTMLDialogElement>;

  readonly titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;

  ngAfterViewInit(): void {
    if (this.open) {
      this.dialogRef.nativeElement.showModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.dialogRef) return;
    if (changes['open']) {
      if (this.open) {
        this.dialogRef.nativeElement.showModal();
      } else {
        this.dialogRef.nativeElement.close();
      }
    }
  }

  close(): void {
    this.dialogRef.nativeElement.close();
  }

  onDialogClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef.nativeElement) {
      this.close();
    }
  }
}
