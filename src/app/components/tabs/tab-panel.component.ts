import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'tabpanel',
    '[id]': '"panel-" + tabId',
    '[attr.aria-labelledby]': '"tab-" + tabId',
    '[hidden]': '!active',
    '[tabindex]': 'active ? 0 : -1',
  }
})
export class TabPanelComponent {
  @Input() tabId = '';
  @Input() label = '';
  @Input() active = false;
}
