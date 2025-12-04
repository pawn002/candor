# CPQI MCP Integration Guide

## Overview

The Color Pair Quick Iterator (CPQI) MCP server provides Claude with powerful color accessibility tools. This document explains how Claude uses these tools during design iterations.

## Available CPQI Tools

### Core Color Operations

#### 1. `calculate_contrast`
Calculate contrast between two colors using multiple algorithms.

**Parameters:**
- `colorOne`: First color (hex, rgb, oklch, etc.)
- `colorTwo`: Second color  
- `contrastType`: Algorithm to use (`apca`, `bpca`, `deltaE`, `wcag2`)

**When Claude uses this:**
- Validating color pairs from design tokens
- Checking if button text meets contrast requirements
- Comparing multiple algorithm results

**Example:**
```
User: "Check if our primary button has enough contrast"
Claude uses: calculate_contrast(
  colorOne: "#FFFFFF",
  colorTwo: "oklch(0.55 0.18 250)", 
  contrastType: "apca"
)
Result: APCA score of 85.2 → Passes for body text (need 60+)
```

#### 2. `get_color_meta`
Extract color metadata including OKLCH values.

**Parameters:**
- `color`: Color in any format

**When Claude uses this:**
- Converting hex colors from art direction to OKLCH
- Understanding color properties before manipulation
- Extracting lightness/chroma values for calculations

**Example:**
```
User: "Convert #3B82F6 to OKLCH for our design tokens"
Claude uses: get_color_meta(color: "#3B82F6")
Result: oklch(0.55 0.18 250)
```

#### 3. `generate_color_pair`
Generate random accessible color pairs in OKLCH space.

**Parameters:**
- `minLightness`: Minimum lightness (0-100) - optional
- `maxLightness`: Maximum lightness (0-100) - optional

**When Claude uses this:**
- Exploring color options when art direction is vague
- Creating initial color palette suggestions
- Demonstrating accessible color combinations

#### 4. `generate_variants`
Generate color variant matrices in OKLCH or HSL space.

**Parameters:**
- `color`: Base color to generate variants from
- `lightSteps`: Number of lightness steps (default: 10)
- `chromaSteps`: Number of chroma/saturation steps (default: 5)
- `colorSpace`: Color space for variants (`oklch` or `hsl`)

**When Claude uses this:**
- Creating color scales for design systems
- Exploring tints/shades of a brand color
- Finding alternative colors in the same family

**Example:**
```
User: "Show me 5 lighter and darker versions of our primary color"
Claude uses: generate_variants(
  color: "oklch(0.55 0.18 250)",
  lightSteps: 11,
  chromaSteps: 1,
  colorSpace: "oklch"
)
Result: Array of colors from light to dark
```

### Advanced Color Manipulation

#### 5. `match_chromas`
Match chroma values between two colors while maintaining hue and lightness.

**Parameters:**
- `colorOne`: First color
- `colorTwo`: Second color

**When Claude uses this:**
- Creating visually cohesive color palettes
- Ensuring colors have similar vibrancy
- Maintaining color harmony across components

#### 6. `get_min_max_lightness`
Calculate gamut boundaries for a color in sRGB space.

**Parameters:**
- `color`: Color to analyze

**When Claude uses this:**
- Understanding color limitations
- Finding valid lightness range for a specific hue/chroma
- Avoiding out-of-gamut colors

**Example:**
```
User: "Can I make this color darker while keeping the same saturation?"
Claude uses: get_min_max_lightness(color: "oklch(0.55 0.18 250)")
Result: min: 0.15, max: 0.92 → You can go darker to L=0.15
```

#### 7. `find_target_contrast`
Find a color that meets target contrast by adjusting lightness only.

**Parameters:**
- `baseColor`: Color to keep fixed
- `referenceColor`: Color to adjust (lightness only)
- `targetContrast`: Target contrast value
- `contrastType`: Algorithm to use
- `tolerance`: Acceptable contrast difference (default: 0.5)

**When Claude uses this:**
- Fixing accessibility violations
- Finding compliant alternatives automatically
- Maintaining hue while meeting contrast requirements

