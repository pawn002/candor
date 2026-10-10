import { test, expect } from '@playwright/test';

/**
 * Accessibility behaviour tests for the Candor web components.
 *
 * These target the rendered **story iframe** directly (`iframe.html?id=…`), not
 * the Storybook manager — so the locators run in the same document as the
 * component, and Playwright's CSS engine pierces the open shadow roots
 * (`candor-button button` reaches the inner native control).
 *
 * Scope is keyboard / focus / ARIA behaviour that Chromatic (the visual gate)
 * can't see: focus reachability, Tab order, arrow-key radio grouping and its
 * single tab stop, set position, the checkbox space-toggle, what slotted content
 * does to an accessible name, `aria-invalid` wiring, and error politeness. Story IDs follow
 * `{kebab-title-path}--{kebab-export}` per the AT workflow in CLAUDE.md.
 */

/** Navigate straight to a story's canvas, bypassing the Storybook manager. */
const gotoStory = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe('candor-button', () => {
  test('inner control is focusable', async ({ page }) => {
    await page.goto(gotoStory('components-button--default'));

    const button = page.locator('candor-button button');
    await button.focus();
    await expect(button).toBeFocused();
  });

  test('buttons are sequentially Tab-navigable', async ({ page }) => {
    await page.goto(gotoStory('components-button--all-variants'));

    const buttons = page.locator('candor-button button');
    // First the primary, then Tab advances to the secondary — proves the
    // shadow-DOM-wrapped controls participate in the document tab order.
    await buttons.first().focus();
    await expect(buttons.first()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(buttons.nth(1)).toBeFocused();
  });
});

test.describe('candor-input', () => {
  test('has an associated label and is not invalid by default', async ({ page }) => {
    await page.goto(gotoStory('components-form-input--default'));

    const label = page.locator('candor-input label');
    const input = page.locator('candor-input input');

    await expect(label).toBeVisible();
    // `for`/`id` association: the label points at the rendered input.
    const forAttr = await label.getAttribute('for');
    expect(forAttr).toBeTruthy();
    await expect(input).toHaveAttribute('id', forAttr!);

    // No error → aria-invalid is absent, not "false".
    expect(await input.getAttribute('aria-invalid')).toBeNull();
  });

  test('error state sets aria-invalid', async ({ page }) => {
    await page.goto(gotoStory('components-form-input--with-error'));

    const input = page.locator('candor-input input');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('candor-autocomplete', () => {
  test('has an associated label and combobox ARIA wiring', async ({ page }) => {
    await page.goto(gotoStory('components-form-autocomplete--default'));

    const label = page.locator('candor-autocomplete label');
    const input = page.locator('candor-autocomplete input');

    await expect(label).toBeVisible();
    const forAttr = await label.getAttribute('for');
    expect(forAttr).toBeTruthy();
    await expect(input).toHaveAttribute('id', forAttr!);

    // Free-text combobox semantics: role + list autocomplete, collapsed at rest.
    await expect(input).toHaveAttribute('role', 'combobox');
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(await input.getAttribute('aria-invalid')).toBeNull();
  });

  test('opening the list and highlighting sets aria-expanded and aria-activedescendant', async ({ page }) => {
    await page.goto(gotoStory('components-form-autocomplete--default'));
    const input = page.locator('candor-autocomplete input');

    await input.focus();
    await input.pressSequentially('gpt');
    await page.keyboard.press('ArrowDown');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const active = await input.getAttribute('aria-activedescendant');
    expect(active).toBeTruthy();
    // The referenced option actually exists in the listbox.
    await expect(page.locator(`#${active}`)).toHaveAttribute('role', 'option');
  });

  test('error state sets aria-invalid', async ({ page }) => {
    await page.goto(gotoStory('components-form-autocomplete--with-error'));
    const input = page.locator('candor-autocomplete input');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('candor-checkbox', () => {
  test('toggles with the space key', async ({ page }) => {
    await page.goto(gotoStory('components-form-checkbox--default'));

    const checkbox = page.locator('candor-checkbox input[type="checkbox"]');
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
    await expect(checkbox).not.toBeChecked();

    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();

    await page.keyboard.press('Space');
    await expect(checkbox).not.toBeChecked();
  });
});

test.describe('candor-radio', () => {
  test('arrow keys move focus and selection across the group', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--group'));

    // Group: Email (checked) · Phone · Post (disabled). candor-radio implements
    // its own arrow-key grouping across sibling shadow roots, skipping disabled
    // members and moving focus + selection together (native radio grouping does
    // not cross the shadow boundary — see candor-radio.ts).
    const radios = page.locator('candor-radio input[type="radio"]');
    await radios.first().focus();
    await expect(radios.first()).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(1)).toBeFocused();
    await expect(radios.nth(1)).toBeChecked();
  });

  // #262 — native radio groups are one tab stop. Each candor-radio's input is
  // alone in its shadow root, so the component has to supply roving tabindex
  // itself; before it did, every option was a separate Tab stop.
  test('the group is a single tab stop that follows the checked option', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--group'));

    const radios = page.locator('candor-radio input[type="radio"]');
    const tabIndexes = () => radios.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).tabIndex));

    await expect.poll(tabIndexes).toEqual([0, -1, -1]);

    await radios.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(1)).toBeChecked();
    await expect.poll(tabIndexes).toEqual([-1, 0, -1]);
  });

  test('Tab leaves the group rather than visiting each option', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--with-adjacent-help'));

    // Option · help button · option · help button … — with roving tabindex,
    // Tab goes from the checked option to its help button, then straight to the
    // next help button, skipping the unchecked options between them.
    const radios = page.locator('candor-radio input[type="radio"]');
    const helpButtons = page.locator('candor-radio candor-button button');

    await radios.first().focus();
    await page.keyboard.press('Tab');
    await expect(helpButtons.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(helpButtons.nth(1)).toBeFocused();
  });

  test('with nothing checked, the first enabled option is the tab stop', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--group'));

    const tabIndexes = await page.evaluate(async () => {
      await customElements.whenDefined('candor-radio');
      const fs = document.createElement('fieldset');
      fs.innerHTML = `
        <legend>Unanswered</legend>
        <candor-radio name="unanswered" value="a" label="A" disabled></candor-radio>
        <candor-radio name="unanswered" value="b" label="B"></candor-radio>
        <candor-radio name="unanswered" value="c" label="C"></candor-radio>`;
      document.body.append(fs);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      return Array.from(fs.querySelectorAll('candor-radio')).map(
        (r) => r.shadowRoot!.querySelector('input')!.tabIndex,
      );
    });
    // Without the fallback an unanswered group would have no tab stop at all.
    expect(tabIndexes).toEqual([-1, 0, -1]);
  });

  test('each option reports its position in the set, inside a radiogroup', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--group'));

    const radios = page.locator('candor-radio input[type="radio"]');
    // Disabled options still count, as they do in a native group.
    await expect.poll(() => radios.evaluateAll((els) =>
      els.map((el) => [el.getAttribute('aria-posinset'), el.getAttribute('aria-setsize')]),
    )).toEqual([['1', '3'], ['2', '3'], ['3', '3']]);

    await expect(page.locator('fieldset')).toHaveAttribute('role', 'radiogroup');
    await expect(page.getByRole('radiogroup', { name: 'Preferred contact method' })).toBeVisible();
  });

  test('renaming an option out of the group re-syncs the options it left', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--group'));

    const result = await page.evaluate(async () => {
      await customElements.whenDefined('candor-radio');
      const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
      const fs = document.createElement('fieldset');
      fs.innerHTML = `
        <legend>Rename</legend>
        <candor-radio name="rename" value="a" label="A"></candor-radio>
        <candor-radio name="rename" value="b" label="B"></candor-radio>
        <candor-radio name="rename" value="c" label="C"></candor-radio>`;
      const consumer = document.createElement('fieldset');
      consumer.setAttribute('role', 'radiogroup');
      consumer.innerHTML = `
        <legend>Consumer role</legend>
        <candor-radio name="own" value="a" label="A"></candor-radio>
        <candor-radio name="own" value="b" label="B"></candor-radio>`;
      document.body.append(fs, consumer);
      await frame();

      const radios = fs.querySelectorAll('candor-radio');
      (radios[2] as HTMLElement & { name: string }).name = 'elsewhere';
      (consumer.querySelectorAll('candor-radio')[1] as HTMLElement & { name: string }).name = 'elsewhere';
      await frame();
      return {
        sizes: Array.from(radios).slice(0, 2).map(
          (r) => r.shadowRoot!.querySelector('input')!.getAttribute('aria-setsize'),
        ),
        role: fs.getAttribute('role'),
        consumerRole: consumer.getAttribute('role'),
      };
    });
    // The two left behind are now a set of two, and a fieldset holding two
    // names is no longer a radiogroup — but a role the consumer wrote stays.
    expect(result.sizes).toEqual(['2', '2']);
    expect(result.role).toBeNull();
    expect(result.consumerRole).toBe('radiogroup');
  });

  test('a named radio with no group warns', async ({ page }) => {
    await page.goto(gotoStory('components-form-radio--group'));

    const warnings: string[] = [];
    page.on('console', (msg) => { if (msg.type() === 'warning') warnings.push(msg.text()); });

    await page.evaluate(async () => {
      await customElements.whenDefined('candor-radio');
      // Each radio in its own wrapper with no fieldset — the documented mistake.
      for (const v of ['x', 'y']) {
        const div = document.createElement('div');
        div.innerHTML = `<candor-radio name="ungrouped" value="${v}" label="${v}"></candor-radio>`;
        document.body.append(div);
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
    });
    expect(warnings.filter((w) => w.includes('name="ungrouped"'))).toHaveLength(2);
  });
});

