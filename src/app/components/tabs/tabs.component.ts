import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TabPanelComponent } from './tab-panel.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs">
      <div class="tabs__list" role="tablist" [attr.aria-label]="ariaLabel() || null">
        @for (panel of panels(); track panel.tabId()) {
          <button
            class="tabs__tab"
            role="tab"
            [id]="'tab-' + panel.tabId()"
            [attr.aria-selected]="panel.tabId() === activeId()"
            [attr.aria-controls]="'panel-' + panel.tabId()"
            [tabindex]="panel.tabId() === activeId() ? 0 : -1"
            (click)="activate(panel.tabId())"
          >{{ panel.label() }}</button>
        }
      </div>
      <div class="tabs__panels">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  panels = contentChildren(TabPanelComponent);

  ariaLabel = input('');
  activeId = signal('');
  tabChange = output<string>();

  private el = inject(ElementRef);

  constructor() {
    // Sync panel visibility whenever activeId or panels change
    effect(() => {
      const id = this.activeId();
      this.panels().forEach(p => p.setActive(p.tabId() === id));
    });
  }

  ngAfterContentInit(): void {
    if (!this.activeId() && this.panels().length > 0) {
      this.activeId.set(this.panels()[0].tabId());
    }
  }

  activate(id: string): void {
    this.activeId.set(id);
    this.tabChange.emit(id);

    const tabButton = this.el.nativeElement.querySelector(`#tab-${id}`);
    if (tabButton) {
      tabButton.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') !== 'tab') return;

    const panelIds = this.panels().map(p => p.tabId());
    const currentIndex = panelIds.indexOf(this.activeId());

    let newIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % panelIds.length;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + panelIds.length) % panelIds.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = panelIds.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.activate(panelIds[newIndex]);
  }
}
