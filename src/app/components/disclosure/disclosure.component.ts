import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-disclosure',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="disclosure">
      <button
        class="disclosure__trigger"
        [id]="triggerId"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="panelId"
        (click)="toggle()"
      >
        <span class="disclosure__label">{{ label() }}</span>
        <i
          class="ph ph-caret-down disclosure__icon"
          [class.disclosure__icon--open]="open()"
          aria-hidden="true"
        ></i>
      </button>

      <div
        class="disclosure__panel"
        [id]="panelId"
        [hidden]="!open()"
      >
        <div class="disclosure__content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./disclosure.component.scss'],
})
export class DisclosureComponent {
  label = input<string>('');
  /** Controls the open/closed state. Use `[(open)]` for two-way binding. */
  open = model<boolean>(false);

  private _id = nextId++;
  readonly triggerId = `disclosure-trigger-${this._id}`;
  readonly panelId = `disclosure-panel-${this._id}`;

  toggle(): void {
    this.open.set(!this.open());
  }
}
