import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { phX } from '../../icons';

type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

@customElement('candor-chip')
export class CandorChip extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      border-radius: var(--radius-full);
      border: var(--border-width-thin) solid var(--color-border-strong);
      background-color: var(--color-bg-surface);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      letter-spacing: 0.06em;
      overflow: hidden;
    }
    .chip:has(:focus-visible) { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .chip--primary   { border-color: var(--color-action-primary); background-color: oklch(from var(--color-action-primary) l c h / 0.08); }
    .chip--secondary { border-color: var(--color-action-secondary); background-color: oklch(from var(--color-action-secondary) l c h / 0.08); }
    .chip--success   { border-color: var(--color-status-success); background-color: var(--color-status-success-bg); }
    .chip--warning   { border-color: var(--color-status-warning); background-color: var(--color-status-warning-bg); }
    .chip--error     { border-color: var(--color-status-error); background-color: var(--color-status-error-bg); }
    .chip--selected  { border-color: var(--color-action-primary); background-color: var(--color-action-primary); }
    .chip--selected .chip__body { color: var(--color-text-on-action); }
    .chip--selected .chip__dismiss { color: var(--color-text-on-action); }
    .chip--disabled  { opacity: 0.5; cursor: not-allowed; }
    .chip__body {
      padding: 0.25rem 0.625rem;
      color: var(--color-text-default);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
    }
    .chip__body--button {
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      letter-spacing: inherit;
    }
    .chip__body--button:not(:disabled):hover { background-color: oklch(from var(--color-action-primary) l c h / 0.06); }
    .chip__body--link { text-decoration: none; font-family: inherit; font-size: inherit; letter-spacing: inherit; transition: background-color 0.15s ease, color 0.15s ease; }
    .chip__body--link:hover { background-color: oklch(from var(--color-action-primary) l c h / 0.06); color: var(--color-text-default); }
    .chip__dismiss {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.25rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: var(--radius-full);
      color: var(--color-text-subtle);
      flex-shrink: 0;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .chip__dismiss svg { width: 0.625rem; height: 0.625rem; }
    .chip__dismiss:hover { background-color: oklch(from var(--color-action-primary) l c h / 0.12); color: var(--color-text-default); }
  `;

  @property() label = '';
  @property({ reflect: true }) variant: ChipVariant = 'default';
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ attribute: 'link-href' }) linkHref?: string;

  private _onToggle() {
    if (this.disabled) return;
    this.selected = !this.selected;
    this.dispatchEvent(new CustomEvent('selected-change', { detail: this.selected, bubbles: true, composed: true }));
  }

  private _onDismiss() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('dismissed', { bubbles: true, composed: true }));
  }

  override render() {
    const cls = [
      'chip',
      `chip--${this.variant}`,
      this.selected ? 'chip--selected' : '',
      this.disabled ? 'chip--disabled' : '',
    ].filter(Boolean).join(' ');

    const body = this.linkHref
      ? html`<a class="chip__body chip__body--link" href="${this.linkHref}">${this.label}</a>`
      : this.selectable
        ? html`<button class="chip__body chip__body--button" aria-pressed="${this.selected}" ?disabled="${this.disabled}" @click="${this._onToggle}">${this.label}</button>`
        : html`<span class="chip__body">${this.label}</span>`;

    return html`
      <span class="${cls}">
        ${body}
        ${this.dismissible && !this.linkHref ? html`
          <button class="chip__dismiss" aria-label="Remove ${this.label}" ?disabled="${this.disabled}" @click="${this._onDismiss}">
            <svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phX}"/></svg>
          </button>
        ` : nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-chip': CandorChip; }
}
