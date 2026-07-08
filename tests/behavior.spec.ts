import { test, expect } from '@playwright/test';

/**
 * Runtime behaviour tests for the Wave 3 component changes (#172, #166).
 *
 * Targets the story iframe directly; Playwright's CSS engine pierces the open
 * shadow roots, so `candor-drawer dialog` / `candor-accordion-item summary`
 * reach the inner elements. These assert behaviour only a real browser shows:
 * composed event dispatch, consumer-side coordination, and modal vs non-modal
 * dialog activation.
 */

const gotoStory = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe('candor-accordion-item — toggle event (#172)', () => {
  test('dispatches a composed toggle event on expand and collapse', async ({ page }) => {
    await page.goto(gotoStory('components-accordion--default'));
    const summary = page.locator('candor-accordion-item summary');
    await summary.waitFor();

    // Listen on the host — the native <details> toggle is composed:false and
    // never escapes, so only the component's re-dispatched composed event counts.
    await page.evaluate(() => {
      const host = document.querySelector('candor-accordion-item')!;
      (window as unknown as { __t: { n: number; last: unknown } }).__t = { n: 0, last: null };
      host.addEventListener('toggle', (e) => {
        const t = (window as unknown as { __t: { n: number; last: unknown } }).__t;
        t.n++; t.last = (e as CustomEvent).detail;
      });
    });
    const read = () => page.evaluate(() => (window as unknown as { __t: { n: number; last: unknown } }).__t);

    // The native <details> `toggle` fires asynchronously (queued after the open
    // state flips), so the component's re-dispatched composed event may not have
    // landed by the time a bare read() runs — a race that shows up on slow CI.
    // Poll until it propagates rather than reading immediately.
    await summary.click();
    await expect.poll(async () => (await read()).n).toBe(1);
    expect((await read()).last).toBe(true); // detail carries the new open state

    await summary.click();
    await expect.poll(async () => (await read()).n).toBe(2);
    expect((await read()).last).toBe(false);
  });
});

test.describe('candor-accordion-item — consumer single-open coordination (#172)', () => {
  test('opening one item closes its siblings via the toggle event', async ({ page }) => {
    await page.goto(gotoStory('components-accordion--single-open'));
    const items = page.locator('candor-accordion-item');
    await items.first().waitFor();

    // Section one starts open (reflected `open` attribute).
    await expect(items.nth(0)).toHaveAttribute('open', '');

    // Open section two → the story's @toggle handler closes section one.
    await items.nth(1).locator('summary').click();
    await expect(items.nth(1)).toHaveAttribute('open', '');
    await expect(items.nth(0)).not.toHaveAttribute('open');
  });
});

test.describe('candor-drawer — non-modal mode (#166)', () => {
  test('modal="false" opens a non-modal dialog (show, not showModal)', async ({ page }) => {
    await page.goto(gotoStory('components-drawer--non-modal'));
    const dialog = page.locator('candor-drawer dialog');
    await dialog.waitFor({ state: 'attached' });

    // Opened via dialog.show(): the dialog is open but NOT a top-layer modal.
    // (If the boolean-attribute converter were wrong, modal="false" would parse
    // as true and showModal() would run — :modal would then be true and fail.)
    await expect(dialog).toHaveJSProperty('open', true);
    const isModal = await dialog.evaluate((d: HTMLDialogElement) => d.matches(':modal'));
    expect(isModal).toBe(false);
  });

  test('the default (modal) drawer opens as a modal dialog', async ({ page }) => {
    await page.goto(gotoStory('components-drawer--open'));
    const dialog = page.locator('candor-drawer dialog');
    await dialog.waitFor({ state: 'attached' });

    await expect(dialog).toHaveJSProperty('open', true);
    const isModal = await dialog.evaluate((d: HTMLDialogElement) => d.matches(':modal'));
    expect(isModal).toBe(true);
  });
});

test.describe('candor-drawer — dismiss-on-backdrop (#181)', () => {
  test('dismiss-on-backdrop="false" parses to false and a backdrop click keeps it open', async ({ page }) => {
    await page.goto(gotoStory('components-drawer--no-dismiss-on-backdrop'));
    await page.locator('candor-button button').click();

    const host = page.locator('candor-drawer');
    const dialog = page.locator('candor-drawer dialog');
    await expect(dialog).toHaveJSProperty('open', true);

    // The converter fix: the "false" attribute string must parse to the boolean
    // false. With the default type:Boolean converter this was `true` (any present
    // attribute reads as true), silently keeping backdrop-dismiss on.
    await expect(host).toHaveJSProperty('dismissOnBackdrop', false);

    // Click the backdrop region (far left; the sm panel is anchored right) — the
    // click target is the dialog itself, but the guard must suppress the close.
    await dialog.click({ position: { x: 8, y: 200 } });
    await expect(dialog).toHaveJSProperty('open', true);
  });

  test('by default a backdrop click dismisses the drawer (positive control)', async ({ page }) => {
    await page.goto(gotoStory('components-drawer--open'));
    const dialog = page.locator('candor-drawer dialog');
    await expect(dialog).toHaveJSProperty('open', true);

    await dialog.click({ position: { x: 8, y: 200 } });
    await expect(dialog).toHaveJSProperty('open', false);
  });
});
