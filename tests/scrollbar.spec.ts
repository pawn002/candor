import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { test, expect, type ElementHandle, type Page } from '@playwright/test';

/**
 * Every scroller draws Candor's scrollbar: a `--scrollbar-thumb-size` bar inside
 * a `--scrollbar-size` grab area that can be dragged anywhere (#307, #309).
 *
 * **Why this is a runtime test.** No other gate can see a scrollbar. Playwright
 * launches headless Chromium with `--hide-scrollbars`, so the rest of this suite
 * never renders one, and Chromatic's captures showed none in #308 either. The
 * static gates check that a component *uses* `scrollbarStyles()` (`audit:docs`)
 * and that the thumb colour clears its floor (`audit:contrast`); neither checks
 * the thing the design exists for, a grab area the size of an AA target. So this
 * file turns `--hide-scrollbars` off for itself, and checks three things per
 * scroller:
 *
 *   1. **The lane is `--scrollbar-size` wide**, resolved from the token.
 *   2. **Dragging 2px inside the outer edge scrolls.** That point is in the
 *      transparent spacing, not the visible bar, so it proves the spacing is part
 *      of the thumb.
 *   3. **The visible bar is `--scrollbar-thumb-size` thick**, counted from pixels
 *      across the lane. Lane width alone passes a flat block that fills the lane,
 *      which is what `scrollbarStyles(':host')` drew on `candor-table` in #308.
 *
 * **The subjects are derived, not listed.** A component is a scroller if its
 * source sets `overflow`, `overflow-x` or `overflow-y` to `auto` or `scroll`,
 * unless the same rule hides the scrollbar (`candor-tabs`) — the same scan as
 * `audit:docs`. What cannot be derived is how to make each one scroll, so each
 * needs a fixture below; a derived scroller with no fixture fails `discovery`,
 * so a new one cannot be skipped by forgetting this file.
 */

// Scoped to this file: the rest of the suite keeps the default.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

const COMPONENTS_DIR = join(__dirname, '..', 'src', 'web-components', 'components');

const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.startsWith('candor-') && entry.name.endsWith('.ts') && !entry.name.endsWith('.stories.ts')
      ? [full]
      : [];
  });
}

