# Design Tokens Guide

## Overview

Design tokens are the single source of truth for all design decisions in this playground. They centralize colors, typography, spacing, and other design values, making it easy to iterate on art direction.

## Why Design Tokens?

**The Problem:**
Without tokens, design values are scattered across components:
```scss
// ❌ Hard-coded values everywhere
.button { 
  background: #3B82F6; 
  font-size: 16px; 
  padding: 12px 24px;
}
.card { 
  background: #3B82F6; 
  font-size: 16px; 
}
```

When art direction changes, you have to hunt down every instance.

**The Solution:**
With tokens, update once, cascade everywhere:
```scss
// ✅ Design tokens
$color-primary: oklch(0.55 0.18 250);
$font-size-md: 1rem;
$spacing-md: 1.5rem;

// Components use tokens
.button { 
  background: $color-primary; 
  font-size: $font-size-md; 
  padding: $spacing-md;
}
```

---

## Token Files

All design tokens live in `src/design-tokens/`:

```
src/design-tokens/
├── colors.scss       ← Color palette
├── typography.scss   ← Font families, sizes, weights
├── spacing.scss      ← Spacing scale
└── index.scss        ← Exports all tokens
```

### Importing Tokens

Tokens are automatically imported globally via `src/styles.scss`:

```scss
// src/styles.scss
@use './design-tokens' as *;
```

This means **all SCSS files can use token variables** without importing them.

---

## Colors (colors.scss)

### Format: OKLCH

We use **OKLCH** format instead of hex/RGB because:

1. **Perceptually uniform**: Equal changes create equal visual changes
2. **Predictable**: L=0.5 looks "mid-tone" across all hues
3. **klar CLI compatible**: Easy to manipulate programmatically with `klar` commands
4. **Better variants**: Generate tints/shades that look natural

### OKLCH Syntax

```scss
oklch(L C H)

// L = Lightness (0 to 1)
//     0 = black, 0.5 = mid-tone, 1 = white
//
// C = Chroma (0 to ~0.4)
//     0 = grayscale, 0.1 = muted, 0.3+ = vibrant
//
// H = Hue (0 to 360)
//     0/360 = red, 120 = green, 240 = blue, etc.
```

### Example Colors

```scss
// Primary Colors
$color-primary: oklch(0.55 0.18 250); // Blue
$color-primary-hover: oklch(0.45 0.18 250); // Darker blue (lower L)
$color-primary-active: oklch(0.35 0.18 250); // Even darker

// Neutral Colors
$color-background: oklch(0.98 0.01 250); // Almost white
$color-surface: oklch(0.95 0.01 250); // Light gray
$color-border: oklch(0.85 0.01 250); // Medium gray

// Text Colors
$color-text-primary: oklch(0.25 0.01 250); // Near black
$color-text-secondary: oklch(0.50 0.01 250); // Medium gray
$color-text-disabled: oklch(0.65 0.01 250); // Light gray

// Semantic Colors
$color-error: oklch(0.55 0.22 25); // Red
$color-success: oklch(0.55 0.15 145); // Green
$color-warning: oklch(0.65 0.18 85); // Orange
```

### Converting Hex to OKLCH

Use the klar CLI:

```bash
klar meta "#3B82F6"
# → Lightness: 0.55, Chroma: 0.18, Hue: 250.8°
# Use these values: oklch(0.55 0.18 250.8)
```

### Browser Compatibility

Modern browsers support OKLCH directly. For older browsers, add a fallback:

```scss
.button {
  background: #3B82F6; // Fallback for old browsers
  background: oklch(0.55 0.18 250); // Modern browsers
}
```

---

## Typography (typography.scss)

### Font Families

```scss
$font-family-base: system-ui, -apple-system, BlinkMacSystemFont, 
                   'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
$font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
                   Consolas, 'Courier New', monospace;
```

**System fonts** load instantly (no web font delay) and look native to each platform.

**To use a custom font:**
```scss
$font-family-base: 'Inter', system-ui, sans-serif;
```

Then add the font to `src/index.html` or import from Google Fonts.

### Type Scale

Based on **Major Third (1.25 ratio)**:

