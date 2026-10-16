import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { decodePng } from './support/png';

/**
 * Four WCAG 2.2 AA criteria that axe-core cannot decide, measured on every story
 * (#252). Each was "Not evaluated" in `docs/ACCESSIBILITY-CONFORMANCE.md`, or
 * supported only by a review that nothing re-checked.
 *
 * - **1.4.10 Reflow.** At 320 CSS px wide, the page does not scroll sideways.
 *   Tables, grids and code blocks may scroll inside their own box, which the
 *   criterion allows for two-dimensional content, so only the page is measured.
 * - **1.4.12 Text Spacing.** With the criterion's spacing applied to every element,
 *   in every shadow root, no text is newly clipped by an `overflow: hidden` or
 *   `clip` box. Text that spills out of a box it no longer fits is not caught:
 *   spill is only a loss when it lands on something, and that takes a person.
 * - **2.4.7 Focus Visible.** Each Tab stop looks different focused and unfocused,
 *   compared in pixels around the focused element and its component.
 * - **2.4.11 Focus Not Obscured (Minimum).** At each Tab stop, the focused
 *   component is not entirely covered by something else. This found the
 *   combobox and autocomplete lists staying open over the next field.
 *
 * Transitions are switched off before measuring, so a focus ring that fades in
 * is measured as it ends rather than mid-fade.
 *
 * One test per criterion, one step per story, for the reason given in
 * `axe.spec.ts`: the story list is only known once Storybook is up.
 */

const MIN_STORIES = 200;

async function storyIds(request: APIRequestContext): Promise<string[]> {
  const index = await (await request.get('/index.json')).json();
  const ids = (Object.values(index.entries) as { id: string; type: string }[])
    .filter((e) => e.type === 'story')
    .map((e) => e.id)
    .sort();
  expect(ids.length, 'story discovery found too few stories; the index read is broken').toBeGreaterThanOrEqual(MIN_STORIES);
  return ids;
}

