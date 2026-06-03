import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { phPaperPlaneTiltFill } from '../../../icons';

let _nextId = 0;

@customElement('candor-chat-input')
export class CandorChatInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .sr-only {
      position: absolute; width: 1px; height: 1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;
    }
    .chat-input { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .chat-input__label {
      position: absolute; width: 1px; height: 1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;
    }
    .chat-input__field {
      display: flex; align-items: flex-end; gap: 0.625rem;
      background: var(--color-bg-elevated);
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--radius-md);
      padding: 0.625rem 0.625rem 0.625rem 1rem;
      transition: border-color 0.15s ease;
    }
    .chat-input__field:focus-within {
      border-color: var(--color-action-primary);
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .chat-input__field--disabled { opacity: 0.5; cursor: not-allowed; }
    .chat-input__textarea {
      flex: 1; background: transparent; border: none; outline: none;
      resize: none; overflow-y: auto; padding: 0;
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); line-height: var(--line-height-normal);
      min-height: 1.5rem; max-height: 8rem;
    }
    .chat-input__textarea::placeholder { color: var(--color-text-subtle); }
    .chat-input__textarea:focus { outline: none; }
    .chat-input__textarea:disabled { cursor: not-allowed; }
    .chat-input__send {
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; width: 2rem; height: 2rem;
      background: var(--color-action-primary); color: var(--color-text-on-action);
      border: none; border-radius: var(--radius-sm); cursor: pointer;
      transition: background-color 0.15s ease, opacity 0.15s ease;
    }
    .chat-input__send:hover:not(:disabled) { background: var(--color-action-primary-hover); }
    .chat-input__send:active:not(:disabled) { background: var(--color-action-primary-active); }
    .chat-input__send:disabled { opacity: 0.5; cursor: not-allowed; }
    .chat-input__send:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .chat-input__send svg { width: 1rem; height: 1rem; }
    .chat-input__disclaimer {
      margin: 0; text-align: center;
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      color: var(--color-text-subtle); letter-spacing: 0.02em;
      line-height: var(--line-height-normal);
    }
  `;

  @property() label = 'Message';
  @property() placeholder = 'Type a message…';
  @property() disclaimer = '';
  @property({ type: Boolean }) disabled = false;

  @state() private _value = '';
  @state() private _statusMessage = '';

  @query('.chat-input__textarea') private _textarea!: HTMLTextAreaElement;

  private _id = _nextId++;
  private _inputId = `candor-chat-input-${this._id}`;
  private _hintId = `candor-chat-hint-${this._id}`;

  private _onInput(e: Event) {
    this._value = (e.target as HTMLTextAreaElement).value;
    // Auto-grow
    const el = e.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._send();
    }
  }

  private _send() {
    if (!this._value.trim() || this.disabled) return;
    this.dispatchEvent(new CustomEvent('send', {
      detail: { value: this._value },
      bubbles: true,
      composed: true,
    }));
    this._value = '';
    if (this._textarea) {
      this._textarea.value = '';
      this._textarea.style.height = 'auto';
    }
    this._statusMessage = 'Message sent';
    setTimeout(() => { this._statusMessage = ''; }, 2000);
  }

  override render() {
    return html`
      <div class="chat-input">
        <label for="${this._inputId}" class="chat-input__label">${this.label}</label>
        <span id="${this._hintId}" class="sr-only">Press Enter to send. Press Shift+Enter for a new line.</span>
        <div class="chat-input__field ${this.disabled ? 'chat-input__field--disabled' : ''}">
          <textarea
            id="${this._inputId}"
            class="chat-input__textarea"
            placeholder="${this.placeholder}"
            ?disabled="${this.disabled}"
            .value="${this._value}"
            aria-describedby="${this._hintId}${this.disclaimer ? ' ' + this._inputId + '-disclaimer' : ''}"
            rows="1"
            @input="${this._onInput}"
            @keydown="${this._onKeydown}"
          ></textarea>
          <button
            type="button"
            class="chat-input__send"
            ?disabled="${this.disabled || !this._value.trim()}"
            aria-label="Send message"
            @click="${this._send}"
          >
            <svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phPaperPlaneTiltFill}"/></svg>
          </button>
        </div>
        ${this.disclaimer
          ? html`<p id="${this._inputId}-disclaimer" class="chat-input__disclaimer">${this.disclaimer}</p>`
          : nothing}
        <span role="status" class="sr-only" aria-live="polite" aria-atomic="true">${this._statusMessage}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-chat-input': CandorChatInput; }
}
