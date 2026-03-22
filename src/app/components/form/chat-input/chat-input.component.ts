import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
  placeholder = input('Message…');
  label = input('Message');
  disclaimer = input<string>();
  disabled = input(false);

  send = output<string>();

  private textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

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
    if (!trimmed || this.disabled()) return;
    this.send.emit(trimmed);
    this.value = '';
    const ref = this.textareaRef();
    if (ref) {
      ref.nativeElement.value = '';
      this.autoGrow(ref.nativeElement);
    }
  }

  private autoGrow(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
