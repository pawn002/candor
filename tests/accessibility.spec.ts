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
 * can't see: focus reachability, Tab order, arrow-key radio grouping, the
 * checkbox space-toggle, and `aria-invalid` wiring. Story IDs follow
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
});