async function load(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`);
  await page.waitForSelector('#storybook-root > *', { timeout: 10_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

/** Add a stylesheet to the document and to every shadow root under it. */
async function injectEverywhere(page: Page, css: string) {
  await page.evaluate((text) => {
    const walk = (root: Document | ShadowRoot) => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(text);
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      for (const el of root.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(document);
  }, css);
}

/**
 * Known losses, each with its reason. One that stops matching fails, so the list
 * cannot outlive what it records.
 */
const SPACING_EXCEPTIONS: { story: string; element: string; reason: string }[] = [
  ...['examples-article-example--post-listing', 'examples-article-example--post-listing-grid'].map((story) => ({
    story,
    element: 'p.post-card__excerpt',
    reason: 'A teaser clamped to a set number of lines by design. Wider spacing clamps it sooner; the full text is the linked post.',
  })),
];

test('1.4.10 Reflow: no story scrolls sideways at 320px', async ({ page, request }) => {
  test.setTimeout(30 * 60_000);
  await page.setViewportSize({ width: 320, height: 640 });
  for (const id of await storyIds(request)) {
    await test.step(id, async () => {
      await load(page, id);
      const r = await page.evaluate(() => {
        const over = document.documentElement.scrollWidth - innerWidth;
        const wide: string[] = [];
        if (over > 0) {
          const walk = (root: Document | ShadowRoot, path: string) => {
            for (const el of root.querySelectorAll('*')) {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.right > innerWidth + 1) wide.push(`${path}${el.tagName.toLowerCase()}.${[...el.classList].join('.')} (right edge ${Math.round(rect.right)}px)`);
              if (el.shadowRoot) walk(el.shadowRoot, `${path}${el.tagName.toLowerCase()} >> `);
            }
          };
          walk(document, '');
        }
        return { over, wide: wide.slice(-4) };
      });
      expect.soft(r.over, `${id}: the page scrolls ${r.over}px sideways at 320px. Widest:\n  ${r.wide.join('\n  ')}`).toBeLessThanOrEqual(0);
    });
  }
});

test('1.4.12 Text Spacing: no text is clipped under the criterion\'s spacing', async ({ page, request }) => {
  test.setTimeout(30 * 60_000);
  await page.setViewportSize({ width: 1024, height: 768 });
  const used = new Set<string>();
  for (const id of await storyIds(request)) {
    await test.step(id, async () => {
      await load(page, id);
      // Record how far each box already overflows, apply the spacing, then compare.
      await page.evaluate(() => {
        const els: Element[] = [];
        const scope = document.getElementById('storybook-root');
        const walk = (root: Element | ShadowRoot) => {
          for (const el of root.querySelectorAll('*')) { els.push(el); if (el.shadowRoot) walk(el.shadowRoot); }
        };
        if (scope) walk(scope);
        const state = (el: Element) => {
          const cs = getComputedStyle(el);
          if (['inline', 'contents', 'none'].includes(cs.display)) return null;
          return { x: el.scrollWidth - el.clientWidth, y: el.scrollHeight - el.clientHeight, ox: cs.overflowX, oy: cs.overflowY };
        };
        (window as any).__spacing = { els, before: els.map(state), state };
      });
      await injectEverywhere(page,
        '*, *::before, *::after { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }' +
        ' p { margin-bottom: 2em !important; }');
      await page.waitForTimeout(100);
      const clipped = await page.evaluate(() => {
        const { els, before, state } = (window as any).__spacing as { els: Element[]; before: any[]; state: (el: Element) => any };
        const clips = (o: string) => o === 'hidden' || o === 'clip';
        // Text no one sees is outside the criterion: the 1px screen-reader-only
        // pattern clips by design, and so does anything inside it.
        // Text as rendered: through shadow roots and into what slots show, since
        // a shadow element's textContent leaves out slotted text.
        const hasText = (n: Node): boolean => {
          if (n.nodeType === 3) return !!n.textContent?.trim();
          if (n instanceof HTMLSlotElement) return n.assignedNodes({ flatten: true }).some(hasText);
          const kids = [...((n as Element).shadowRoot?.childNodes ?? []), ...n.childNodes];
          return kids.some(hasText);
        };
        const unseen = (el: Element) => {
          for (let m: any = el; m && m.nodeType === 1; m = m.parentNode instanceof ShadowRoot ? m.parentNode.host : m.parentNode) {
            const r = m.getBoundingClientRect();
            if (r.width <= 1 || r.height <= 1) return true;
          }
          return false;
        };
        const out: string[] = [];
        els.forEach((el, i) => {
          const a = state(el);
          const b = before[i];
          if (!a || !b || !hasText(el) || unseen(el)) return;
          // More hidden than before, by over a pixel. A box that already clipped a
          // little is not excused from clipping more.
          if ((a.x - b.x > 1 && clips(a.ox)) || (a.y - b.y > 1 && clips(a.oy))) {
            let n: Node | null = el;
            while (n && !(n instanceof ShadowRoot)) n = n.parentNode;
            out.push(`${n ? (n as ShadowRoot).host.tagName.toLowerCase() + ' >> ' : ''}${el.tagName.toLowerCase()}${[...el.classList].map((c) => '.' + c).join('')}`);
          }
        });
        return [...new Set(out)];
      });
      for (const el of clipped) {
        const ex = SPACING_EXCEPTIONS.find((e) => e.story === id && el.endsWith(e.element));
        if (ex) { used.add(`${id}|${ex.element}`); continue; }
        expect.soft(el, `${id}: text in ${el} is clipped once text spacing is increased`).toBeUndefined();
      }
    });
  }
  for (const ex of SPACING_EXCEPTIONS) {
    expect.soft(used.has(`${ex.story}|${ex.element}`), `stale exception: ${ex.element} is no longer clipped on ${ex.story}; remove it`).toBe(true);
  }
});

test('2.4.7 Focus Visible and 2.4.11 Focus Not Obscured: every Tab stop', async ({ page, request }) => {
  test.setTimeout(60 * 60_000);
  const VW = 1024, VH = 768, PAD = 6, MAX_STOPS = 12;
  // Changed pixels around a focused element below which focus is not visible.
  // A 2px ring around the smallest control here changes several hundred.
  const MIN_CHANGED = 40;
  await page.setViewportSize({ width: VW, height: VH });
  let stops = 0;
  for (const id of await storyIds(request)) {
    await test.step(id, async () => {
      await load(page, id);
      await injectEverywhere(page, '*, *::before, *::after { transition: none !important; animation: none !important; }');
      await page.mouse.move(0, 0);
      const seen = new Set<string>();
      for (let i = 0; i < MAX_STOPS; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);
        const info = await page.evaluate(() => {
          let a: any = document.activeElement;
          while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
          if (!a || a === document.body) return null;
          let n: any = a;
          while (n && !(n instanceof ShadowRoot) && n !== document) n = n.parentNode;
          const host: Element = n instanceof ShadowRoot ? n.host : a;
          const r1 = a.getBoundingClientRect();
          const r2 = host.getBoundingClientRect();
          const name = `${host !== a ? host.tagName.toLowerCase() + ' >> ' : ''}${a.tagName.toLowerCase()}${a.getAttribute('aria-label') ? `[${a.getAttribute('aria-label')}]` : ''}`;
          // 2.4.11: is any of the focused component still showing? Sample its
          // centre and four inset points; a hit inside the component counts.
          const inside = (hit: Element | null) => {
            for (let m: any = hit; m; m = m.parentNode || m.host) if (m === host || m === a) return true;
            return false;
          };
          const deepHit = (x: number, y: number) => {
            let h: any = document.elementFromPoint(x, y);
            while (h?.shadowRoot) { const d = h.shadowRoot.elementFromPoint(x, y); if (!d || d === h) break; h = d; }
            return h as Element | null;
          };
          // A link that wraps has one box per line, and its bounding box is
          // mostly the paragraph around it, so sample the middle of each line.
          const lines = [...a.getClientRects()] as DOMRect[];
          const box = r1.width >= 4 && r1.height >= 4 ? r1 : r2;
          const pts = (lines.length > 1
            ? lines.slice(0, 4).map((l) => [l.left + l.width / 2, l.top + l.height / 2])
            : [[0.5, 0.5], [0.2, 0.2], [0.8, 0.2], [0.2, 0.8], [0.8, 0.8]].map(([fx, fy]) => [box.left + box.width * fx, box.top + box.height * fy]))
            .filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
          const covers = pts.map(([x, y]) => deepHit(x, y)).filter((h) => !inside(h));
          const coveredBy = pts.length && covers.length === pts.length && covers[0]
            ? `${covers[0].tagName.toLowerCase()}${[...covers[0].classList].map((c) => '.' + c).join('')}` : '';
          (window as any).__focused = a;
          return {
            key: `${name}@${Math.round(r1.left)},${Math.round(r1.top + scrollY)}`,
            name, coveredBy,
            x: Math.min(r1.left, r2.left), y: Math.min(r1.top, r2.top),
            r: Math.max(r1.right, r2.right), b: Math.max(r1.bottom, r2.bottom),
          };
        });
        if (!info || seen.has(info.key)) break;
        seen.add(info.key);
        stops++;
        expect.soft(info.coveredBy, `${id}: focused ${info.name} is entirely covered by ${info.coveredBy} (2.4.11)`).toBe('');

        const clip = { x: Math.max(0, info.x - PAD), y: Math.max(0, info.y - PAD), width: 0, height: 0 };
        clip.width = Math.min(VW, info.r + PAD) - clip.x;
        clip.height = Math.min(VH, info.b + PAD) - clip.y;
        if (clip.width < 1 || clip.height < 1) continue; // off screen: nothing to compare
        const on = decodePng(await page.screenshot({ clip, scale: 'css' }));
        await page.evaluate(() => (window as any).__focused.blur());
        const off = decodePng(await page.screenshot({ clip, scale: 'css' }));
        // Programmatic focus after keyboard use keeps :focus-visible, so Tab
        // carries on from here.
        await page.evaluate(() => (window as any).__focused.focus());
        let changed = 0;
        for (let y = 0; y < Math.min(on.height, off.height); y++) {
          for (let x = 0; x < Math.min(on.width, off.width); x++) {
            const p = on.px(x, y), q = off.px(x, y);
            if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) > 60) changed++;
          }
        }
        expect.soft(changed, `${id}: focus on ${info.name} changes ${changed}px, so it is not visible (2.4.7)`).toBeGreaterThanOrEqual(MIN_CHANGED);
      }
    });
  }
  // A floor, so a broken Tab walk fails rather than passing having checked nothing.
  expect(stops, 'too few Tab stops reached; the focus walk is broken').toBeGreaterThanOrEqual(400);
});
