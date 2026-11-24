# Scatter observer survey

Status: data only. Nothing here is a gate, and no token was changed to produce it.

First measured 2026-11-19 against the tokens at commit `8a909d6` (branch `chore/klar-4-reaudit`): 132 pairings, 260 enforced measurements. Re-measured 2026-11-20 at commit `c6ba1e9` (branch `feat/derive-colour-ramps`), after the dark-mode tuning this survey prompted: 134 pairings, 264 enforced measurements. Both times every pairing in `audit/pairings.json` was scored in both modes, with 4 exempt measurements listed in the full table and left out of every count.

The full table is the 2026-11-20 re-measure. The 2026-11-19 findings are kept as the record of what the tuning set out to fix.

## What the scatter observer models

okca 3.0.0 accepts an experimental option, `{ observer: 'scatter' }`, for an eye whose optics scatter light, as with an ageing or clouded lens. It adds a veil of 0.155 times the background's luminance over both colours. A bright background therefore costs contrast and a dark one costs almost nothing: black on white scores 5.2 under scatter and 20.9 under the default observer, while white on black scores 20.9 under both. It never scores above the default observer, so a pass under scatter is also a pass under default okca and under WCAG 2.

Three limits on reading these figures:

1. **One severity.** 0.155 is a single fixed veil, not a population of lens conditions.
2. **Outside semver.** okca marks the option experimental: it may change or be removed in any minor release. Every figure here is pinned to okca 3.0.0 exactly.
3. **Same floors, different question.** The `min` column is Candor's floor for the default observer. Comparing scatter against it asks "would this pairing still clear Candor's floor for a scattering eye", which is meaningful in dark mode and structurally unanswerable in light mode (see below).

## Status on 2026-11-20

Scatter is a tuning aid for dark mode, not a gate (decided 2026-11-19). The audit and every recorded figure stay on the default observer, and dark-mode changes are reported under both while the tuning lasts.

### Dark mode: 132 of 132 pass under scatter

Every Group A and Group B miss below is resolved. Group B by changing the design, not a text colour: the dark fills are deep (navy-600, and burgundy-800 for the secondary fill) with a pale label, and the inverse band is navy-700. Group A by moving grey steps 200 and 400 where dark text needed them. The scatter observer now costs a median of 0.1 and at most 0.5.

2 pairings sit exactly on their floor under scatter, both the dark error red (step 300 of the red ramp) on the card surface. They were 5.3 before the status colours moved onto ramps. A change to that red or to `bg.surface` will take them below.

| pairing | fg | bg | min | okca | scatter |
|---|---|---|---|---|---|
| `button-destructive-on-surface` | `action.destructive-text` | `bg.surface` (L 0.24) | 4.5 | 4.6 | 4.5 |
| `status-title-error` | `status.error-text` | `bg.surface` (L 0.24) | 4.5 | 4.6 | 4.5 |

11 more clear it by 0.1, 7 of them the dark subtle greys on a card (the former Group A).

### Light mode

Unchanged in kind: 95 of 118 light-fill measurements fall below their floor under scatter (median cost 2.9, at most 8.9), and the 14 light-mode pairings on dark fills all pass. The ceiling described below still holds.

## Findings on 2026-11-19

### Dark mode: 111 of 130 pass under scatter

On dark fills the scatter observer costs a median of 0.1 and at most 0.4. Dark mode is already close to scatter-robust. The 19 misses fall into two groups.

**Group A: pairings sitting on their floor (9).** Each clears its floor under the default observer by 0.2 or less and loses 0.1 to 0.3 under scatter: a dark surface at L 0.24 to 0.40 still carries a little luminance. A text token one ramp step lighter would likely clear these; nothing structural is involved.

| pairing | fg | bg | min | okca | scatter |
|---|---|---|---|---|---|
| `stat-label` | `text.subtle-on-surface` | `bg.surface` (L 0.24) | 4.5 | 4.5 | 4.4 |
| `data-grid-colheader` | `text.subtle-on-surface` | `bg.surface` (L 0.24) | 4.5 | 4.5 | 4.4 |
| `data-grid-rowheader` | `text.subtle-on-surface` | `bg.surface` (L 0.24) | 4.5 | 4.5 | 4.4 |
| `badge-default` | `text.default` | `bg.muted` (L 0.4) | 4.5 | 4.7 | 4.4 |
| `button-ghost-hover` | `text.default` | `bg.hover` (L 0.4) | 4.5 | 4.7 | 4.4 |
| `toast-message-info` | `toast.message` | `bg.surface` (L 0.24) | 4.5 | 4.5 | 4.4 |
| `nav-link` | `text.subtle-on-surface` | `bg.surface` (L 0.24) | 4.5 | 4.5 | 4.4 |
| `card-footer` | `text.subtle-on-surface` | `bg.surface` (L 0.24) | 4.5 | 4.5 | 4.4 |
| `text-subtle-on-bg-forward` | `text.subtle` | `bg.forward` (L 0.24) | 4.5 | 4.6 | 4.4 |

