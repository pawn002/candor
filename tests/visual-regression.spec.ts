import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should capture button variants', async ({ page }) => {
    await page.goto('/?path=/story/components-button--all-variants');
    await page.waitForSelector('app-button');
    await page.screenshot({
      path: 'screenshots/button-variants.png',
      fullPage: true
    });
  });

  test('should capture typography scale', async ({ page }) => {
    await page.goto('/?path=/story/typography-heading--all-headings');
    await page.waitForSelector('app-heading');
    await page.screenshot({
      path: 'screenshots/typography-headings.png',
      fullPage: true
    });
  });

  test('should capture form inputs', async ({ page }) => {
    await page.goto('/?path=/story/components-form-input--all-states');
    await page.waitForSelector('app-input');
    await page.screenshot({
      path: 'screenshots/form-inputs.png',
      fullPage: true
    });
  });

  test('should capture spacing scale', async ({ page }) => {
    await page.goto('/?path=/story/design-tokens-spacing--spacing-scale');
    await page.waitForSelector('app-spacing-showcase');
    await page.screenshot({
      path: 'screenshots/spacing-scale.png',
      fullPage: true
    });
  });
});
