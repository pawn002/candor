# Playwright MCP Workflow Guide

## Overview

This document explains how Claude uses Playwright MCP to provide visual feedback during design iterations. Playwright enables Claude to see the components, capture screenshots, and validate designs visually.

## What is Playwright MCP?

Playwright MCP is an MCP server that gives Claude direct control over a browser:
- Navigate to URLs (including local Storybook)
- Take screenshots
- Interact with elements (click, type, hover)
- Test keyboard navigation
- Capture browser console logs

This turns Claude into a **visual design partner** that can see and evaluate your components.

---

## How Claude Uses Playwright

### 1. Visual Inspection

Claude can navigate to Storybook stories and capture screenshots to visually evaluate designs.

**Example workflow:**
```
User: "Show me all button variants"

Claude's process:
1. Ensures Storybook is running (http://localhost:6006)
2. Uses Playwright MCP to navigate to button story
3. Takes screenshot
4. Analyzes visual result
5. Shows screenshot to user
6. Checks colors with CPQI if needed
```

### 2. Visual Regression Testing

Claude can capture and compare screenshots to detect unintended changes.

**Example workflow:**
```
User: "Did changing the primary color affect other components?"

Claude's process:
1. Takes baseline screenshots of all components
2. User updates design tokens
3. Takes new screenshots
4. Compares before/after
5. Reports visual differences
```

### 3. Accessibility Verification

Claude can test keyboard navigation, focus states, and visual accessibility indicators.

**Example workflow:**
```
User: "Verify all buttons have visible focus indicators"

Claude's process:
1. Navigates to button story
2. Uses keyboard to tab through buttons
3. Screenshots each focus state
4. Verifies focus ring is visible
5. Checks focus color contrast with CPQI
```

### 4. Responsive Testing

Claude can resize the browser and capture components at different viewport sizes.

**Example workflow:**
```
User: "How do buttons look on mobile?"

Claude's process:
1. Sets viewport to mobile size (375x667)
2. Screenshots button story
3. Sets viewport to desktop (1920x1080)
4. Screenshots button story
5. Compares layouts
```

---

## Playwright Test Scripts

The `tests/` directory contains pre-written Playwright scripts that Claude can run.

### Visual Regression Tests (`tests/visual-regression.spec.ts`)

Captures screenshots of all major components:

```typescript
test('capture button screenshots', async ({ page }) => {
  await page.goto('/?path=/story/components-button--all-variants');
  await page.screenshot({ path: 'screenshots/buttons.png' });
});
```

**Run tests:**
```bash
npm run test:playwright
```

**View test results:**
```bash
npx playwright show-report
```

### Accessibility Tests (`tests/accessibility.spec.ts`)

Tests keyboard navigation and focus management:

```typescript
test('buttons should be keyboard navigable', async ({ page }) => {
  await page.goto('/?path=/story/components-button--primary');
  
  // Find button
  const button = page.getByRole('button', { name: /primary button/i });
  
  // Tab to button
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  
  // Activate with keyboard
  await page.keyboard.press('Enter');
});
```

### Storybook Snapshots (`tests/storybook-snapshots.spec.ts`)

Captures all Storybook stories automatically:

```typescript
const stories = [
  { path: '/story/typography-heading--h1', name: 'heading-h1' },
  { path: '/story/typography-text--body', name: 'text-body' },
  { path: '/story/components-button--primary', name: 'button-primary' },
  // ... etc
];

for (const story of stories) {
  test(`capture ${story.name}`, async ({ page }) => {
    await page.goto(`/?path=${story.path}`);
    await page.screenshot({ path: `screenshots/${story.name}.png` });
  });
}
```

---

## Common Playwright Workflows

### Workflow 1: Screenshot All Components

**User:** "Screenshot all components"

**Claude's commands:**
```bash
# Run snapshot tests
npm run test:playwright -- tests/storybook-snapshots.spec.ts

# View screenshots
ls screenshots/
```

**Result:** All component variations saved in `screenshots/` directory

### Workflow 2: Compare Before/After

**User:** "I'm changing the primary color. Show me the impact."

**Claude's process:**
1. **Before:** Run snapshot tests → Save to `screenshots/before/`
2. **User updates:** `$color-primary` in `colors.scss`
3. **After:** Run snapshot tests → Save to `screenshots/after/`
4. **Compare:** Show both sets to user
5. **Validate:** Use CPQI to check new color meets accessibility