```scss
$font-scale: 1.25;

// Sizes
$font-size-xs: 0.64rem;   // ~10px
$font-size-sm: 0.8rem;    // ~13px
$font-size-md: 1rem;      // 16px (base)
$font-size-lg: 1.25rem;   // ~20px
$font-size-xl: 1.563rem;  // ~25px
$font-size-2xl: 1.953rem; // ~31px
$font-size-3xl: 2.441rem; // ~39px

// Heading sizes
$font-size-h1: $font-size-3xl; // ~39px
$font-size-h2: $font-size-2xl; // ~31px
$font-size-h3: $font-size-xl;  // ~25px
$font-size-h4: $font-size-lg;  // ~20px
$font-size-h5: $font-size-md;  // 16px
$font-size-h6: $font-size-sm;  // ~13px
```

**Why Major Third?**
- Creates noticeable size differences
- Not too extreme (like Perfect Fourth 1.33)
- Not too subtle (like Minor Second 1.125)
- Works well for UI and content

**Common type scales:**
- Minor Second: 1.125 (subtle)
- Major Second: 1.125 (subtle)
- Minor Third: 1.2 (moderate)
- **Major Third: 1.25** ← We use this
- Perfect Fourth: 1.333 (dramatic)
- Golden Ratio: 1.618 (very dramatic)

### Font Weights

```scss
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Line Heights

```scss
$line-height-tight: 1.25;  // Headlines
$line-height-normal: 1.5;  // Body text (default)
$line-height-loose: 1.75;  // Long-form content
```

### Letter Spacing

```scss
$letter-spacing-tight:   -0.025em; // Large headings
$letter-spacing-normal:  0;        // Default
$letter-spacing-relaxed: 0.03em;   // Small body text, captions — between normal and wide
$letter-spacing-wide:    0.05em;   // All caps, labels
```

---

## Spacing (spacing.scss)

### 8px Grid System

Based on **8px baseline**:

```scss
$spacing-unit: 0.5rem; // 8px

$spacing-xs: 0.5rem;   // 8px
$spacing-sm: 1rem;     // 16px
$spacing-md: 1.5rem;   // 24px
$spacing-lg: 2rem;     // 32px
$spacing-xl: 3rem;     // 48px
$spacing-2xl: 4rem;    // 64px
$spacing-3xl: 6rem;    // 96px
```

**Why 8px?**
- Most screen sizes divide evenly by 8
- Aligns with common component sizes (16, 24, 32, etc.)
- Easy mental math (2× = 16px, 3× = 24px)
- Industry standard (iOS, Material Design)

### Usage Examples

```scss
// Component spacing
.card {
  padding: $spacing-md; // 24px
  margin-bottom: $spacing-lg; // 32px
}

// Button padding
.button {
  padding: $spacing-sm $spacing-md; // 16px 24px (vertical horizontal)
}

// Section spacing
.section {
  margin-top: $spacing-2xl; // 64px
  padding: $spacing-xl 0; // 48px 0
}
```

### Spacing Scale Visualization

The **Spacing Showcase** component (`src/app/components/spacing/spacing-showcase.component.ts`) visually displays the spacing scale in Storybook.

---

## How to Update Tokens

### Scenario 1: New Art Direction Colors

**Art direction:** Primary color `#FF5733`, background `#FFFFFF`

1. **Convert to OKLCH** (ask Claude):
   ```
   User: "Convert #FF5733 to OKLCH"
   Claude: oklch(0.63 0.22 28)
   ```

2. **Update `colors.scss`:**
   ```scss
   $color-primary: oklch(0.63 0.22 28);
   $color-background: oklch(0.98 0.01 0);
   ```

3. **Validate with klar CLI** (Claude does this):
   ```bash
   klar contrast "#FF5733" "#FFFFFF" -q   # → check ratio ≥ 4.5
   ```

4. **View in Storybook:**
   ```bash
   npm run storybook
   ```
   All components automatically use new colors.

### Scenario 2: Change Typography

**Art direction:** Use Inter font, larger base size

1. **Update `typography.scss`:**
   ```scss
   $font-family-base: 'Inter', system-ui, sans-serif;
   $font-size-base: 1.125rem; // 18px instead of 16px
   ```

2. **Add font to `src/index.html`:**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

3. **All components automatically update** because they use `$font-family-base` and the type scale.

### Scenario 3: Tighter Spacing

**Art direction:** Reduce spacing for compact UI

1. **Update `spacing.scss`:**
   ```scss
   $spacing-unit: 0.375rem; // 6px instead of 8px
   
   // Scale automatically updates:
   $spacing-xs: 0.375rem;  // 6px
   $spacing-sm: 0.75rem;   // 12px
   $spacing-md: 1.125rem;  // 18px
   // ... etc
   ```

2. **Components automatically use new spacing.**

---