/** Tags of every component whose styles scroll. Mirrors check-docs-claims.js. */
function discoverScrollers(): string[] {
  const SCROLL_DECL = /overflow(?:-[xy])?\s*:\s*[^;{}]*\b(?:auto|scroll)\b/g;
  const tags: string[] = [];
  for (const file of walk(COMPONENTS_DIR)) {
    const src = stripComments(readFileSync(file, 'utf8'));
    const scrolls = [...src.matchAll(SCROLL_DECL)].some((m) => {
      const block = src.slice(src.lastIndexOf('{', m.index), src.indexOf('}', m.index));
      return !/scrollbar-width\s*:\s*none/.test(block);
    });
    if (!scrolls) continue;
    const tag = src.match(/@customElement\(\s*['"]([a-z-]+)['"]/)?.[1];
    if (tag) tags.push(tag);
  }
  return tags.sort();
}

interface Fixture {
  storyId: string;
  axis: 'x' | 'y';
  /**
   * Browser-side expression returning the scrolling element, run after the
   * story renders. It may open a panel or add content first. It returns the
   * element, or null if the story has not rendered it yet.
   */
  find: string;
}

const host = (tag: string, inner: string) =>
  `document.querySelector('${tag}')?.shadowRoot?.querySelector('${inner}')`;

/** How to reach each scroller. The scroller is then capped so it must overflow. */
const FIXTURES: Record<string, Fixture> = {
  'candor-toolbar': { storyId: 'components-toolbar--vertical-scrolling', axis: 'y', find: host('candor-toolbar', '.toolbar') },
  'candor-table': { storyId: 'components-table--numeric', axis: 'x', find: host('candor-table', '.table__scroll') },
  'candor-data-grid': { storyId: 'components-datagrid--default', axis: 'x', find: host('candor-data-grid', '.data-grid__scroll') },
  'candor-tone-picker': { storyId: 'components-tonepicker--default', axis: 'x', find: host('candor-tone-picker', '.gamut-scroll') },
  'candor-modal': {
    storyId: 'components-modal--open',
    axis: 'y',
    // The story's body is a single line, too short to overflow even the cap.
    find: `(() => { const m = document.querySelector('candor-modal'); if (m && !m.dataset.filled) { m.dataset.filled = '1'; const p = document.createElement('p'); p.textContent = 'Modal content that runs long enough to scroll. '.repeat(20); m.append(p); } return ${host('candor-modal', '.modal__body')}; })()`,
  },
  'candor-drawer': { storyId: 'components-drawer--open', axis: 'y', find: host('candor-drawer', '.drawer__body') },
  'candor-listbox': {
    storyId: 'components-form-listbox--long-list',
    axis: 'y',
    find: `(() => { const el = document.querySelector('candor-listbox'); if (el) el._open = true; return ${host('candor-listbox', '.listbox__dropdown')}; })()`,
  },
  'candor-combobox': {
    storyId: 'components-form-combobox--default',
    axis: 'y',
    find: `(() => { const el = document.querySelector('candor-combobox'); if (el) el._open = true; return ${host('candor-combobox', 'ul.combobox__dropdown')}; })()`,
  },
  'candor-autocomplete': {
    storyId: 'components-form-autocomplete--with-suggestions',
    axis: 'y',
    find: `(() => { const el = document.querySelector('candor-autocomplete'); if (el) el._open = true; return ${host('candor-autocomplete', '.autocomplete__dropdown')}; })()`,
  },
  'candor-chat-input': {
    storyId: 'components-form-chatinput--default',
    axis: 'y',
    find: `(() => { const t = ${host('candor-chat-input', '.chat-input__textarea')}; if (t && !t.value) t.value = 'A long prompt. '.repeat(40); return t; })()`,
  },
  'candor-article': {
    storyId: 'typography-article--sans-with-code',
    axis: 'x',
    find: `document.querySelector('candor-article pre')`,
  },
};

// The cap that forces overflow: small enough that every fixture's content exceeds it.
const CAP = { x: '140px', y: '56px' };

/** Resolve a length token to px in the page. */
async function tokenPx(page: Page, token: string): Promise<number> {
  return page.evaluate((t) => {
    const probe = document.createElement('div');
    probe.style.cssText = `position:absolute;visibility:hidden;width:var(${t})`;
    document.body.append(probe);
    const px = probe.getBoundingClientRect().width;
    probe.remove();
    return px;
  }, token);
}

/** Minimal decoder for the 8-bit, non-interlaced RGB/RGBA PNGs Playwright writes. */
function decodePng(buf: Buffer): { width: number; height: number; px: (x: number, y: number) => number[] } {
  let pos = 8;
  let width = 0;
  let height = 0;
  let channels = 4;
  const idat: Buffer[] = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[12] !== 0) throw new Error('unsupported PNG: need 8-bit, non-interlaced');
      channels = data[9] === 6 ? 4 : data[9] === 2 ? 3 : 0;
      if (!channels) throw new Error(`unsupported PNG colour type ${data[9]}`);
    } else if (type === 'IDAT') idat.push(data);
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? out[y * stride + i - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + i] : 0;
      const c = y > 0 && i >= channels ? out[(y - 1) * stride + i - channels] : 0;
      let v = row[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += Math.floor((a + b) / 2);
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + i] = v & 0xff;
    }
  }
  return { width, height, px: (x, y) => [...out.subarray((y * width + x) * channels, (y * width + x) * channels + 3)] };
}

const subjects = discoverScrollers();

test('discovery: every scrolling component has a fixture', () => {
  // A floor, so a broken scan fails loudly instead of passing by testing nothing.
  expect(subjects.length, 'scroller scan found too few components').toBeGreaterThanOrEqual(11);
  const missing = subjects.filter((tag) => !FIXTURES[tag]);
  expect(missing, 'scrolling components with no fixture in tests/scrollbar.spec.ts').toEqual([]);
});

