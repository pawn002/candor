# CPQI Workflow Examples

## Quick Reference: Common CPQI Commands

This document provides copy-paste examples for common CPQI workflows.

---

## Scenario 1: Validate a Color Pair

**Goal:** Check if two colors have sufficient contrast

### User Command:
```
"Check the contrast between #3B82F6 and #FFFFFF using APCA"
```

### Claude's CPQI Calls:
```typescript
// Calculate contrast
calculate_contrast({
  colorOne: "#3B82F6",
  colorTwo: "#FFFFFF",
  contrastType: "apca"
})

// Result: APCA score (e.g., 85.2)
```

### Interpreting Results:
- **APCA 60+:** Good for body text (16px+)
- **APCA 75+:** Good for smaller text (12-14px)
- **APCA 90+:** Excellent, can use very small text (10px+)

---

## Scenario 2: Convert Hex to OKLCH

**Goal:** Convert art direction hex colors to OKLCH for design tokens

### User Command:
```
"Convert these colors to OKLCH: #3B82F6, #FFFFFF, #1F2937"
```

### Claude's CPQI Calls:
```typescript
get_color_meta({ color: "#3B82F6" })
// Result: { oklch: "oklch(0.55 0.18 250)", ... }

get_color_meta({ color: "#FFFFFF" })
// Result: { oklch: "oklch(0.98 0.01 0)", ... }

get_color_meta({ color: "#1F2937" })
// Result: { oklch: "oklch(0.25 0.01 250)", ... }
```

### Design Token Output:
```scss
$color-primary: oklch(0.55 0.18 250);
$color-background: oklch(0.98 0.01 0);
$color-text: oklch(0.25 0.01 250);
```

---

## Scenario 3: Fix Insufficient Contrast

**Goal:** Automatically find a compliant color alternative

### Problem:
```
Focus outline oklch(0.70 0.15 250) on white background
WCAG ratio: 2.1:1 (need 3:1 for UI components)
```

### User Command:
```
"Fix the focus color to meet WCAG 3:1 against white background"
```

### Claude's CPQI Call:
```typescript
find_target_contrast({
  baseColor: "#FFFFFF", // Keep background fixed
  referenceColor: "oklch(0.70 0.15 250)", // Adjust this
  targetContrast: 3,
  contrastType: "wcag2",
  tolerance: 0.5
})

// Result: oklch(0.55 0.15 250)
// New WCAG ratio: 3.2:1 ✅
```

### Before vs After:
```scss
// Before (FAIL)
$color-focus: oklch(0.70 0.15 250); // WCAG 2.1:1 ❌

// After (PASS)
$color-focus: oklch(0.55 0.15 250); // WCAG 3.2:1 ✅
```

---

## Scenario 4: Find Minimum Text Size

**Goal:** Determine the smallest readable text size for a color combination

### User Command:
```
"What's the minimum text size I can use with primary color on white?"
```

### Claude's CPQI Calls:
```typescript
// Option 1: From APCA score
calculate_contrast({
  colorOne: "oklch(0.55 0.18 250)", // primary
  colorTwo: "#FFFFFF", // background
  contrastType: "apca"
})
// Result: APCA 85

calculate_minimum_dimension({ apcaScore: 85 })
// Result: ~12px minimum

// Option 2: Direct method
get_minimum_dimension_for_colors({
  foreground: "oklch(0.55 0.18 250)",
  background: "#FFFFFF"
})
// Result: { apca: 85, minDimension: 12 }
```

### Recommendation:
```
APCA 85 → Minimum 12px
Current usage: 16px body text ✅
Safe to use 14px+ for UI labels
```

---

## Scenario 5: Generate Color Variants

**Goal:** Create a color scale from a base color

### User Command:
```
"Give me 5 lighter and 5 darker versions of our primary color"
```

### Claude's CPQI Call:
```typescript
generate_variants({
  color: "oklch(0.55 0.18 250)",
  lightSteps: 11, // Base + 5 lighter + 5 darker
  chromaSteps: 1, // Keep chroma constant
  colorSpace: "oklch"
})

// Result: Array of 11 colors
// [darkest] → [base] → [lightest]
```

