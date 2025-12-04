# Design System Playground - Workflow Guide

## Overview

This playground enables rapid iteration on design ideas with real-time accessibility validation using Claude Code, Playwright MCP, and CPQI MCP.

## Quick Start

### 1. Start Storybook

```bash
npm run storybook
```

Storybook will start on http://localhost:6006

### 2. View Components

Browse all components and their variations in Storybook. The playground includes:
- **Typography**: Headings (h1-h6) and text variants
- **Buttons**: Primary, secondary, tertiary, ghost variants in multiple sizes
- **Forms**: Inputs, checkboxes, radio buttons with accessible states
- **Spacing**: Visual representation of the spacing scale

---

## Typical Design Iteration Session

### Step 1: Receive Art Direction

You receive specs from creative leads:
- Primary color: `#3B82F6`
- Background: `#FFFFFF`
- Font: `Inter`
- Spacing: Standard 8px grid

### Step 2: Update Design Tokens

Modify the token files in `src/design-tokens/`:

**colors.scss:**
```scss
$color-primary: oklch(0.55 0.18 250); // Convert #3B82F6 to OKLCH
```

**typography.scss:**
```scss
$font-family-base: 'Inter', system-ui, sans-serif;
```

### Step 3: Visual Inspection (Claude)

Claude uses Playwright MCP to:
1. Navigate to Storybook stories
2. Screenshot components
3. Visually evaluate against art direction

**Example Claude command:**
> "Screenshot all button variants and show me the results"

### Step 4: Accessibility Validation (Claude)

Claude uses CPQI MCP to:
1. Extract colors from components
2. Calculate contrast ratios (APCA, WCAG)
3. Determine minimum dimensions for text sizes
4. Identify violations

**Example CPQI tools used:**
- `calculate_contrast`: Check color pair contrast
- `get_minimum_dimension_for_colors`: Find minimum readable sizes
- `find_target_contrast`: Suggest compliant alternatives

### Step 5: Iterate

If issues found:
- Claude suggests color adjustments using CPQI `find_target_contrast`
- Update design tokens
- Repeat Steps 3-4

### Step 6: Report Results

Claude generates a session report:
- Original specs vs. final tokens
- Accessibility constraints identified
- Screenshots as evidence
- Recommendations for creative leads

---

## Working with Claude

### Example Commands

**Test a color combination:**
```
"Try primary color #FF5733 on white background for buttons. 
Check if it meets APCA 60 for body text."
```

**Generate color variants:**
```
"Generate 5 variations of the current primary color that maintain 
at least APCA 75 contrast with white background."
```

**Check minimum text sizes:**
```
"What's the minimum font size I can use for body text with the 
current primary color on white background?"
```

**Screenshot specific components:**
```
"Screenshot all button states (default, hover, focus, disabled) 
and show me the focus indicators."
```

---

## Design Tokens

### Colors (OKLCH Format)

OKLCH provides perceptual uniformity, making it easier to:
- Generate color variants programmatically
- Maintain consistent lightness across hues
- Work with CPQI MCP tools

**Converting hex to OKLCH:**
Claude can help convert hex colors to OKLCH using CPQI `get_color_meta` tool.

### Typography Scale

Based on a **Major Third (1.25)** ratio:
- Base: 16px (1rem)
- Scale up: multiply by 1.25
- Scale down: divide by 1.25

### Spacing Scale

Based on **8px grid**:
- xs: 8px
- sm: 16px
- md: 24px
- lg: 32px
- xl: 48px
- 2xl: 64px
- 3xl: 96px

---

## Running Tests

### Visual Regression Tests

```bash
npm run test:playwright
```

Captures screenshots of all component variants.

### Accessibility Tests

Tests keyboard navigation, focus states, and ARIA attributes.

### View Test Results

```bash
npx playwright show-report
```

---

## Playwright MCP Integration

Claude can use Playwright MCP to:

1. **Navigate Storybook:**
   - Go to specific stories
   - Switch between component variants

2. **Capture Screenshots:**
   - Individual components
   - Full component matrices
   - Specific states (hover, focus, etc.)

3. **Test Interactions:**
   - Keyboard navigation
   - Focus management
   - Form interactions

**Example workflow:**
```
Claude: "I'll navigate to the button story and capture all variants"
→ Uses Playwright MCP to goto story
→ Takes screenshot
→ Analyzes visual result
→ Checks colors with CPQI
```

---

## CPQI MCP Integration

See [CPQI-INTEGRATION.md](./CPQI-INTEGRATION.md) for detailed information.

---

## Tips for Success

### 1. Start with Tokens
Always modify design tokens first, never hard-code values in components.

### 2. Use OKLCH for Colors
OKLCH makes it easier for Claude to generate and manipulate colors programmatically.

### 3. Document Constraints
When Claude identifies accessibility constraints, document them for creative leads.

### 4. Iterate in Small Steps
Test one change at a time to understand its impact.

### 5. Screenshot Everything
Visual evidence helps communicate design decisions to stakeholders.

---

## Troubleshooting

### Storybook won't start
```bash
# Clear cache and reinstall
rm -rf node_modules .storybook-cache
npm install
npm run storybook
```

### Components not showing in Storybook
Check that the `.stories.ts` file is in the correct location and properly exported.

### Playwright tests failing
Ensure Storybook is running on port 6006 before running tests.

---

## Next Steps

1. **Add More Components**: Extend the library as needed
2. **Custom Color Palettes**: Create brand-specific token sets
3. **Export Tokens**: Generate tokens for other platforms (Figma, iOS, Android)
4. **CI/CD Integration**: Automate visual regression tests

---

## Resources

- [Storybook Documentation](https://storybook.js.org/)
- [Playwright Documentation](https://playwright.dev/)
- [OKLCH Color Space](https://oklch.com/)
- [APCA Contrast Calculator](https://www.myndex.com/APCA/)