**Example:**
```
User: "Our button text doesn't meet APCA 60. Fix it."
Claude uses: find_target_contrast(
  baseColor: "oklch(0.55 0.18 250)", // button bg
  referenceColor: "#FFFFFF", // button text
  targetContrast: 60,
  contrastType: "apca",
  tolerance: 0.5
)
Result: oklch(0.95 0.01 250) → Adjusted text color that meets target
```

### Accessibility Calculations

#### 8. `calculate_minimum_dimension`
Calculate minimum object dimension (pixels) from APCA contrast score.

**Parameters:**
- `apcaScore`: APCA contrast score

**When Claude uses this:**
- Determining minimum font sizes for readability
- Calculating minimum button/icon sizes
- Recommending text size adjustments

**Example:**
```
APCA 60 → Minimum ~16px for body text
APCA 75 → Minimum ~12px for labels
APCA 90 → Minimum ~10px for captions
```

#### 9. `get_minimum_dimension_for_colors`
Convenience tool: Calculate minimum dimension directly from color pair.

**Parameters:**
- `foreground`: Foreground color
- `background`: Background color

**When Claude uses this:**
- Quick checks during design review
- Validating text sizes for specific color combinations
- One-step accessibility assessment

**Example:**
```
User: "Can I use 14px text with these colors?"
Claude uses: get_minimum_dimension_for_colors(
  foreground: "oklch(0.25 0.01 250)",
  background: "oklch(0.98 0.01 250)"
)
Result: APCA 95 → Min 10px → YES, 14px is fine
```

---

## Typical Claude Workflow

### Scenario 1: Validate Art Direction

**User provides:** Primary color #FF5733, white background

**Claude's process:**
1. **Convert to OKLCH:**
   ```
   get_color_meta(color: "#FF5733")
   → oklch(0.63 0.22 28)
   ```

2. **Check contrast:**
   ```
   calculate_contrast(
     colorOne: "oklch(0.63 0.22 28)",
     colorTwo: "#FFFFFF",
     contrastType: "apca"
   )
   → APCA score: 68.5
   ```

3. **Determine minimum sizes:**
   ```
   get_minimum_dimension_for_colors(
     foreground: "oklch(0.63 0.22 28)",
     background: "#FFFFFF"
   )
   → Min dimension: ~14px for body text
   ```

4. **Report to user:**
   - ✅ Color meets APCA 60 for body text
   - ⚠️ Requires minimum 14px font size
   - ✅ Good for buttons with 16px text

### Scenario 2: Fix Accessibility Violation

**User:** "Button focus state doesn't have enough contrast"

**Claude's process:**
1. **Measure current contrast:**
   ```
   calculate_contrast(
     colorOne: "oklch(0.55 0.18 250)", // button bg
     colorTwo: "oklch(0.60 0.20 250)", // focus outline
     contrastType: "wcag2"
   )
   → WCAG 2.1 ratio: 1.8:1 (needs 3:1 for UI components)
   ```

2. **Find compliant alternative:**
   ```
   find_target_contrast(
     baseColor: "oklch(0.55 0.18 250)",
     referenceColor: "oklch(0.60 0.20 250)",
     targetContrast: 3,
     contrastType: "wcag2"
   )
   → oklch(0.85 0.20 250) → WCAG 3.2:1 ✅
   ```

3. **Update design tokens:**
   ```scss
   $color-focus: oklch(0.85 0.20 250);
   ```

4. **Verify visually with Playwright screenshot**

### Scenario 3: Generate Color Variants

**User:** "Give me 5 shades of our primary color for hover states"

**Claude's process:**
1. **Generate variants:**
   ```
   generate_variants(
     color: "oklch(0.55 0.18 250)",
     lightSteps: 5,
     chromaSteps: 1,
     colorSpace: "oklch"
   )
   → Returns array of 5 colors
   ```

2. **Test each variant's contrast with white:**
   ```
   For each variant:
     calculate_contrast(variant, "#FFFFFF", "apca")
   ```

