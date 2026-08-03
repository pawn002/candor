import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * Runtime event-contract tests for the Candor value controls (#164 / #163).
 *
 * The a11y suite proves the events *build and type-check*; this proves their
 * runtime dispatch — the things only a real browser shows:
 *   • the DOM two-event rule: `input` streams the live value, `change` fires
 *     once on commit;
 *   • de-duplication: exactly one `input` reaches the consumer per keystroke,
 *     even though the inner control's native `input` is composed and would
 *     otherwise escape the shadow root too;
 *   • `detail` carries the value.
 *
 * Targets the story iframe directly; listeners sit on the custom-element host,
 * so they see the composed events exactly as a consumer would.
 */

const gotoStory = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

type Tally = {
  input: number;
  change: number;
  lastInput: unknown;
  lastChange: unknown;
};

/**
 * Attach counters to a host element, counting *every* `input`/`change` event a
 * consumer would see — deliberately NOT filtering to `CustomEvent`. That is what
 * makes the counts prove de-duplication: if the inner control's composed native
 * `input` leaked past the shadow boundary, the tally would double. `lastInput`
 * captures each event's `detail`, so a leaked native `InputEvent` (detail 0)
 * would also show up there instead of Candor's typed value.
 */
async function tally(page: Page, hostSelector: string): Promise<void> {
  await page.evaluate(
    ({ hostSelector }) => {
      const host = document.querySelector(hostSelector)!;
      const w = window as unknown as { __tally: Tally };
      w.__tally = { input: 0, change: 0, lastInput: null, lastChange: null };
      host.addEventListener('input', (e) => {
        w.__tally.input++; w.__tally.lastInput = (e as CustomEvent).detail;
      });
      host.addEventListener('change', (e) => {
        w.__tally.change++; w.__tally.lastChange = (e as CustomEvent).detail;
      });
    },
    { hostSelector },
  );
}

const readTally = (page: Page) =>
  page.evaluate(() => (window as unknown as { __tally: Tally }).__tally);

test.describe('candor-input — input (live) vs change (commit)', () => {
  test('streams one input per keystroke; change fires once on blur', async ({ page }) => {
    await page.goto(gotoStory('components-form-input--default'));
    const field: Locator = page.locator('candor-input input');
    await field.waitFor();
    await tally(page, 'candor-input');

    await field.focus();
    await field.pressSequentially('abc');

    // Three keystrokes → exactly three `input`s (not six): the native composed
    // `input` is stopped at the shadow boundary, so only Candor's fires. No
    // commit yet.
    let t = await readTally(page);
    expect(t.input).toBe(3);
    expect(t.change).toBe(0);
    expect(t.lastInput).toBe('abc'); // detail carries the value

    // Commit on blur → exactly one `change`.
    await field.blur();
    t = await readTally(page);
    expect(t.change).toBe(1);
    expect(t.lastChange).toBe('abc');
    expect(t.input).toBe(3);         // blur adds no extra input
  });
});

test.describe('candor-slider — input floods, change fires once on release', () => {
  test('a pointer drag emits many input events but a single change', async ({ page }) => {
    await page.goto(gotoStory('components-form-slider--default'));
    const range: Locator = page.locator('candor-slider input[type="range"]');
    await range.waitFor();
    await tally(page, 'candor-slider');

    const box = (await range.boundingBox())!;
    const y = box.y + box.height / 2;
    // Press near 20% and drag rightward in several steps to ~80%.
    await page.mouse.move(box.x + box.width * 0.2, y);
    await page.mouse.down();
    for (const pct of [0.35, 0.5, 0.65, 0.8]) {
      await page.mouse.move(box.x + box.width * pct, y);
    }
    await page.mouse.up();

    const t = await readTally(page);
    // The drag crosses many integer steps → multiple live events…
    expect(t.input).toBeGreaterThan(1);
    // …but the committed `change` fires exactly once, on release.
    expect(t.change).toBe(1);
    expect(typeof t.lastChange).toBe('number');
  });
});

test.describe('candor-modal / candor-drawer — close fires exactly once', () => {
  // Regression guard for #234. Both wire the inner native <dialog>'s own `close`
  // event to the same handler that calls `dialog.close()`, so a single user close
  // re-enters it. Before the fix this counted 2, on every close path. The bug is
  // invisible on screen — the dialog closes correctly — so only a count catches it.
  for (const [label, storyId, sel] of [
    ['modal', 'components-modal--open', 'candor-modal'],
    ['drawer', 'components-drawer--open', 'candor-drawer'],
  ] as const) {
    test(`${label}: one close event per close`, async ({ page }) => {
      await page.goto(gotoStory(storyId));
      await page.locator(sel).waitFor();
      await page.evaluate((sel) => {
        const host = document.querySelector(sel)!;
        const w = window as unknown as { __closes: number };
        w.__closes = 0;
        host.addEventListener('close', () => w.__closes++);
      }, sel);

      // Close through the component's own close button.
      await page.evaluate((sel) => {
        const host = document.querySelector(sel)!;
        host.shadowRoot!.querySelector('button')?.click();
      }, sel);

      const closes = await page.evaluate(
        () => (window as unknown as { __closes: number }).__closes,
      );
      expect(closes).toBe(1);
    });
  }
});

test.describe('candor-button — no bespoke event, the native click suffices', () => {
  // `clicked` was removed in #201 because the inner button's native click already
  // retargets to the host. This asserts the property that made removal safe.
  test('a click reaches a host listener, and disabled suppresses it', async ({ page }) => {
    await page.goto(gotoStory('components-button--default'));
    const btn = page.locator('candor-button button').first();
    await btn.waitFor();
    await page.evaluate(() => {
      const host = document.querySelector('candor-button')!;
      const w = window as unknown as { __clicks: number };
      w.__clicks = 0;
      host.addEventListener('click', () => w.__clicks++);
    });
    await btn.click();
    expect(await page.evaluate(() => (window as unknown as { __clicks: number }).__clicks)).toBe(1);
  });
});

test.describe('candor-combobox — input (filter text) vs change (selection)', () => {
  test('typing streams input; selecting commits a single change', async ({ page }) => {
    await page.goto(gotoStory('components-form-combobox--default'));
    const field: Locator = page.locator('candor-combobox input');
    await field.waitFor();
    await tally(page, 'candor-combobox');

    // Type a filter — live `input` per keystroke, no commit.
    await field.focus();
    await field.pressSequentially('uni'); // filters to "United States"/"United Kingdom"
    let t = await readTally(page);
    expect(t.input).toBe(3);
    expect(t.change).toBe(0);
    expect(t.lastInput).toBe('uni'); // detail is the raw filter text

    // Choose the first match with the keyboard → exactly one `change`.
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    t = await readTally(page);
    expect(t.change).toBe(1);
    // change detail is the selected option object, not the filter string.
    expect(t.lastChange).toMatchObject({ value: expect.any(String), label: expect.any(String) });
  });
});

test.describe('candor-autocomplete — free text with non-binding suggestions', () => {
  test('an unlisted value is accepted; input streams, change commits it as a string', async ({ page }) => {
    await page.goto(gotoStory('components-form-autocomplete--default'));
    const field: Locator = page.locator('candor-autocomplete input');
    await field.waitFor();
    await tally(page, 'candor-autocomplete');

    // Type a value that matches NO suggestion — the list simply hides, the value
    // is fully valid. (A combobox would reject this; autocomplete never does.)
    await field.focus();
    await field.pressSequentially('zzz');
    let t = await readTally(page);
    expect(t.input).toBe(3);          // one live input per keystroke, de-duped
    expect(t.change).toBe(0);         // nothing committed yet
    expect(t.lastInput).toBe('zzz');  // detail is the raw free text

    // Commit on blur → one `change`, detail is the plain string the user typed
    // (NOT an option object, unlike combobox).
    await field.blur();
    t = await readTally(page);
    expect(t.change).toBe(1);
    expect(t.lastChange).toBe('zzz');
  });

  test('picking a suggestion commits it as a string', async ({ page }) => {
    await page.goto(gotoStory('components-form-autocomplete--default'));
    const field: Locator = page.locator('candor-autocomplete input');
    await field.waitFor();
    await tally(page, 'candor-autocomplete');

    await field.focus();
    await field.pressSequentially('gpt'); // filters to gpt-4o / gpt-4o-mini / gpt-4-turbo
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const t = await readTally(page);
    expect(t.change).toBe(1);
    // Committed value is a plain string — the chosen suggestion, filled into the field.
    expect(typeof t.lastChange).toBe('string');
    expect(t.lastChange).toBe('gpt-4o');
  });
});