### Generated Scale:
```scss
$color-primary-900: oklch(0.25 0.18 250); // Darkest
$color-primary-800: oklch(0.35 0.18 250);
$color-primary-700: oklch(0.45 0.18 250);
$color-primary-600: oklch(0.50 0.18 250);
$color-primary-500: oklch(0.55 0.18 250); // Base
$color-primary-400: oklch(0.65 0.18 250);
$color-primary-300: oklch(0.75 0.18 250);
$color-primary-200: oklch(0.85 0.18 250);
$color-primary-100: oklch(0.92 0.18 250); // Lightest
```

---

## Scenario 6: Validate All Button Variants

**Goal:** Check contrast for all button color combinations

### User Command:
```
"Validate all button variants meet APCA 60 for 16px text"
```

### Claude's Workflow:

```typescript
const buttons = [
  { name: 'Primary', fg: 'oklch(0.98 0.01 250)', bg: 'oklch(0.55 0.18 250)' },
  { name: 'Secondary', fg: 'oklch(0.25 0.01 250)', bg: 'oklch(0.90 0.01 0)' },
  { name: 'Tertiary', fg: 'oklch(0.55 0.18 250)', bg: 'oklch(0.98 0.01 0)' },
];

for (const button of buttons) {
  const result = await calculate_contrast({
    colorOne: button.fg,
    colorTwo: button.bg,
    contrastType: "apca"
  });
  
  console.log(`${button.name}: APCA ${result.score}`);
}
```

### Results Table:

| Button Variant | Foreground | Background | APCA Score | Status |
|---------------|------------|------------|------------|--------|
| Primary | White | Blue | 95.2 | ✅ Pass |
| Secondary | Dark Gray | Light Gray | 72.4 | ✅ Pass |
| Tertiary | Blue | White | 85.1 | ✅ Pass |
| Ghost | Blue | Transparent | 85.1 | ✅ Pass |

**All variants pass APCA 60 requirement ✅**

---

## Scenario 7: Test Multiple Algorithms

**Goal:** Compare APCA vs WCAG 2.1 for the same color pair

### User Command:
```
"Check button contrast with both APCA and WCAG"
```

### Claude's CPQI Calls:

```typescript
// APCA
calculate_contrast({
  colorOne: "#FFFFFF",
  colorTwo: "#3B82F6",
  contrastType: "apca"
})
// Result: 95.2

// WCAG 2.1
calculate_contrast({
  colorOne: "#FFFFFF",
  colorTwo: "#3B82F6",
  contrastType: "wcag2"
})
// Result: 6.8:1
```

### Comparison:

| Algorithm | Score | Requirements | Status |
|-----------|-------|--------------|--------|
| APCA | 95.2 | ≥60 for body text | ✅ Pass |
| WCAG 2.1 | 6.8:1 | ≥4.5:1 for AA Normal | ✅ Pass |
| WCAG 2.1 | 6.8:1 | ≥7:1 for AAA Normal | ❌ Fail |

**Recommendation:** Passes modern APCA and WCAG 2.1 AA. Close to AAA.

---

## Scenario 8: Match Color Vibrancy

**Goal:** Make two colors feel equally vibrant

### User Command:
```
"Match the chroma of our accent color to the primary color"
```

### Claude's CPQI Call:

```typescript
match_chromas({
  colorOne: "oklch(0.55 0.18 250)", // primary (chroma 0.18)
  colorTwo: "oklch(0.60 0.25 145)"  // accent (chroma 0.25)
})

// Result: {
//   adjustedColor: "oklch(0.60 0.18 145)",
//   originalChroma: 0.25,
//   matchedChroma: 0.18
// }
```

### Before vs After:

```scss
// Before - mismatched vibrancy
$color-primary: oklch(0.55 0.18 250); // Chroma 0.18
$color-accent: oklch(0.60 0.25 145);  // Chroma 0.25 (more vibrant)

// After - matched vibrancy
$color-primary: oklch(0.55 0.18 250); // Chroma 0.18
$color-accent: oklch(0.60 0.18 145);  // Chroma 0.18 (matched)
```

