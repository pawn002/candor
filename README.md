# Design System Playground

An Angular + Storybook sandbox for rapidly iterating on design ideas with real-time accessibility validation. Built to bridge the gap between art direction and accessibility using AI-assisted workflows with Claude Code, Playwright MCP, and CPQI MCP.

## Overview

This playground enables design integrators to:
- Receive art direction specs and quickly prototype components
- Use Claude Code with Playwright MCP for visual feedback
- Validate colors and accessibility with CPQI MCP
- Identify design constraints and communicate findings to creative leads
- Iterate rapidly with confidence that designs are accessible

## Features

- **Design Token System**: Centralized SCSS tokens for colors (OKLCH), typography, and spacing
- **Component Library**: Typography, buttons, forms, and spacing showcases
- **Storybook Integration**: Visual component catalog with accessibility addon
- **Playwright Testing**: Visual regression and accessibility testing
- **CPQI Integration**: Color accessibility validation tools
- **Claude-Optimized Workflow**: Built for AI-assisted design iteration

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- CPQI MCP Server (optional, for Claude accessibility validation)
- Playwright MCP Server (optional, for Claude visual inspection)

### Installation

```bash
# Clone the repository
git clone https://github.com/pawn002/design-system-playground.git
cd design-system-playground

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Running Storybook

```bash
npm run storybook
```

Opens Storybook at http://localhost:6006

### Running Tests

```bash
# Run all Playwright tests
npm run test:playwright

# Run tests in UI mode
npm run test:playwright:ui

# View test report
npx playwright show-report
```

### Running Angular App

```bash
npm start
```

Opens app at http://localhost:4200

## Project Structure

```
design-system-playground/
├── .storybook/                 # Storybook configuration
│   ├── main.ts                 # Storybook setup
│   └── preview.ts              # Global decorators
├── docs/                       # Documentation
│   ├── WORKFLOW.md             # Step-by-step workflow guide
│   ├── DESIGN-TOKENS.md        # Design tokens guide
│   ├── CPQI-INTEGRATION.md     # CPQI MCP usage
│   ├── PLAYWRIGHT-WORKFLOW.md  # Playwright MCP usage
│   └── examples/               # Session templates
├── src/
│   ├── app/
│   │   ├── components/         # Component library
│   │   │   ├── typography/     # Heading, text components
│   │   │   ├── button/         # Button component
│   │   │   ├── form/           # Input, checkbox, radio
│   │   │   └── spacing/        # Spacing showcase
│   │   └── examples/           # Composed examples (Phase 7)
│   ├── design-tokens/          # Design tokens
│   │   ├── colors.scss         # OKLCH color palette
│   │   ├── typography.scss     # Font families, sizes, scale
│   │   ├── spacing.scss        # 8px grid spacing
│   │   └── index.scss          # Token exports
│   ├── main.ts                 # Angular entry point
│   ├── index.html              # HTML template
│   └── styles.scss             # Global styles
├── tests/                      # Playwright tests
│   ├── visual-regression.spec.ts
│   ├── accessibility.spec.ts
│   └── storybook-snapshots.spec.ts
├── screenshots/                # Generated screenshots
├── angular.json                # Angular config
├── package.json                # Dependencies
├── playwright.config.ts        # Playwright config
└── README.md                   # This file
```

## Documentation

- **[WORKFLOW.md](./docs/WORKFLOW.md)** - Complete workflow guide for using the playground
- **[DESIGN-TOKENS.md](./docs/DESIGN-TOKENS.md)** - How to modify and work with design tokens
- **[CPQI-INTEGRATION.md](./docs/CPQI-INTEGRATION.md)** - How Claude uses CPQI for color validation
- **[PLAYWRIGHT-WORKFLOW.md](./docs/PLAYWRIGHT-WORKFLOW.md)** - How Claude uses Playwright for visual inspection
- **[examples/art-direction-session.md](./docs/examples/art-direction-session.md)** - Session template
- **[examples/cpqi-workflow.md](./docs/examples/cpqi-workflow.md)** - CPQI command examples

## Typical Design Iteration Session

### Step 1: Receive Art Direction

Creative lead provides specs:
- Primary color: `#3B82F6`
- Background: `#FFFFFF`
- Font: `Inter`
- Spacing: 8px grid

### Step 2: Update Design Tokens

Modify `src/design-tokens/colors.scss`:

```scss
$color-primary: oklch(0.55 0.18 250); // Converted from #3B82F6
$color-background: oklch(0.98 0.01 0); // Converted from #FFFFFF
```

### Step 3: Visual Inspection (Claude)

Claude uses Playwright MCP to:
- Navigate to Storybook stories
- Screenshot components
- Evaluate visual result

### Step 4: Accessibility Validation (Claude)