for (const tag of subjects) {
  const fixture = FIXTURES[tag];
  if (!fixture) continue;

  test(`${tag}: a ${fixture.axis === 'y' ? 'vertical' : 'horizontal'} scrollbar with an AA grab area`, async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 700 });
    await page.goto(`/iframe.html?id=${fixture.storyId}&viewMode=story`);
    await page.waitForFunction(fixture.find, undefined, { timeout: 15000 });

    const scroller = await page.evaluateHandle(fixture.find);
    const el = scroller.asElement() as ElementHandle<HTMLElement> | null;
    expect(el, `${tag}: fixture did not return an element`).not.toBeNull();

    // Cap the scrolling axis so the content has to overflow, then force a fresh
    // layout: a scroller that changes size after first paint can keep a stale
    // (missing) scrollbar until something invalidates it.
    const geo = await el!.evaluate(async (node: HTMLElement, { axis, cap }: { axis: 'x' | 'y'; cap: string }) => {
      if (axis === 'y') node.style.maxHeight = cap;
      else node.style.maxWidth = cap;
      node.scrollTop = 0;
      node.scrollLeft = 0;
      const prop = axis === 'y' ? 'overflowY' : 'overflowX';
      const was = node.style[prop];
      node.style[prop] = 'hidden';
      void node.offsetWidth;
      node.style[prop] = was;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      node.scrollIntoView({ block: 'center', inline: 'center' });
      const cs = getComputedStyle(node);
      const b = (s: string) => parseFloat(cs.getPropertyValue(`border-${s}-width`)) || 0;
      const r = node.getBoundingClientRect();
      const radius = (() => {
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--radius-md)';
        document.body.append(probe);
        const px = probe.getBoundingClientRect().width;
        probe.remove();
        return px;
      })();
      return {
        overflows: axis === 'y' ? node.scrollHeight > node.clientHeight : node.scrollWidth > node.clientWidth,
        lane: axis === 'y'
          ? node.offsetWidth - node.clientWidth - b('left') - b('right')
          : node.offsetHeight - node.clientHeight - b('top') - b('bottom'),
        rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
        border: { left: b('left'), top: b('top'), right: b('right'), bottom: b('bottom') },
        radius,
      };
    }, { axis: fixture.axis, cap: CAP[fixture.axis] });

    expect(geo.overflows, `${tag}: fixture content does not overflow ${CAP[fixture.axis]}`).toBe(true);

    // 1. The lane is the token's size.
    const size = await tokenPx(page, '--scrollbar-size');
    const thumbSize = await tokenPx(page, '--scrollbar-thumb-size');
    expect(Math.abs(geo.lane - size), `${tag}: lane is ${geo.lane}px, --scrollbar-size is ${size}px`).toBeLessThanOrEqual(1);

    // A line across the lane, near the start of the track, where the thumb sits
    // at scroll position 0. The track is inset by --radius-md at each end.
    const along = geo.radius + 4;
    const clip = fixture.axis === 'y'
      ? { x: Math.round(geo.rect.right - geo.border.right - size), y: Math.round(geo.rect.top + geo.border.top + along), width: Math.round(size), height: 1 }
      : { x: Math.round(geo.rect.left + geo.border.left + along), y: Math.round(geo.rect.bottom - geo.border.bottom - size), width: 1, height: Math.round(size) };

    // 3. The visible bar is the token's thickness: count pixels across the lane
    // that differ from the outermost one, which is spacing, not bar.
    const png = decodePng(await page.screenshot({ clip, scale: 'css' }));
    const across = fixture.axis === 'y' ? png.width : png.height;
    const at = (i: number) => (fixture.axis === 'y' ? png.px(i, 0) : png.px(0, i));
    const ref = at(across - 1);
    let barPx = 0;
    for (let i = 0; i < across; i++) {
      const p = at(i);
      if (Math.abs(p[0] - ref[0]) + Math.abs(p[1] - ref[1]) + Math.abs(p[2] - ref[2]) > 60) barPx++;
    }
    expect(
      Math.abs(barPx - thumbSize),
      `${tag}: ${barPx}px across the lane differ from its outer edge, --scrollbar-thumb-size is ${thumbSize}px. ` +
        `0 means the outer edge is bar too: the bar fills the lane, with no spacing around it`,
    ).toBeLessThanOrEqual(1.5);

    // 2. Dragging from 2px inside the outer edge, in the spacing, scrolls.
    const grab = fixture.axis === 'y'
      ? { x: geo.rect.right - geo.border.right - 2, y: geo.rect.top + geo.border.top + along }
      : { x: geo.rect.left + geo.border.left + along, y: geo.rect.bottom - geo.border.bottom - 2 };
    await page.mouse.move(grab.x, grab.y);
    await page.mouse.down();
    await page.mouse.move(grab.x + (fixture.axis === 'x' ? 40 : 0), grab.y + (fixture.axis === 'y' ? 40 : 0), { steps: 5 });
    await page.mouse.up();
    const scrolled = await el!.evaluate((node: HTMLElement, axis: 'x' | 'y') => (axis === 'y' ? node.scrollTop : node.scrollLeft), fixture.axis);
    expect(scrolled, `${tag}: dragging the grab area 2px inside its outer edge did not scroll`).toBeGreaterThan(0);
  });
}
