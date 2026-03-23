# CPQI CLI Workflow Examples

## Quick Reference: Common `cpqi` Commands

This document provides copy-paste examples for common CPQI CLI workflows.

---

## Scenario 1: Validate a Color Pair

**Goal:** Check if two colors have sufficient contrast

```bash
cpqi contrast "#3B82F6" "#FFFFFF" -q
# → 4.7  (WCAG ratio — passes 4.5 AA threshold)
```

### Interpreting WCAG Ratios:
- **≥ 7:1** — AAA (highest)
- **≥ 4.5:1** — AA Normal (standard body text)
- **≥ 3:1** — AA Large / UI components
- **< 3:1** — Fail

---

## Scenario 2: Convert Hex to OKLCH

**Goal:** Convert art direction hex colors to OKLCH for design tokens

```bash
cpqi meta "#3B82F6"
# → Lightness: 0.55, Chroma: 0.18, Hue: 250.8°

cpqi meta "#FFFFFF" --json
# → { oklch: { l: 1, c: 0, h: null }, ... }

cpqi meta "#1F2937" --json
# → { oklch: { l: 0.25, c: 0.01, h: 249 }, ... }
```

### Design Token Output:
```scss
$color-primary:    oklch(0.55 0.18 250.8);
$color-background: oklch(1 0 0);
$color-text:       oklch(0.25 0.01 249);
```

---

## Scenario 3: Fix Insufficient Contrast

**Goal:** Automatically find a compliant color alternative

### Problem:
```
Focus outline oklch(0.70 0.15 250) on white background
WCAG ratio: 2.1:1  (need 3:1 for UI components)
```

```bash
cpqi find "#FFFFFF" "oklch(0.70 0.15 250)" --target 3 -q
# → #3c6fa8  (adjusted color that meets 3:1)

# Verify the fix
cpqi contrast "#FFFFFF" "#3c6fa8" -q
# → 3.1 ✅
```

### Before vs After:
```scss
// Before (FAIL)
$color-focus: oklch(0.70 0.15 250); // WCAG 2.1:1 ❌

// After (PASS) — use hex from cpqi find, then convert back to OKLCH
$color-focus: oklch(0.51 0.15 250); // WCAG 3.1:1 ✅
```

---

## Scenario 4: Brand Color Audit

**Goal:** Validate an entire set of brand hex colors

```bash
# Convert all brand colors
cpqi meta "#082840"   # navy primary     → L=0.27 C=0.06 H=245
cpqi meta "#5F2B48"   # burgundy         → L=0.37 C=0.08 H=347
cpqi meta "#1493FB"   # azure accent     → L=0.65 C=0.18 H=250
cpqi meta "#6969F7"   # soft purple      → L=0.60 C=0.21 H=278
cpqi meta "#333333"   # text             → L=0.32 C=0   H=—

# Check key contrast pairs
cpqi contrast "#FFFFFF" "#082840" -q   # → 15.2 ✅
cpqi contrast "#FFFFFF" "#5F2B48" -q   # → 10.4 ✅
cpqi contrast "#333333" "#FFFFFF" -q   # → 12.6 ✅
cpqi contrast "#FFFFFF" "#1493FB" -q   # → 3.2  ❌ (azure needs dark text)
cpqi contrast "#FFFFFF" "#6969F7" -q   # → 4.0  ❌ (purple needs adjustment)

# Fix failures
cpqi find "#FFFFFF" "#6969F7" --target 4.5 -q   # → #5f5dea (4.6:1 ✅)
```

---

## Scenario 5: Generate Color Variants (Tonal Scale)

**Goal:** Create hover/active states from a base color

```bash
cpqi variants "#082840"
# → Prints adaptive tonal grid from light to dark

# Manual lightness steps for predictable hover/active:
# L=0.27 → base (#082840)
# L=0.22 → hover (darker)
# L=0.17 → active (darkest)

# Verify each state has sufficient contrast with white text:
cpqi contrast "#FFFFFF" "oklch(0.27 0.06 245.34)" -q   # base   → 15.2
cpqi contrast "#FFFFFF" "oklch(0.22 0.06 245.34)" -q   # hover  → 18.8
cpqi contrast "#FFFFFF" "oklch(0.17 0.05 245.34)" -q   # active → 20+
```

---

## Scenario 6: Validate All Button Variants

**Goal:** Check contrast for all button color combinations

```bash
# Primary button: white text on navy
cpqi contrast "#FFFFFF" "#082840" -q        # → 15.2 ✅

# Secondary button: white text on burgundy
cpqi contrast "#FFFFFF" "#5F2B48" -q        # → 10.4 ✅

# Tertiary button: dark text on light gray
cpqi contrast "#333333" "#E0E0E0" -q        # → 9.6 ✅

# Ghost button: navy text on white
cpqi contrast "#082840" "#FFFFFF" -q        # → 15.2 ✅
```

**All variants pass WCAG AA ✅**

---

## Scenario 7: Dark Mode Validation

**Goal:** Verify link/accent colors work on dark backgrounds

```bash
# Azure as link color on dark bg
cpqi contrast "#1493FB" "#15202B" -q   # → 2.5 ❌ (too low)

# Find a brighter azure that works on dark bg
cpqi find "#15202B" "#1493FB" --target 4.5 -q
# → adjusted hex ✅

# Purple highlight on dark bg
cpqi contrast "#6969F7" "#15202B" -q   # → 1.9 ❌

# Find compliant purple on dark bg
cpqi find "#15202B" "#6969F7" --target 4.5 -q
```

---

## Quick Cheat Sheet

```bash
# Convert hex to OKLCH
cpqi meta <hex>

# Check contrast (quiet output)
cpqi contrast <fg> <bg> -q

# Fix contrast (quiet output)
cpqi find <base> <color> --target 4.5 -q

# Generate tonal scale
cpqi variants <hex>

# Script-friendly JSON output
cpqi meta <hex> --json
```

---

## WCAG 2.1 Reference

| Ratio | Level | Use Cases |
|-------|-------|-----------|
| 7:1 | AAA Normal | Highest accessibility |
| 4.5:1 | AA Normal | Standard body text |
| 3:1 | AA Large, UI | Large text (18px+), UI components |
| < 3:1 | Fail | Not accessible |

---

## Resources

- [cpqi-cli repo](https://github.com/pawn002/cpqi-cli)
- [APCA Calculator](https://www.myndex.com/APCA/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OKLCH Color Picker](https://oklch.com/)
