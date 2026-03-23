import { ChangeDetectionStrategy, Component, HostListener, input, signal } from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

// Tooltips in Candor are intentionally hidden from assistive technology.
// They are a visual affordance for pointer/sighted users only.
// The trigger element — button, link, or input — must be self-describing
// via its accessible name and label. Tooltips are a last resort for
// supplementary context that would otherwise require a persistent label.
@Component({
  selector: 'app-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
    <div
      aria-hidden="true"
      class="tooltip__bubble"
      [class]="'tooltip__bubble tooltip__bubble--' + position()"
      [class.tooltip__bubble--visible]="visible()"
    >{{ text() }}</div>
  `,
  styleUrls: ['./tooltip.component.scss'],
  host: {
    class: 'tooltip',
  },
})
export class TooltipComponent {
  text = input('');
  position = input<TooltipPosition>('top');

  protected visible = signal(false);

  @HostListener('mouseenter') onMouseEnter(): void { this.visible.set(true); }
  @HostListener('mouseleave') onMouseLeave(): void { this.visible.set(false); }
  @HostListener('focusin') onFocusIn(): void { this.visible.set(true); }
  @HostListener('focusout') onFocusOut(): void { this.visible.set(false); }
  @HostListener('keydown.escape') onEscape(): void { this.visible.set(false); }
}