## Best Practices

### 1. Never Hard-Code Values

```scss
// ❌ Bad
.button { 
  background: #3B82F6; 
  padding: 16px;
}

// ✅ Good
.button { 
  background: $color-primary; 
  padding: $spacing-sm;
}
```

### 2. Use Semantic Token Names

```scss
// ❌ Bad (too specific)
$blue-500: oklch(0.55 0.18 250);
$blue-600: oklch(0.45 0.18 250);

// ✅ Good (semantic meaning)
$color-primary: oklch(0.55 0.18 250);
$color-primary-hover: oklch(0.45 0.18 250);
```

Semantic names make it clear **why** the color is used, not just what it looks like.

### 3. Start with Tokens, Not Components

When iterating on design:
1. **Update tokens first** → `src/design-tokens/colors.scss`
2. **View impact in Storybook** → See all components update
3. **Validate with CPQI CLI** → Claude checks accessibility
4. **Iterate on tokens** → Repeat until satisfied

Don't modify individual components unless the change is component-specific.

### 4. Document Constraints

When you discover limitations, add comments:

```scss
// Primary color requires minimum 14px text for accessibility (APCA 68)
$color-primary: oklch(0.63 0.22 28);

// Background cannot go darker than L=0.92 while maintaining contrast
$color-background: oklch(0.98 0.01 0);
```

### 5. Test in Context

Tokens look different in components vs. in isolation:
- View in **Storybook** with real components
- Use **Playwright** screenshots for visual verification
- Test on **different backgrounds** (use Storybook backgrounds addon)

---

## Token Naming Conventions

### Colors

```scss
// Pattern: $color-{purpose}-{variant}

$color-primary              // Main brand color
$color-primary-hover        // Hover state
$color-primary-active       // Active/pressed state

$color-text-primary         // Main text
$color-text-secondary       // Secondary text
$color-text-disabled        // Disabled text

$color-background           // Page background
$color-surface              // Card/panel background
$color-border               // Borders

$color-error                // Error state
$color-error-bg             // Error background
$color-success              // Success state
$color-warning              // Warning state
```

### Typography

```scss
// Font families
$font-family-{purpose}      // base, mono, display

// Font sizes
$font-size-{scale}          // xs, sm, md, lg, xl, 2xl, 3xl
$font-size-{element}        // h1, h2, h3, h4, h5, h6, body, caption

// Font weights
$font-weight-{name}         // regular, medium, semibold, bold

// Line heights
$line-height-{density}      // tight, normal, loose

// Letter spacing
$letter-spacing-{density}   // tight, normal, wide
```

### Spacing

```scss
// Pattern: $spacing-{scale}

$spacing-xs     // Extra small
$spacing-sm     // Small
$spacing-md     // Medium (default)
$spacing-lg     // Large
$spacing-xl     // Extra large
$spacing-2xl    // 2× extra large
$spacing-3xl    // 3× extra large
```

---

## Exporting Tokens

### For Other Platforms

You may want to export tokens to Figma, iOS, Android, etc.

**Future enhancement:**
```bash
npm run export-tokens
```

Would generate:
- `tokens.json` (generic format)
- `tokens.figma.json` (Figma plugin format)
- `Colors.swift` (iOS)
- `colors.xml` (Android)

---

## Troubleshooting

### "Changes not showing in Storybook"

1. **Restart Storybook:**
   ```bash
   # Stop Storybook (Ctrl+C)
   npm run storybook
   ```

2. **Clear cache:**
   ```bash
   rm -rf .storybook-cache node_modules/.cache
   npm run storybook
   ```

### "Colors look different than expected"

1. **Check browser support:** OKLCH is modern (Chrome 111+, Safari 15.4+)
2. **Add fallback hex:** Some older browsers need it
3. **Verify in multiple browsers:** Use Playwright to screenshot

### "Font not loading"

1. **Check import in `src/index.html`:**
   ```html
   <link href="https://fonts.googleapis.com/..." rel="stylesheet">
   ```

2. **Or import in `src/styles.scss`:**
   ```scss
   @import url('https://fonts.googleapis.com/...');
   ```

3. **Check network tab:** Verify font files are loading

---

## Resources

- [OKLCH Color Picker](https://oklch.com/)
- [Type Scale Calculator](https://typescale.com/)
- [Modular Scale](https://www.modularscale.com/)
- [8-Point Grid](https://spec.fm/specifics/8-pt-grid)
- [Design Tokens Community](https://designtokens.org/)
