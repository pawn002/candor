# CPQI CLI Integration Guide

## Overview

The Color Pair Quick Iterator (CPQI) is a local CLI tool for color accessibility workflows. This document explains how to install and use `cpqi` during design token iteration.

**Repo:** `github.com/pawn002/cpqi-cli`

---

## Install / Setup

CPQI is not published to npm yet. Build and install it locally:

```bash
# Clone the repo
git clone https://github.com/pawn002/cpqi-cli.git
cd cpqi-cli

# Install dependencies and build
npm install
npm run build

# Install globally (force-overwrite if upgrading)
npm install -g . --force

# Verify
cpqi --version
```

---

## Core Commands

### `cpqi meta <color>`
Convert a hex color to OKLCH and get full metadata.

```bash
cpqi meta "#3B82F6"
# → Lightness: 0.55, Chroma: 0.18, Hue: 250.8°

cpqi meta "#3B82F6" --json
# → { oklch: { l: 0.55, c: 0.18, h: 250.8 }, ... }
```

**When to use:** Converting art direction hex colors to OKLCH for design tokens.

---

### `cpqi contrast <fg> <bg>`
Calculate contrast ratio between two colors (WCAG 2.x by default).

```bash
cpqi contrast "#FFFFFF" "#082840"
# → 15.2

cpqi contrast "#FFFFFF" "#082840" -q
# → 15.2  (quiet mode — number only, good for scripts)
```

**When to use:** Validating token pairs before finalizing. Target ≥ 4.5 for body text (WCAG AA).

---

### `cpqi find <base> <color> --target <ratio>`
Adjust a color's lightness to meet a target contrast ratio against a base.

```bash
cpqi find "#FFFFFF" "#6969F7" --target 4.5 -q
# → #5f5dea  (adjusted purple that passes 4.5:1)

cpqi find "#FFFFFF" "#1493FB" --target 4.5
# → Prints full result: found/failed, OKLCH, iterations
```

**When to use:** Fixing accessibility violations while preserving hue/chroma.

---

### `cpqi variants <color>`
Generate an adaptive tonal palette from a base color.

```bash
cpqi variants "#082840"
# → Grid of hex swatches from light to dark
```

**When to use:** Exploring hover/active states, deriving a full scale from a brand color.

---

### `cpqi match <color>`
Find the nearest named or brand color match.

```bash
cpqi match "#082840"
```

---

### `cpqi lightness <color>`
Report the lightness channel only.

```bash
cpqi lightness "#082840"
# → 0.27
```

---

## Workflow Patterns

### Pattern 1: Brand Color Audit

When given hex colors from art direction:

```bash
# Step 1: Convert each hex to OKLCH
cpqi meta "#082840" --json   # navy primary
cpqi meta "#5F2B48" --json   # burgundy secondary
cpqi meta "#1493FB" --json   # azure accent

# Step 2: Check key text/bg pairs
cpqi contrast "#FFFFFF" "#082840" -q   # white on navy → 15.2 ✅
cpqi contrast "#FFFFFF" "#5F2B48" -q   # white on burgundy → 10.4 ✅
cpqi contrast "#333333" "#FFFFFF" -q   # dark text on white → 12.6 ✅

# Step 3: Fix any failures
cpqi find "#FFFFFF" "#6969F7" --target 4.5 -q   # → adjusted purple
```

### Pattern 2: Palette Building

```bash
# Generate tonal scale from primary
cpqi variants "#082840"

# Check each hover/active candidate
cpqi contrast "#FFFFFF" "oklch(0.22 0.06 245.34)" -q   # hover
cpqi contrast "#FFFFFF" "oklch(0.17 0.05 245.34)" -q   # active
```

### Pattern 3: Dark Mode Validation

```bash
# Check dark-mode link color on dark bg
cpqi contrast "#1493FB" "#15202B" -q   # azure on dark bg

# Find accessible alternative if needed
cpqi find "#15202B" "#1493FB" --target 4.5 -q
```

---

## Integration with Design Tokens

After running `cpqi meta` on brand colors, populate `src/design-tokens/colors.scss`:

```scss
// Round OKLCH values from cpqi meta output
$color-primary: oklch(0.27 0.06 245.34);   // #082840
$color-secondary: oklch(0.37 0.08 347.43); // #5F2B48
$color-accent: oklch(0.65 0.18 250.8);     // #1493FB
```

Verify each token pair before merging:

```bash
cpqi contrast "#FFFFFF" "oklch(0.27 0.06 245.34)" -q   # → 15.2 ✅
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Hex → OKLCH | `cpqi meta <hex>` |
| Check contrast | `cpqi contrast <fg> <bg> -q` |
| Fix failing color | `cpqi find <base> <color> --target 4.5 -q` |
| Generate tonal scale | `cpqi variants <hex>` |
| Script-friendly output | Add `-q` or `--json` flag |

---

## Resources

- [cpqi-cli repo](https://github.com/pawn002/cpqi-cli) — source code and AGENT_PLAYBOOK.md
- [APCA Calculator](https://www.myndex.com/APCA/)
- [OKLCH Color Space](https://oklch.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
