import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('button should have proper focus state', async ({ page }) => {
    await page.goto('/?path=/story/components-button--primary');

    const button = page.locator('app-button button');
    await button.focus();

    // Check that focus is visible
    await expect(button).toBeFocused();

    // Take screenshot of focused state
    await page.screenshot({
      path: 'screenshots/button-focus.png'
    });
  });

  test('button should be keyboard navigable', async ({ page }) => {
    await page.goto('/?path=/story/components-button--all-variants');

    // Tab through buttons
    await page.keyboard.press('Tab');
    const firstButton = page.locator('app-button button').first();
    await expect(firstButton).toBeFocused();

    await page.keyboard.press('Tab');
    const secondButton = page.locator('app-button button').nth(1);
    await expect(secondButton).toBeFocused();
  });

  test('form input should have proper labels', async ({ page }) => {
    await page.goto('/?path=/story/components-form-input--default');

    const input = page.locator('app-input input');
    const label = page.locator('app-input label');

    // Check label exists
    await expect(label).toBeVisible();

    // Check aria attributes
    const ariaInvalid = await input.getAttribute('aria-invalid');
    expect(ariaInvalid).toBeNull(); // Should not be invalid by default
  });

  test('form input with error should have aria-invalid', async ({ page }) => {
    await page.goto('/?path=/story/components-form-input--with-error');

    const input = page.locator('app-input input');
    const ariaInvalid = await input.getAttribute('aria-invalid');

    expect(ariaInvalid).toBe('true');
  });

  test('checkbox should be keyboard accessible', async ({ page }) => {
    await page.goto('/?path=/story/components-form-checkbox--default');

    const checkbox = page.locator('app-checkbox input[type="checkbox"]');

    // Focus checkbox
    await checkbox.focus();
    await expect(checkbox).toBeFocused();

    // Toggle with spacebar
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();

    await page.keyboard.press('Space');
    await expect(checkbox).not.toBeChecked();
  });

  test('radio buttons should be keyboard navigable', async ({ page }) => {
    await page.goto('/?path=/story/components-form-radio--radio-group');

    const radios = page.locator('app-radio input[type="radio"]');

    // Focus first radio
    await radios.first().focus();
    await expect(radios.first()).toBeFocused();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(1)).toBeFocused();
  });
});