Claude uses CPQI MCP to:
- Calculate contrast ratios (APCA, WCAG)
- Determine minimum text sizes
- Identify violations
- Suggest compliant alternatives

### Step 5: Iterate

If issues found:
- Claude uses CPQI to find fixes
- Update design tokens
- Repeat until satisfied

### Step 6: Report Results

Claude generates session report with:
- Original specs vs. final tokens
- Accessibility constraints identified
- Screenshots as evidence
- Recommendations for creative leads

## Working with Claude

### Example Commands

**Validate colors:**
```
"Check if primary button meets APCA 60 for body text"
```

**Generate variants:**
```
"Give me 5 color variants that maintain APCA 75+ contrast"
```

**Fix violations:**
```
"Our focus indicator doesn't meet WCAG 3:1. Fix it."
```

**Screenshot components:**
```
"Screenshot all button states and show me the focus indicators"
```

## Design Tokens

### Colors (OKLCH Format)

We use OKLCH instead of hex/RGB because:
- Perceptually uniform
- Predictable lightness across hues
- CPQI-compatible for programmatic manipulation
- Better for generating variants

**Example:**
```scss
$color-primary: oklch(0.55 0.18 250);
// L = 0.55 (lightness, 0-1)
// C = 0.18 (chroma/saturation)
// H = 250 (hue, degrees)
```

### Typography Scale

Based on **Major Third (1.25 ratio)**:
- `$font-size-md`: 1rem (16px) - base
- `$font-size-lg`: 1.25rem (~20px)
- `$font-size-xl`: 1.563rem (~25px)

### Spacing Scale

Based on **8px grid**:
- `$spacing-xs`: 0.5rem (8px)
- `$spacing-sm`: 1rem (16px)
- `$spacing-md`: 1.5rem (24px)
- `$spacing-lg`: 2rem (32px)

## Running Tests

### Visual Regression Tests

```bash
npm run test:playwright -- tests/visual-regression.spec.ts
```

Captures screenshots of components for visual comparison.

### Accessibility Tests

```bash
npm run test:playwright -- tests/accessibility.spec.ts
```

Tests keyboard navigation, focus states, ARIA attributes.

### Storybook Snapshots

```bash
npm run test:playwright -- tests/storybook-snapshots.spec.ts
```

Captures all Storybook stories automatically.

### View Results

```bash
npx playwright show-report
```

## Playwright MCP Integration

When Claude has Playwright MCP connected, Claude can:

- **Navigate** to Storybook stories
- **Screenshot** components in various states
- **Test** keyboard navigation
- **Verify** focus indicators
- **Capture** responsive layouts

See [PLAYWRIGHT-WORKFLOW.md](./docs/PLAYWRIGHT-WORKFLOW.md) for details.

## CPQI MCP Integration

When Claude has CPQI MCP connected, Claude can:

- **Calculate contrast** using APCA, WCAG, Delta E, BPCA
- **Convert colors** from hex to OKLCH
- **Find compliant alternatives** automatically
- **Generate color variants** with maintained contrast
- **Determine minimum sizes** for readability
- **Match color vibrancy** across palette

See [CPQI-INTEGRATION.md](./docs/CPQI-INTEGRATION.md) for details.

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

## Troubleshooting

### Storybook won't start

```bash
# Clear cache and reinstall
rm -rf node_modules .storybook-cache
npm install
npm run storybook
```

### Components not showing in Storybook

Check that `.stories.ts` files are in the correct location and properly exported.

### Playwright tests failing

Ensure Storybook is running on port 6006 before running tests, or let Playwright auto-start it.

### Colors look different than expected

1. Check browser support for OKLCH (Chrome 111+, Safari 15.4+)
2. Add hex fallback for older browsers
3. Verify in multiple browsers using Playwright

## Tech Stack

- **Angular 19** - Frontend framework
- **Storybook 8** - Component development environment
- **Playwright** - Testing and visual inspection
- **TypeScript** - Type safety
- **SCSS** - Styling with design tokens
- **OKLCH** - Perceptually uniform color space
- **CPQI MCP** - Color accessibility tools
- **Playwright MCP** - Browser automation for Claude

## Contributing

This is a personal project for design iteration workflows. Feel free to fork and adapt to your needs.

## License

ISC

## Resources

- [Storybook Documentation](https://storybook.js.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Angular Documentation](https://angular.dev/)
- [OKLCH Color Space](https://oklch.com/)
- [APCA Contrast](https://www.myndex.com/APCA/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CPQI Project](https://github.com/pawn002/cpqi-frontend-and-backend)

## Author

J. Z. Rioflorido - Design Integrator specializing in bridging art direction and accessibility

## Acknowledgments

- Built for use with Claude Code and Anthropic's MCP ecosystem
- Inspired by the need to rapidly iterate on accessible designs
- Thanks to the design systems community for best practices