**Group B: bright fills inside dark mode (10).** Dark text on a light fill, which scatter penalises exactly as it penalises light mode. No text colour can repair these, because a bright fill caps the score near 5. Clearing them means darkening the fill.

| pairing | fg | bg | min | okca | scatter |
|---|---|---|---|---|---|
| `badge-primary` | `text.on-action` | `action.primary` (L 0.86) | 4.5 | 10.8 | 4.4 |
| `badge-secondary` | `text.on-action` | `action.secondary` (L 0.76) | 4.5 | 6.7 | 3.7 |
| `button-primary-medium` | `text.on-action` | `action.primary` (L 0.86) | 4.5 | 10.8 | 4.4 |
| `button-primary-small` | `text.on-action` | `action.primary` (L 0.86) | 4.5 | 10.8 | 4.4 |
| `nav-badge` | `text.on-action` | `action.secondary` (L 0.76) | 4.5 | 6.7 | 3.7 |
| `nav-inverse-link` | `text.subtle-on-inverse` | `bg.inverse` (L 1) | 4.5 | 8.4 | 3.8 |
| `tabs-inverse-inactive` | `text.subtle-on-inverse` | `bg.inverse` (L 1) | 4.5 | 8.4 | 3.8 |
| `pagination-current` | `text.on-action` | `action.primary` (L 0.86) | 4.5 | 10.8 | 4.4 |
| `chip-selected` | `text.on-action` | `action.primary` (L 0.86) | 4.5 | 10.8 | 4.4 |
| `nav-badge-text` | `text.on-action` | `action.secondary` (L 0.76) | 4.5 | 6.7 | 3.7 |

Group B is a design question rather than a token adjustment. Today the dark-mode primary button is the brightest element on screen, and that brightness is its emphasis. A scatter-robust dark mode would have no bright surfaces, so emphasis would have to come from chroma, a border, weight or size instead.

### Light mode: a ceiling, not a verdict

On light fills the scatter observer costs a median of 2.8 and at most 8.9. The highest light-fill score in the system is 4.5, and black itself reaches only 5.1 on `--color-bg-page`. Lowering the page's lightness does not raise that ceiling: the veil scales with the background, so black on an L 0.80 page still scores only 4.3.

So a light mode cannot meet Candor's floors under this observer. Floors of 6.5 and 9.5 are out of reach outright, and 4.5 requires neutral text at L 0.29 or darker. `--color-text-default` (L 0.30, scoring 4.4) is already within a hundredth of that line, so the cost is not darker body text. It is that every other text colour would have to converge on the same near-black, which collapses the default/subtle hierarchy and pulls every status colour toward near-black (error red to L 0.29 C 0.12, the link to L 0.28 C 0.08, deltaE 15 to 20 from today). 94 of 130 light measurements fall below their floor under scatter, which restates the ceiling rather than identifying anything to fix. The 13 light-mode pairings on dark fills (navy buttons and similar) are the exception, and lose almost nothing.

This was the basis for the direction then under discussion: let the default observer govern light mode, which serves the reading population it was calibrated on, and tune dark mode against the scatter observer, which serves the readers for whom dark mode works better. The decision taken was the softer form: scatter guides dark-mode tuning and the default observer remains the only gate in both modes.

## Full table

Columns per mode: **k3** is okca 2.0.3 (klar 3.x), **k4** is okca 3.0.0 default observer (klar 4.x, what `npm run audit:contrast` measures), **sc** is okca 3.0.0 scatter observer. `✗` marks a scatter figure below `min`. All three are scored against the same current token values, so k3 to k4 isolates the calibration change.