3. **Recommend best options:**
   - Normal: oklch(0.55 0.18 250) → APCA 75
   - Hover: oklch(0.45 0.18 250) → APCA 85
   - Active: oklch(0.35 0.18 250) → APCA 95
   - All meet body text requirements ✅

---

## Integration with Design Tokens

### Colors in OKLCH Format

CPQI tools work best with OKLCH colors because:
- **Perceptually uniform**: Equal changes in L/C/H create equal perceptual changes
- **Predictable lightness**: L=0.5 looks equally "mid-tone" across all hues
- **Easy manipulation**: Can adjust L, C, H independently

**Design tokens pattern:**
```scss
// colors.scss
$color-primary: oklch(0.55 0.18 250);
$color-primary-hover: oklch(0.45 0.18 250); // Darker (lower L)
$color-primary-text: oklch(0.98 0.01 250); // Near white
```

### Validation Workflow

1. **Designer provides hex colors** → Claude converts to OKLCH
2. **Claude validates all color pairs** in components
3. **If violations found** → Claude uses `find_target_contrast`
4. **Claude updates tokens** → Components automatically reflect changes
5. **Visual verification** → Playwright screenshots

---

## Best Practices

### 1. Always Test Multiple Algorithms

Different contexts need different algorithms:
- **APCA**: Best for text contrast (modern, perceptual)
- **WCAG 2.x**: Required for compliance with WCAG 2.1/2.2
- **Delta E**: Useful for spot colors, logos, graphics

**Claude's approach:**
```
calculate_contrast with "apca" → Primary check
calculate_contrast with "wcag2" → Compliance verification
```

### 2. Document Constraints

When CPQI identifies limitations, document them:
```
## Constraints Identified

- Primary color #FF5733 requires minimum 14px text
- Focus indicators must be L=0.85+ for 3:1 contrast
- Background cannot go darker than L=0.15 (gamut limit)
```

### 3. Use `find_target_contrast` for Fixes

Instead of guessing, let CPQI calculate compliant colors:
```
❌ Manual: "Try making it lighter... lighter... lighter..."
✅ CPQI: find_target_contrast → Gets it right immediately
```

### 4. Leverage OKLCH Benefits

Keep the same hue/chroma, only adjust lightness:
```
Original: oklch(0.30 0.18 250) → Too dark
Target contrast: APCA 75
find_target_contrast → oklch(0.25 0.18 250) → Same hue, just lighter
```

---

## Common Scenarios

### "Does this color combination work?"

```
calculate_contrast + get_minimum_dimension_for_colors
→ Instant answer with minimum sizes
```

### "Fix this accessibility violation"

```
find_target_contrast
→ Returns compliant color automatically
```

### "Show me color options"

```
generate_variants → Creates palette
For each: calculate_contrast → Tests accessibility
→ Returns filtered list of compliant options
```

### "Convert this design to OKLCH tokens"

```
For each hex color:
  get_color_meta → Extract OKLCH values
→ Populate design token files
```

---

## Limitations & Considerations

### CPQI Provides Data, Not Design

CPQI tells you:
- ✅ "This has APCA 75 contrast"
- ✅ "Minimum 14px for readability"

CPQI doesn't tell you:
- ❌ Whether it looks good
- ❌ If it matches brand guidelines
- ❌ User preference decisions

**Solution:** Combine CPQI data with Playwright visual inspection

### Out-of-Gamut Colors

Some OKLCH colors can't be displayed in sRGB:
- Very high chroma values
- Extreme lightness + high chroma combinations

**Claude's approach:**
1. Use `get_min_max_lightness` to check boundaries
2. Stay within safe ranges
3. Test in browser via Playwright

### Algorithm Differences

APCA and WCAG 2.x can give different results:
- APCA 60 ≈ WCAG 4.5:1 (but not exactly)
- APCA is perceptual, WCAG 2.x is mathematical

**Best practice:** Test both, prioritize APCA, verify WCAG for compliance

---

## Resources

- [CPQI Documentation](https://github.com/pawn002/cpqi-frontend-and-backend)
- [APCA Calculator](https://www.myndex.com/APCA/)
- [OKLCH Color Space](https://oklch.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
