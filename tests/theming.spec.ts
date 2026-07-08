import { test, expect } from '@playwright/test';

/**
 * Consumer style-hook tests (#165, #173): the `::part` names and
 * `--candor-<component>-*` custom properties are the public theming API, so
 * prove they actually work from the light DOM — parts are exposed on the
 * internals, custom properties override computed style, and `::part` selectors
 * genuinely pierce the shadow root.
 */

const gotoStory = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe('candor-button style hooks', () => {
  test('exposes part="button" and honors the density custom property', async ({ page }) => {
    await page.goto(gotoStory('components-button--default'));
    const inner = page.locator('candor-button button');
    await inner.waitFor();
    await expect(inner).toHaveAttribute('part', 'button');

    // Custom property set on the host cascades into the shadow root and wins
    // over the size token default.
    const minHeight = await page.evaluate(() => {
      const el = document.querySelector('candor-button') as HTMLElement;
      el.style.setProperty('--candor-button-min-height', '5rem');
      const btn = el.shadowRoot!.querySelector('button')!;
      return getComputedStyle(btn).minHeight;
    });
    expect(minHeight).toBe('80px');
  });
});

test.describe('candor-input style hooks', () => {
  test('exposes parts on the meaningful internals', async ({ page }) => {
    await page.goto(gotoStory('components-form-input--default'));
    await page.locator('candor-input input').waitFor();
    await expect(page.locator('candor-input input')).toHaveAttribute('part', 'input');
    await expect(page.locator('candor-input label')).toHaveAttribute('part', 'label');

    const radius = await page.evaluate(() => {
      const el = document.querySelector('candor-input') as HTMLElement;
      el.style.setProperty('--candor-input-border-radius', '3px');
      const field = el.shadowRoot!.querySelector('input')!;
      return getComputedStyle(field).borderTopLeftRadius;
    });
    expect(radius).toBe('3px');
  });
});

test.describe('candor-disclosure style hooks (#173)', () => {
  test('trigger padding is reachable via custom property and via ::part', async ({ page }) => {
    await page.goto(gotoStory('components-disclosure--default'));
    const trigger = page.locator('candor-disclosure button');
    await trigger.waitFor();
    await expect(trigger).toHaveAttribute('part', 'trigger');

    // 1) Custom property drives uniform vertical padding.
    const padY = await page.evaluate(() => {
      const el = document.querySelector('candor-disclosure') as HTMLElement;
      el.style.setProperty('--candor-disclosure-trigger-padding-y', '40px');
      const btn = el.shadowRoot!.querySelector('button')!;
      return getComputedStyle(btn).paddingTop;
    });
    expect(padY).toBe('40px');

    // 2) ::part pierces the shadow root — the asymmetric #173 fix (kill only the
    // top inset) is expressible only this way, not through the single padding-y knob.
    const partPadTop = await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = 'candor-disclosure::part(trigger){padding-top:0px}';
      document.head.appendChild(style);
      const btn = (document.querySelector('candor-disclosure') as HTMLElement).shadowRoot!.querySelector('button')!;
      return getComputedStyle(btn).paddingTop;
    });
    expect(partPadTop).toBe('0px');
  });
});