| pairing | fg | bg | tier | min | light k3 | k4 | sc | dark k3 | k4 | sc |
|---|---|---|---|---|---|---|---|---|---|---|
| `form-label` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `form-required-asterisk` | `status.error-text` | `bg.page` | 3 | 4.5 | 6.4 | 6.4 | 3.4 ✗ | 5.2 | 6 | 6 |
| `form-input-value` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `form-input-placeholder` (exempt: candor-supplementary) | `text.disabled` | `bg.page` | 3 | 4.5 | 1.8 | 1.9 | 1.6 | 2 | 1.4 | 1.4 |
| `form-input-disabled-value` (exempt: wcag-1.4.3) | `text.disabled` | `bg.surface` | 1 | 4.5 | 1.4 | 1.4 | 1.3 | 1.7 | 1.2 | 1.2 |
| `form-error-message` | `status.error-text` | `bg.page` | 1 | 4.5 | 6.4 | 6.4 | 3.4 ✗ | 5.2 | 6 | 6 |
| `form-hint-text` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `accessible-text-label-primary` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `accessible-text-label-secondary` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `accessible-text-label-error` | `status.error-text` | `bg.page` | 2 | 4.5 | 6.4 | 6.4 | 3.4 ✗ | 5.2 | 6 | 6 |
| `accessible-text-message-primary` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `accessible-text-message-secondary` | `text.subtle` | `bg.page` | 1 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `accessible-text-message-error` | `status.error-text` | `bg.page` | 1 | 4.5 | 6.4 | 6.4 | 3.4 ✗ | 5.2 | 6 | 6 |
| `accessible-text-status-primary` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `accessible-text-status-error` | `status.error-text` | `bg.page` | 1 | 4.5 | 6.4 | 6.4 | 3.4 ✗ | 5.2 | 6 | 6 |
| `accessible-text-state-text` | `text.default` | `bg.page` | 3 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `accessible-text-state-icon-success` | `status.success` | `bg.page` | non-text | 3 | 4.2 | 4.3 | 2.7 ✗ | 5.9 | 6.7 | 6.7 |
| `accessible-text-state-icon-warning` | `status.warning` | `bg.page` | non-text | 3 | 4.2 | 4.4 | 2.8 ✗ | 7.3 | 6.7 | 6.7 |
| `accessible-text-state-icon-error` | `status.error` | `bg.page` | non-text | 3 | 4.2 | 4.2 | 2.7 ✗ | 5.2 | 6 | 6 |
| `accessible-text-state-icon-info` | `text.subtle` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 7.1 | 5.6 | 5.6 |
| `accessible-text-annotation-primary` | `text.default` | `bg.page` | 3 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `accessible-text-annotation-secondary` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `stat-value-default` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 13.3 | 11.4 | 11.3 |
| `stat-value-success` | `status.success-text` | `bg.page` | 2 | 3 | 6.4 | 6.5 | 3.4 | 5.9 | 6.7 | 6.7 |
| `stat-value-warning` | `status.warning-text` | `bg.page` | 2 | 3 | 6.4 | 6.7 | 3.4 | 7.3 | 6.7 | 6.7 |
| `stat-value-error` | `status.error-text` | `bg.page` | 2 | 3 | 6.4 | 6.4 | 3.4 | 5.2 | 6 | 6 |
| `stat-value-info` | `link` | `bg.page` | 2 | 3 | 5 | 4.8 | 2.9 ✗ | 5.7 | 6.7 | 6.7 |
| `stat-unit` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `stat-label` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.9 | 4.7 | 4.6 |
| `data-grid-colheader` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.9 | 4.7 | 4.6 |
| `data-grid-rowheader` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.9 | 4.7 | 4.6 |
| `data-grid-caption` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `data-grid-cell-label` | `text.default` | `bg.page` | 2 | 6.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `badge-default` | `text.default` | `bg.muted` | 3 | 4.5 | 6.5 | 6.4 | 3.5 ✗ | 5.9 | 4.9 | 4.6 |
| `badge-primary` | `text.on-action` | `action.primary-fill` | 3 | 4.5 | 14.5 | 11.2 | 10.8 | 6.4 | 5.4 | 5 |
| `badge-secondary` | `text.on-action` | `action.secondary-fill` | 3 | 4.5 | 9.7 | 7.8 | 7.3 | 13.2 | 10.2 | 9.9 |
| `badge-success` | `status.success-text` | `status.success-bg` | 3 | 4.5 | 5.1 | 5.4 | 3.1 ✗ | 4.9 | 5.4 | 5.3 |
| `badge-error` | `status.error-text` | `status.error-bg` | 3 | 4.5 | 5.3 | 5.3 | 3.1 ✗ | 4.3 | 4.7 | 4.6 |
| `badge-warning` | `status.warning-text` | `status.warning-bg` | 3 | 4.5 | 5.3 | 5.5 | 3.1 ✗ | 6.1 | 5.3 | 5.1 |
| `button-primary-medium` | `text.on-action` | `action.primary-fill` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 6.4 | 5.4 | 5 |
| `button-primary-small` | `text.on-action` | `action.primary-fill` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 6.4 | 5.4 | 5 |
| `button-secondary` | `action.primary` | `bg.page` | 2 | 4.5 | 13.2 | 13.4 | 4.5 | 11.7 | 10.2 | 10.1 |
| `button-secondary-on-surface` | `action.primary` | `bg.surface` | 2 | 4.5 | 10.3 | 10.5 | 4.2 ✗ | 9.8 | 7.9 | 7.7 |
| `button-tertiary` | `action.tertiary-text` | `action.tertiary` | 2 | 4.5 | 9.7 | 9.8 | 4.1 ✗ | 9 | 7.1 | 6.8 |
| `button-tertiary-hover` | `action.tertiary-text` | `action.tertiary-hover` | 2 | 4.5 | 7.2 | 6.9 | 3.7 ✗ | 5.9 | 4.9 | 4.6 |
| `button-ghost` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `button-ghost-on-surface` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `button-ghost-hover` | `text.default` | `bg.hover` | 2 | 4.5 | 6.5 | 6.4 | 3.5 ✗ | 5.9 | 4.9 | 4.6 |
| `dismiss-icon-hover` | `text.default` | `bg.hover` | non-text | 3 | 6.5 | 6.4 | 3.5 | 5.9 | 4.9 | 4.6 |
| `button-ghost-subtle-icon` | `text.subtle` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.9 | 4.7 | 4.6 |
| `button-destructive` | `action.destructive-text` | `bg.page` | 2 | 4.5 | 6.4 | 6.4 | 3.4 ✗ | 5.2 | 6 | 6 |
| `button-destructive-on-surface` | `action.destructive-text` | `bg.surface` | 2 | 4.5 | 5 | 5 | 3 ✗ | 4.3 | 4.6 | 4.5 |
| `alert-title-info` | `text.default` | `bg.surface` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `alert-message-info` | `text.default` | `bg.surface` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `status-title-success` | `status.success-text` | `bg.surface` | 1 | 4.5 | 5 | 5.1 | 3 ✗ | 4.9 | 5.4 | 5.2 |
| `status-title-warning` | `status.warning-text` | `bg.surface` | 1 | 4.5 | 5 | 5.2 | 3.1 ✗ | 6.1 | 5.2 | 5.1 |
| `status-title-error` | `status.error-text` | `bg.surface` | 1 | 4.5 | 5 | 5 | 3 ✗ | 4.3 | 4.6 | 4.5 |
| `toast-message-info` | `toast.message` | `bg.surface` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 5.9 | 4.7 | 4.6 |
| `nav-brand` | `text.default` | `bg.surface` | 2 | 3 | 9.3 | 9.7 | 4.1 | 11.1 | 8.8 | 8.6 |
| `nav-link` | `text.subtle-on-surface` | `bg.surface` | 2 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.9 | 4.7 | 4.6 |
| `nav-link-active` | `action.primary` | `bg.surface` | 2 | 4.5 | 10.3 | 10.5 | 4.2 ✗ | 9.8 | 7.9 | 7.7 |
| `nav-badge` | `text.on-action` | `action.secondary-fill` | 3 | 4.5 | 9.7 | 7.8 | 7.3 | 13.2 | 10.2 | 9.9 |
| `nav-inverse-brand` | `text.inverse` | `bg.inverse` | 2 | 3 | 14.5 | 11.2 | 10.8 | 9.7 | 7.7 | 7.2 |
| `nav-inverse-link` | `text.subtle-on-inverse` | `bg.inverse` | 2 | 4.5 | 7.6 | 5.8 | 5.6 | 7.2 | 5.7 | 5.4 |
| `nav-inverse-link-active` | `text.inverse` | `bg.inverse` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 9.7 | 7.7 | 7.2 |
| `heading-h1` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 13.3 | 11.4 | 11.3 |
| `heading-h2` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 13.3 | 11.4 | 11.3 |
| `heading-h3` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 13.3 | 11.4 | 11.3 |
| `heading-h4` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 13.3 | 11.4 | 11.3 |
| `heading-h5` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `heading-h6` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `heading-secondary` | `text.subtle` | `bg.page` | 2 | 3 | 4.8 | 5 | 3 | 7.1 | 5.6 | 5.6 |
| `table-column-header` | `text.subtle-on-surface` | `bg.page` | 2 | 4.5 | 6.4 | 6.7 | 3.4 ✗ | 7.1 | 5.6 | 5.6 |
| `table-cell` | `text.default` | `bg.page` | 2 | 6.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `table-cell-label` | `text.subtle-on-surface` | `bg.page` | 3 | 4.5 | 6.4 | 6.7 | 3.4 ✗ | 7.1 | 5.6 | 5.6 |
| `table-cell-zebra` | `text.default` | `bg.surface` | 2 | 6.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `table-kv-row-header` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `table-kv-row-header-zebra` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `table-caption` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `tabs-inactive` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `tabs-active` | `action.primary` | `bg.page` | 2 | 4.5 | 13.2 | 13.4 | 4.5 | 11.7 | 10.2 | 10.1 |
| `tabs-inverse-inactive` | `text.subtle-on-inverse` | `bg.inverse` | 2 | 4.5 | 7.6 | 5.8 | 5.6 | 7.2 | 5.7 | 5.4 |
| `tabs-inverse-active` | `text.inverse` | `bg.inverse` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 9.7 | 7.7 | 7.2 |
| `tooltip-text` | `text.inverse` | `bg.inverse` | 2 | 6.5 | 14.5 | 11.2 | 10.8 | 9.7 | 7.7 | 7.2 |
| `breadcrumb-link` | `link` | `bg.page` | 2 | 4.5 | 5 | 4.8 | 2.9 ✗ | 5.7 | 6.7 | 6.7 |
| `breadcrumb-current` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `breadcrumb-separator` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `pagination-page` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `pagination-current` | `text.on-action` | `action.primary-fill` | 3 | 4.5 | 14.5 | 11.2 | 10.8 | 6.4 | 5.4 | 5 |
| `pagination-ellipsis` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `pagination-compact-status` | `text.default` | `bg.page` | 2 | 6.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `chip-default` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `chip-selected` | `text.on-action` | `action.primary-fill` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 6.4 | 5.4 | 5 |
| `modal-title` | `text.default` | `bg.elevated` | 2 | 3 | 12.4 | 13 | 4.5 | 9 | 7.1 | 6.8 |
| `modal-body` | `text.default` | `bg.elevated` | 1 | 4.5 | 12.4 | 13 | 4.5 | 9 | 7.1 | 6.8 |
| `card-footer` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.9 | 4.7 | 4.6 |
| `article-body` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `article-inline-code` | `text.code` | `bg.code` | 2 | 6.5 | 9.6 | 10 | 4.1 ✗ | 11.8 | 9.5 | 9.3 |
| `article-code-block` | `text.code` | `bg.code` | 2 | 6.5 | 9.6 | 10 | 4.1 ✗ | 11.8 | 9.5 | 9.3 |
| `article-blockquote` | `blockquote.text` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 13.3 | 11.4 | 11.3 |
| `nav-badge-text` | `text.on-action` | `action.secondary-fill` | 3 | 4.5 | 9.7 | 7.8 | 7.3 | 13.2 | 10.2 | 9.9 |
| `tone-picker-col-header` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `tone-picker-row-header` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `tone-picker-preview-code` | `text.default` | `bg.surface` | 2 | 6.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `tone-picker-preview-empty` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `tone-picker-hint` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `article-link` | `link` | `bg.page` | 2 | 4.5 | 5 | 4.8 | 2.9 ✗ | 5.7 | 6.7 | 6.7 |
| `article-link-visited` | `link-visited` | `bg.page` | 2 | 4.5 | 6.4 | 5.8 | 3.2 ✗ | 5.8 | 6.6 | 6.5 |
| `article-link-hover` | `link-hover` | `bg.page` | 2 | 4.5 | 6.4 | 6.1 | 3.3 ✗ | 11.2 | 10.2 | 10.1 |
| `alert-icon-info` | `text.subtle` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.9 | 4.7 | 4.6 |
| `status-icon-success` | `status.success` | `bg.surface` | non-text | 3 | 3.3 | 3.3 | 2.3 ✗ | 4.9 | 5.4 | 5.2 |
| `status-icon-warning` | `status.warning` | `bg.surface` | non-text | 3 | 3.3 | 3.4 | 2.4 ✗ | 6.1 | 5.2 | 5.1 |
| `status-icon-error` | `status.error` | `bg.surface` | non-text | 3 | 3.3 | 3.3 | 2.3 ✗ | 4.3 | 4.6 | 4.5 |
| `autocomplete-suggestion` | `text.default` | `bg.elevated` | 1 | 4.5 | 12.4 | 13 | 4.5 | 9 | 7.1 | 6.8 |
| `code-inline` | `text.code` | `bg.code` | 2 | 6.5 | 9.6 | 10 | 4.1 ✗ | 11.8 | 9.5 | 9.3 |
| `callout-body` | `text.default` | `callout.bg` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 11.1 | 8.8 | 8.6 |
| `form-control-border-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 7.1 | 5.6 | 5.6 |
| `form-control-border-on-surface` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.9 | 4.7 | 4.6 |
| `switch-track-thumb-off` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.9 | 4.7 | 4.6 |
| `slider-thumb-border-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 7.1 | 5.6 | 5.6 |
| `slider-track-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 7.1 | 5.6 | 5.6 |
| `slider-track-on-surface` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.9 | 4.7 | 4.6 |
| `form-control-border-on-elevated` | `border.control` | `bg.elevated` | non-text | 3 | 5 | 5.3 | 3.1 | 4.8 | 3.8 | 3.6 |
| `scrollbar-thumb-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 7.1 | 5.6 | 5.6 |
| `scrollbar-thumb-on-surface` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.9 | 4.7 | 4.6 |
| `scrollbar-thumb-on-elevated` | `border.control` | `bg.elevated` | non-text | 3 | 5 | 5.3 | 3.1 | 4.8 | 3.8 | 3.6 |
| `scrollbar-thumb-on-code` | `border.control` | `bg.code` | non-text | 3 | 3.9 | 4.1 | 2.6 ✗ | 6.2 | 5 | 4.9 |
| `text-on-bg-forward` | `text.default` | `bg.forward` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 11.1 | 9 | 8.7 |
| `text-subtle-on-bg-forward` | `text.subtle` | `bg.forward` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 5.9 | 4.7 | 4.6 |
| `text-on-bg-recede` | `text.default` | `bg.recede` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 13.3 | 11.4 | 11.3 |
| `text-subtle-on-surface-on-bg-recede` | `text.subtle-on-surface` | `bg.recede` | 3 | 4.5 | 5 | 5.2 | 3 ✗ | 7.1 | 5.6 | 5.6 |
| `focus-ring-on-page` | `focus` | `bg.page` | non-text | 3 | 4.2 | 4 | 2.6 ✗ | 5.7 | 6.7 | 6.7 |
| `focus-ring-on-surface` | `focus` | `bg.surface` | non-text | 3 | 3.3 | 3.1 | 2.2 ✗ | 4.8 | 5.3 | 5.1 |
| `focus-ring-on-elevated` | `focus` | `bg.elevated` | non-text | 3 | 4.4 | 4.2 | 2.7 ✗ | 3.9 | 4.2 | 4.1 |

## Reproducing

Nothing in this repository depends on the scatter observer, and CI does not run it. To re-measure, install the two pinned okca versions under aliases in a scratch directory outside the repo:

```bash
npm install okca-2.0.3@npm:@pawn002/okca@2.0.3 okca-3.0.0@npm:@pawn002/okca@3.0.0
```

Then, for each pairing and mode, resolve `fg` and `bg` through `audit/tokens.dtcg.json` and score the `oklch()` values directly at full precision:

```js
const { contrast: k3 } = require('okca-2.0.3');
const { contrast: k4 } = require('okca-3.0.0');
k3(fg, bg);                          // klar 3.x figure
k4(fg, bg);                          // klar 4.x figure
k4(fg, bg, { observer: 'scatter' }); // scatter observer
```

Scoring the library directly rather than through `klar contrast --type okca-scatter` matters: klar hands plugins 8-bit hex, which can move a figure by 0.1, and many of the dark-mode misses are exactly 0.1. A 30-pairing sample of the k4 column matched `klar contrast --gamut-map clip` exactly.