### Workflow 3: Test Specific State

**User:** "Show me button hover states"

**Claude uses Playwright MCP directly:**
```typescript
// Navigate to button story
await page.goto('http://localhost:6006/?path=/story/components-button--primary');

// Find button
const button = page.locator('button');

// Hover
await button.hover();

// Screenshot hover state
await page.screenshot({ path: 'screenshots/button-hover.png' });
```

### Workflow 4: Check Focus Indicators

**User:** "Are focus indicators visible on all interactive elements?"

**Claude's process:**
```typescript
// Navigate to form story
await page.goto('http://localhost:6006/?path=/story/components-form-input--default');

// Tab through elements
await page.keyboard.press('Tab'); // Focus first input
await page.screenshot({ path: 'screenshots/input-focus.png' });

await page.keyboard.press('Tab'); // Focus next element
await page.screenshot({ path: 'screenshots/next-focus.png' });

// Use CPQI CLI to check focus color contrast
// cpqi contrast <focusColor> <backgroundColor> -q
```

### Workflow 5: Responsive Design Check

**User:** "Show me the form on mobile and desktop"

**Claude's process:**
```typescript
// Mobile
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('http://localhost:6006/?path=/story/examples-form-example');
await page.screenshot({ path: 'screenshots/form-mobile.png' });

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });
await page.screenshot({ path: 'screenshots/form-tablet.png' });

// Desktop
await page.setViewportSize({ width: 1920, height: 1080 });
await page.screenshot({ path: 'screenshots/form-desktop.png' });
```

---

## Integration with CPQI

Playwright and CPQI work together for complete validation:

### Example: Full Button Validation

**User:** "Validate primary button meets all accessibility requirements"

**Claude's combined workflow:**

1. **Visual inspection (Playwright):**
   ```typescript
   await page.goto('/?path=/story/components-button--primary');
   await page.screenshot({ path: 'screenshots/button-primary.png' });
   ```

2. **Extract colors from design tokens:**
   ```scss
   $color-button-primary-bg: oklch(0.55 0.18 250);
   $color-button-primary-text: oklch(0.98 0.01 250);
   ```

3. **Validate contrast (CPQI CLI):**
   ```bash
   cpqi contrast "oklch(0.98 0.01 250)" "oklch(0.55 0.18 250)" -q
   # → 6.8  ✅ Passes WCAG AA (4.5:1)
   ```

4. **Check contrast is sufficient for 16px text:**
   - WCAG 4.5:1 → passes for normal text ✅
   - Button uses 16px → comfortable margin above minimum

5. **Test focus state (Playwright):**
   ```typescript
   await page.locator('button').focus();
   await page.screenshot({ path: 'screenshots/button-focus.png' });
   ```

6. **Validate focus color (CPQI CLI):**
   ```bash
   cpqi contrast "oklch(0.60 0.20 250)" "oklch(0.55 0.18 250)" -q
   # → 3.2  ✅ Meets UI component requirement (3:1)
   ```

7. **Report to user:**
   ```
   ✅ Primary button meets all requirements:
   - Text contrast: APCA 95 (excellent)
   - Text size: 16px (exceeds minimum)
   - Focus indicator: WCAG 3.2:1 (passes)
   - Keyboard accessible: ✅
   - Visual evidence: [screenshots attached]
   ```

---

## Playwright Configuration

The playground's `playwright.config.ts` is configured to:

### 1. Auto-start Storybook

```typescript
webServer: {
  command: 'npm run storybook',
  url: 'http://localhost:6006',
  reuseExistingServer: true,
}
```

When you run `npm run test:playwright`, Playwright automatically starts Storybook if it's not running.

### 2. Target Storybook

```typescript
use: {
  baseURL: 'http://localhost:6006',
}
```

All test URLs are relative to Storybook.

### 3. Capture Failures

```typescript
use: {
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
}
```

Screenshots and traces are captured when tests fail, helping debug issues.