---

## Scenario 9: Check Color Gamut Limits

**Goal:** Find the darkest/lightest version of a color that stays in gamut

### User Command:
```
"How dark can I make this blue while keeping the same saturation?"
```

### Claude's CPQI Call:

```typescript
get_min_max_lightness({
  color: "oklch(0.55 0.18 250)"
})

// Result: {
//   min: 0.15,
//   max: 0.92,
//   color: "oklch(0.55 0.18 250)"
// }
```

### Interpretation:

```scss
// Valid range for chroma 0.18, hue 250
$color-darkest: oklch(0.15 0.18 250); // Minimum lightness
$color-base: oklch(0.55 0.18 250);    // Current
$color-lightest: oklch(0.92 0.18 250); // Maximum lightness

// Outside range - will be clipped/distorted
$color-too-dark: oklch(0.05 0.18 250);  // ❌ Out of gamut
$color-too-light: oklch(0.99 0.18 250); // ❌ Out of gamut
```

---

## Scenario 10: Batch Color Validation

**Goal:** Validate an entire color palette at once

### User Command:
```
"Validate all our colors against white and dark backgrounds"
```

### Claude's Workflow:

```typescript
const colors = {
  primary: "oklch(0.55 0.18 250)",
  error: "oklch(0.55 0.22 25)",
  success: "oklch(0.55 0.15 145)",
  warning: "oklch(0.65 0.18 85)"
};

const backgrounds = {
  light: "#FFFFFF",
  dark: "#1F2937"
};

// Test each color against each background
for (const [colorName, colorValue] of Object.entries(colors)) {
  for (const [bgName, bgValue] of Object.entries(backgrounds)) {
    const result = await calculate_contrast({
      colorOne: colorValue,
      colorTwo: bgValue,
      contrastType: "apca"
    });
    
    console.log(`${colorName} on ${bgName}: APCA ${result.score}`);
  }
}
```

### Results Matrix:

|         | White BG | Dark BG |
|---------|----------|---------|
| Primary | 85.2 ✅  | 78.4 ✅ |
| Error   | 72.1 ✅  | 68.9 ✅ |
| Success | 78.5 ✅  | 71.2 ✅ |
| Warning | 65.3 ✅  | 58.1 ❌ |

**Finding:** Warning color fails on dark background (APCA 58.1 < 60)

**Fix needed:**
```typescript
find_target_contrast({
  baseColor: "#1F2937", // dark bg
  referenceColor: "oklch(0.65 0.18 85)", // warning
  targetContrast: 60,
  contrastType: "apca"
})
// Result: oklch(0.75 0.18 85) → APCA 62.3 ✅
```

---

## Quick Cheat Sheet

### Check Contrast
```
calculate_contrast(color1, color2, "apca" | "wcag2")
```

### Convert to OKLCH
```
get_color_meta(hexColor)
```

### Fix Contrast
```
find_target_contrast(baseColor, referenceColor, target, "apca")
```

### Min Text Size
```
get_minimum_dimension_for_colors(fg, bg)
```

### Generate Variants
```
generate_variants(color, lightSteps, chromaSteps, "oklch")
```

### Match Vibrancy
```
match_chromas(color1, color2)
```

### Check Gamut
```
get_min_max_lightness(color)
```

---

## APCA Score Reference

| APCA Score | Minimum Size | Use Cases |
|------------|-------------|-----------|
| 90+ | 10px | Fine print, captions |
| 75+ | 12px | Labels, secondary text |
| 60+ | 14px | Body text |
| 45+ | 18px | Large text only |
| < 45 | Not recommended | Too low |

## WCAG 2.1 Reference

| Ratio | Level | Use Cases |
|-------|-------|-----------|
| 7:1 | AAA Normal | Highest accessibility |
| 4.5:1 | AA Normal | Standard body text |
| 3:1 | AA Large, UI | Large text (18px+), UI components |
| < 3:1 | Fail | Not accessible |

---

## Resources

- [APCA Calculator](https://www.myndex.com/APCA/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OKLCH Color Picker](https://oklch.com/)