// #263 — the default slot is inside the control's <label>, so anything projected
// there joins the accessible name. slot="end" is the place for adjacent content,
// and must leave the name alone.
for (const tag of ['candor-radio', 'candor-checkbox', 'candor-switch']) {
  test.describe(tag, () => {
    test('content in slot="end" is not part of the accessible name', async ({ page }) => {
      const component = tag.replace('candor-', '');
      await page.goto(gotoStory(`components-form-${component}--default`));

      await page.evaluate(async (tag) => {
        await customElements.whenDefined(tag);
        const el = document.createElement(tag);
        el.id = 'slot-probe';
        el.setAttribute('label', 'OKCA');
        const help = document.createElement('button');
        help.slot = 'end';
        help.textContent = 'About OKCA';
        el.append(help);
        document.body.append(el);
      }, tag);

      const control = page.locator('#slot-probe input');
      await expect(control).toHaveAccessibleName('OKCA');
      // And it is not nested in the label, which is what keeps the HTML valid.
      const slottedOutsideLabel = await page.locator('#slot-probe').evaluate((el) => {
        const slot = el.querySelector('button')!.assignedSlot;
        return slot !== null && slot.closest('label') === null;
      });
      expect(slottedOutsideLabel).toBe(true);
    });
  });
}

// #280 — a field's error is announced politely and whole, whichever component
// renders it. Two of the five used bare role="alert" (assertive), so the same
// message interrupted the reader in some components and waited in others.
for (const component of ['input', 'select', 'listbox', 'combobox', 'autocomplete']) {
  test(`candor-${component} announces its error politely and atomically`, async ({ page }) => {
    await page.goto(gotoStory(`components-form-${component}--with-error`));

    const region = page.locator(`candor-${component} [role="alert"]`);
    await expect(region).toHaveCount(1);
    await expect(region).toHaveAttribute('aria-live', 'polite');
    await expect(region).toHaveAttribute('aria-atomic', 'true');
    await expect(region).not.toBeEmpty();
  });
}
