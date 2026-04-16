import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-toolbar-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="separator"
      class="toolbar-separator"
      [class.toolbar-separator--horizontal]="orientation() === 'horizontal'"
      [attr.aria-orientation]="orientation()"
    ></div>
  `,
  styleUrls: ['./toolbar-separator.component.scss'],
})
export class ToolbarSeparatorComponent {
  // 'vertical' = a vertical rule for use inside a horizontal toolbar (default).
  // 'horizontal' = a horizontal rule for use inside a vertical toolbar.
  orientation = input<'vertical' | 'horizontal'>('vertical');
}
