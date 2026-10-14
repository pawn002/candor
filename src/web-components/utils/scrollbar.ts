import { unsafeCSS, type CSSResult } from 'lit';

/**
 * Candor's scrollbar (#307): a thin-looking bar inside a grab area the size of
 * an AA target (WCAG 2.5.8).
 *
 * The visible bar is the thumb's background, clipped to its padding box. Its
 * transparent border is the spacing around it, and that border is part of the
 * thumb, so the whole `--scrollbar-size` box can be grabbed, not just the 6px
 * you see. The gap is larger on the content side than on the outer edge,
 * because the eye measures from the content and the outer edge is a hard line.
 *
 * Every value is a token. The content-side gap is whatever `--scrollbar-size`
 * leaves after the bar and the outer gap, so a change to `--hit-target-aa`
 * widens the grab area without changing how the bar looks.
 *
 * Two internal hooks let a scroller on an unusual background recolour the
 * thumb: `--_candor-scrollbar-thumb` and `--_candor-scrollbar-thumb-hover`.
 * `candor-article` uses them for code blocks, whose navy background the
 * default grey does not clear. They are not public API.
 *
 * Chromium, WebKit and Blink-based browsers draw this through
 * `::-webkit-scrollbar`, the only way to separate the size of the grab area
 * from the size of the bar. Firefox has no such pseudo-element, so it gets the
 * standard `scrollbar-color` instead: the same colours at the platform's width.
 * The standard property is withheld where the pseudo-element exists, because
 * setting it switches the pseudo-element off in Chromium.
 *
 * Pass the selector of an element inside the shadow root, never `:host`: the
 * per-axis thumb rules do not reach a host's own scrollbar, so the bar draws as
 * a flat block filling the whole grab area.
 *
 * Every component whose styles scroll must use this (`npm run audit:docs`).
 */
export function scrollbarRules(selector: string): string {
  const s = selector;
  const thumb = 'var(--_candor-scrollbar-thumb, var(--color-border-control))';
  const hover = 'var(--_candor-scrollbar-thumb-hover, var(--color-text-subtle))';
  const half = 'calc(var(--scrollbar-thumb-size) / 2)';
  const outer = 'var(--scrollbar-inset-outer)';
  const inner = 'calc(var(--scrollbar-size) - var(--scrollbar-thumb-size) - var(--scrollbar-inset-outer))';
  // Radii are given per axis so the visible bar, not its border box, is a pill.
  const r = (gap: string) => `calc(${gap} + ${half})`;
  return `
    ${s}::-webkit-scrollbar { width: var(--scrollbar-size); height: var(--scrollbar-size); }
    ${s}::-webkit-scrollbar-track { background: transparent; }
    ${s}::-webkit-scrollbar-track:vertical { margin: var(--radius-md) 0; }
    ${s}::-webkit-scrollbar-track:horizontal { margin: 0 var(--radius-md); }
    ${s}::-webkit-scrollbar-button { display: none; }
    ${s}::-webkit-scrollbar-corner { background: transparent; }
    ${s}::-webkit-scrollbar-thumb {
      background-color: ${thumb};
      background-clip: padding-box;
      border: 0 solid transparent;
    }
    ${s}::-webkit-scrollbar-thumb:hover,
    ${s}::-webkit-scrollbar-thumb:active { background-color: ${hover}; }
    ${s}::-webkit-scrollbar-thumb:horizontal {
      border-width: ${inner} 0 ${outer};
      border-radius: ${half} / ${r(inner)} ${r(inner)} ${r(outer)} ${r(outer)};
    }
    ${s}::-webkit-scrollbar-thumb:vertical {
      border-width: 0 ${outer} 0 ${inner};
      border-radius: ${r(inner)} ${r(outer)} ${r(outer)} ${r(inner)} / ${half};
    }
    ${s}:dir(rtl)::-webkit-scrollbar-thumb:vertical {
      border-width: 0 ${inner} 0 ${outer};
      border-radius: ${r(outer)} ${r(inner)} ${r(inner)} ${r(outer)} / ${half};
    }
    @supports not selector(::-webkit-scrollbar) {
      ${s} { scrollbar-color: ${thumb} transparent; }
    }
  `;
}

/** `scrollbarRules` as a Lit `CSSResult`, for a component's `static styles`. */
export function scrollbarStyles(selector: string): CSSResult {
  return unsafeCSS(scrollbarRules(selector));
}
