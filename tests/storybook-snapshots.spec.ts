import { test } from '@playwright/test';

/**
 * Storybook Snapshot Tests
 *
 * These tests navigate to each Storybook story and capture screenshots.
 * Useful for Claude to visually inspect all component variations.
 */

const stories = [
  // Typography
  { path: '/story/typography-heading--h1', name: 'heading-h1' },
  { path: '/story/typography-heading--h2', name: 'heading-h2' },
  { path: '/story/typography-heading--h3', name: 'heading-h3' },
  { path: '/story/typography-heading--all-headings', name: 'heading-all' },
  { path: '/story/typography-text--body', name: 'text-body' },
  { path: '/story/typography-text--caption', name: 'text-caption' },
  { path: '/story/typography-text--all-variants', name: 'text-all' },

  // Buttons
  { path: '/story/components-button--primary', name: 'button-primary' },
  { path: '/story/components-button--secondary', name: 'button-secondary' },
  { path: '/story/components-button--tertiary', name: 'button-tertiary' },
  { path: '/story/components-button--ghost', name: 'button-ghost' },
  { path: '/story/components-button--all-variants', name: 'button-all-variants' },
  { path: '/story/components-button--all-sizes', name: 'button-all-sizes' },
  { path: '/story/components-button--full-matrix', name: 'button-matrix' },

  // Form Components
  { path: '/story/components-form-input--default', name: 'input-default' },
  { path: '/story/components-form-input--with-error', name: 'input-error' },
  { path: '/story/components-form-input--all-states', name: 'input-all' },
  { path: '/story/components-form-checkbox--default', name: 'checkbox-default' },
  { path: '/story/components-form-checkbox--multiple', name: 'checkbox-multiple' },
  { path: '/story/components-form-radio--radio-group', name: 'radio-group' },

  // Design Tokens
  { path: '/story/design-tokens-spacing--spacing-scale', name: 'spacing-scale' },
  { path: '/story/design-tokens-spacing--spacing-in-components', name: 'spacing-usage' },
];

test.describe('Storybook Snapshots', () => {
  for (const story of stories) {
    test(`should capture ${story.name}`, async ({ page }) => {
      await page.goto(`/?path=${story.path}`);

      // Wait for story to render
      await page.waitForTimeout(500);

      // Capture screenshot
      await page.screenshot({
        path: `screenshots/${story.name}.png`,
        fullPage: true
      });
    });
  }
});

test.describe('Storybook Canvas Screenshots', () => {
  test('should capture button component canvas', async ({ page }) => {
    await page.goto('/?path=/story/components-button--primary');

    // Focus on the canvas/preview area
    const canvas = page.locator('#storybook-preview-iframe');
    await canvas.waitFor();

    await page.screenshot({
      path: 'screenshots/button-canvas.png',
      clip: { x: 0, y: 0, width: 800, height: 600 }
    });
  });
});