### 4. Single Browser (Chromium)

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
],
```

For design work, testing in one browser (Chrome) is sufficient. Add more browsers for production testing.

---

## Screenshot Organization

Screenshots are saved to `screenshots/` directory:

```
screenshots/
├── button-primary.png
├── button-secondary.png
├── button-focus.png
├── input-default.png
├── input-error.png
├── form-mobile.png
├── form-desktop.png
└── ... etc
```

**Naming convention:**
- `{component}-{variant}.png` (e.g., `button-primary.png`)
- `{component}-{state}.png` (e.g., `button-focus.png`)
- `{component}-{viewport}.png` (e.g., `form-mobile.png`)

**Git ignore:**
Screenshots are NOT committed to git (`.gitignore` includes `screenshots/`). They're generated on-demand during design sessions.

---

## Best Practices

### 1. Always Verify Visually

Don't rely on CPQI data alone:
```
❌ "APCA 75, good enough!"
✅ "APCA 75, let me screenshot it to verify it looks readable"
```

### 2. Test All States

Components have multiple states:
- Default
- Hover
- Focus
- Active/pressed
- Disabled
- Error (for forms)

Screenshot each state to ensure consistency.

### 3. Use Realistic Content

Test with real content, not lorem ipsum:
```
❌ Screenshot with "Button Text"
✅ Screenshot with "Submit Application Form"
```

Longer text may cause layout issues.

### 4. Check Multiple Viewports

Responsive issues are common:
```
✅ Mobile (375px)
✅ Tablet (768px)
✅ Desktop (1920px)
```

### 5. Document Findings

When Claude identifies issues via screenshots:
```
## Visual Issues Found

- Button focus indicator barely visible on white background
  [screenshot: button-focus-issue.png]
  → Suggestion: Increase focus outline width to 3px

- Text truncates at mobile sizes
  [screenshot: form-mobile-truncation.png]
  → Suggestion: Reduce font size or allow wrapping
```

---

## Troubleshooting

### "Storybook not loading"

**Check if Storybook is running:**
```bash
curl http://localhost:6006
```

**Start Storybook manually:**
```bash
npm run storybook
```

### "Screenshots are blank"

**Add wait time for rendering:**
```typescript
await page.goto('...');
await page.waitForTimeout(1000); // Wait 1 second
await page.screenshot({ path: '...' });
```

### "Can't find element"

**Check Storybook story path:**
```typescript
// ❌ Wrong path
await page.goto('/story/button--primary');

// ✅ Correct path
await page.goto('/?path=/story/components-button--primary');
```

**Use Storybook UI to find correct path:**
1. Open http://localhost:6006
2. Navigate to story
3. Copy URL path

### "Tests timing out"

**Increase timeout in `playwright.config.ts`:**
```typescript
webServer: {
  command: 'npm run storybook',
  url: 'http://localhost:6006',
  timeout: 180 * 1000, // 3 minutes instead of 2
}
```

---

## Advanced Workflows

### Interactive Screenshot Session

**User:** "Let me see the button interactively"

**Claude can use Playwright UI mode:**
```bash
npm run test:playwright:ui
```

This opens an interactive browser where you can:
- Step through tests
- Pause and inspect
- Time-travel through test steps
- See screenshots in real-time

### Custom Screenshot Scripts

Create custom test files for specific workflows:

```typescript
// tests/custom-session.spec.ts
import { test } from '@playwright/test';

test('art director color review', async ({ page }) => {
  // Screenshot all components with new colors
  const components = [
    '/story/typography-heading--all-headings',
    '/story/components-button--all-variants',
    '/story/components-form-input--all-states',
  ];
  
  for (const component of components) {
    await page.goto(`/?path=${component}`);
    await page.screenshot({ 
      path: `screenshots/review-${component.split('--')[1]}.png`,
      fullPage: true 
    });
  }
});
```

**Run custom script:**
```bash
npx playwright test tests/custom-session.spec.ts
```

---

## Claude's Playwright MCP Capabilities

When Claude has Playwright MCP connected, Claude can:

### Navigation
- `browser_navigate(url)` - Go to any URL
- `browser_navigate_back()` - Go back

### Screenshots
- `browser_take_screenshot()` - Capture viewport
- `browser_take_screenshot(fullPage: true)` - Capture full page
- `browser_take_screenshot(element: "button")` - Capture specific element

### Interaction
- `browser_click(element: "button")` - Click elements
- `browser_type(element: "input", text: "...")` - Type text
- `browser_press_key(key: "Tab")` - Press keyboard keys
- `browser_hover(element: "...")` - Hover over elements

### Inspection
- `browser_snapshot()` - Get accessibility tree
- `browser_console_messages()` - View console logs
- `browser_network_requests()` - View network activity

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)
- [Storybook Documentation](https://storybook.js.org/)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)
