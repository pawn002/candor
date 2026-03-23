import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'tabpanel',
    '[id]': '"panel-" + tabId()',
    '[attr.aria-labelledby]': '"tab-" + tabId()',
    '[hidden]': '!active()',
    '[tabindex]': 'active() ? 0 : -1',
  }
})
export class TabPanelComponent {
  tabId = input('');
  label = input('');

  // Writable signal — TabsComponent drives active state via setActive()
  protected active = signal(false);

  setActive(value: boolean): void {
    this.active.set(value);
  }
}
