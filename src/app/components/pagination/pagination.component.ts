import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="ariaLabel()" class="pagination">
      <button
        class="pagination__btn pagination__prev"
        [disabled]="currentPage() <= 1"
        aria-label="Previous page"
        (click)="goTo(currentPage() - 1)"
      >
        <i class="ph ph-caret-left" aria-hidden="true"></i>
      </button>

      @for (item of pages(); track item) {
        @if (isEllipsis(item)) {
          <span class="pagination__ellipsis" aria-hidden="true">…</span>
        } @else {
          <button
            class="pagination__btn pagination__page"
            [class.pagination__btn--current]="item === currentPage()"
            [attr.aria-current]="item === currentPage() ? 'page' : null"
            [attr.aria-label]="'Page ' + item"
            (click)="goTo(asNumber(item))"
          >{{ item }}</button>
        }
      }

      <button
        class="pagination__btn pagination__next"
        [disabled]="currentPage() >= totalPages()"
        aria-label="Next page"
        (click)="goTo(currentPage() + 1)"
      >
        <i class="ph ph-caret-right" aria-hidden="true"></i>
      </button>
    </nav>
  `,
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  currentPage = model<number>(1);
  totalPages = input<number>(1);
  /** Accessible label for the nav landmark. Customize when multiple paginators appear on the same page. */
  ariaLabel = input<string>('Pagination');

  pages = computed<PageItem[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    // No ellipsis needed for small page counts
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const items: PageItem[] = [1];

    if (current > 3) {
      items.push('ellipsis-start');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (current < total - 2) {
      items.push('ellipsis-end');
    }

    items.push(total);
    return items;
  });

  isEllipsis(item: PageItem): boolean {
    return typeof item === 'string';
  }

  asNumber(item: PageItem): number {
    return item as number;
  }

  goTo(page: number): void {
    const clamped = Math.max(1, Math.min(page, this.totalPages()));
    this.currentPage.set(clamped);
  }
}
