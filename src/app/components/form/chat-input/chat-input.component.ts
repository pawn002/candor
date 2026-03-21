import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
  @Input() placeholder = 'Message…';
  @Input() label = 'Message';
  @Input() disclaimer?: string;
  @Input() disabled = false;

  @Output() send = new EventEmitter<string>();

  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  value = '';

  private _id = `chat-input-${Math.random().toString(36).slice(2, 9)}`;
  get inputId() { return this._id; }

  onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.value = el.value;
    this.autoGrow(el);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }

  onSend(): void {
    const trimmed = this.value.trim();
    if (!trimmed || this.disabled) return;
    this.send.emit(trimmed);
    this.value = '';
    if (this.textareaRef) {
      this.textareaRef.nativeElement.value = '';
      this.autoGrow(this.textareaRef.nativeElement);
    }
  }

  private autoGrow(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
