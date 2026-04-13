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
  model,
  output,
} from '@angular/core';
import { TabPanelComponent } from './tab-panel.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs">
      <div class="tabs__list" role="tablist" [attr.aria-label]="ariaLabel() || null">
        @for (panel of panels(); track panel.tabId(); let i = $index) {
          <button
            class="tabs__tab"
            role="tab"
            [id]="'tab-' + panel.tabId()"
            [attr.aria-selected]="panel.tabId() === activeId()"
            [attr.aria-controls]="'panel-' + panel.tabId()"
            [attr.aria-setsize]="panels().length"
            [attr.aria-posinset]="i + 1"
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
  // activeId accepts and emits string. If binding to a parent signal, type it as
  // signal<string>('id') — not a union type like signal<'a'|'b'>('a'). Angular
  // strict template checking will raise TS2345 if the parent signal is narrower
  // than string, because the model emits string on change.
  activeId = model('');
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
    if (!this.ariaLabel()) {
      console.warn('TabsComponent: ariaLabel is not set. The tab list will be unlabelled, which is ambiguous when multiple tab widgets appear on the same page. Pass [ariaLabel]="\'Descriptive name\'" to fix.');
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
