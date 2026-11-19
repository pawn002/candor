# Scatter observer survey

Status: data only. Nothing here is a gate, and no token was changed to produce it.

Measured 2026-11-19 against the tokens at commit `8a909d6` (branch `chore/klar-4-reaudit`), every pairing in `audit/pairings.json` in both modes. 132 pairings, 260 enforced measurements, 4 exempt (listed in the full table, left out of every count).

## What the scatter observer models

okca 3.0.0 accepts an experimental option, `{ observer: 'scatter' }`, for an eye whose optics scatter light, as with an ageing or clouded lens. It adds a veil of 0.155 times the background's luminance over both colours. A bright background therefore costs contrast and a dark one costs almost nothing: black on white scores 5.2 under scatter and 20.9 under the default observer, while white on black scores 20.9 under both. It never scores above the default observer, so a pass under scatter is also a pass under default okca and under WCAG 2.

Three limits on reading these figures:

1. **One severity.** 0.155 is a single fixed veil, not a population of lens conditions.
2. **Outside semver.** okca marks the option experimental: it may change or be removed in any minor release. Every figure here is pinned to okca 3.0.0 exactly.
3. **Same floors, different question.** The `min` column is Candor's floor for the default observer. Comparing scatter against it asks "would this pairing still clear Candor's floor for a scattering eye", which is meaningful in dark mode and structurally unanswerable in light mode (see below).

## Findings

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

This is the basis for the direction under discussion: let the default observer govern light mode, which serves the reading population it was calibrated on, and hold dark mode to the scatter observer, which serves the readers for whom dark mode works better.

## Full table

Columns per mode: **k3** is okca 2.0.3 (klar 3.x), **k4** is okca 3.0.0 default observer (klar 4.x, what `npm run audit:contrast` measures), **sc** is okca 3.0.0 scatter observer. `✗` marks a scatter figure below `min`. All three are scored against the same current token values, so k3 to k4 isolates the calibration change.

| pairing | fg | bg | tier | min | light k3 | k4 | sc | dark k3 | k4 | sc |
|---|---|---|---|---|---|---|---|---|---|---|
| `form-label` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `form-required-asterisk` | `status.error-text` | `bg.page` | 3 | 4.5 | 6.1 | 6.1 | 3.3 ✗ | 6.9 | 7.1 | 7 |
| `form-input-value` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `form-input-placeholder` (exempt: candor-supplementary) | `text.disabled` | `bg.page` | 3 | 4.5 | 1.9 | 2 | 1.6 | 2 | 1.4 | 1.4 |
| `form-input-disabled-value` (exempt: wcag-1.4.3) | `text.disabled` | `bg.surface` | 1 | 4.5 | 1.5 | 1.5 | 1.4 | 1.7 | 1.2 | 1.2 |
| `form-error-message` | `status.error-text` | `bg.page` | 1 | 4.5 | 6.1 | 6.1 | 3.3 ✗ | 6.9 | 7.1 | 7 |
| `form-hint-text` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `accessible-text-label-primary` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `accessible-text-label-secondary` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `accessible-text-label-error` | `status.error-text` | `bg.page` | 2 | 4.5 | 6.1 | 6.1 | 3.3 ✗ | 6.9 | 7.1 | 7 |
| `accessible-text-message-primary` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `accessible-text-message-secondary` | `text.subtle` | `bg.page` | 1 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `accessible-text-message-error` | `status.error-text` | `bg.page` | 1 | 4.5 | 6.1 | 6.1 | 3.3 ✗ | 6.9 | 7.1 | 7 |
| `accessible-text-status-primary` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `accessible-text-status-error` | `status.error-text` | `bg.page` | 1 | 4.5 | 6.1 | 6.1 | 3.3 ✗ | 6.9 | 7.1 | 7 |
| `accessible-text-state-text` | `text.default` | `bg.page` | 3 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `accessible-text-state-icon-success` | `status.success` | `bg.page` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.4 | 5 | 5 |
| `accessible-text-state-icon-warning` | `status.warning` | `bg.page` | non-text | 3 | 4 | 4.2 | 2.7 ✗ | 5.9 | 6.1 | 6 |
| `accessible-text-state-icon-error` | `status.error` | `bg.page` | non-text | 3 | 4 | 4 | 2.6 ✗ | 4.1 | 4.3 | 4.3 |
| `accessible-text-state-icon-info` | `text.subtle` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 6.8 | 5.3 | 5.3 |
| `accessible-text-annotation-primary` | `text.default` | `bg.page` | 3 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `accessible-text-annotation-secondary` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `stat-value-default` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 12.9 | 11 | 10.9 |
| `stat-value-success` | `status.success-text` | `bg.page` | 2 | 3 | 5.8 | 5.9 | 3.2 | 6.3 | 8.1 | 8 |
| `stat-value-warning` | `status.warning-text` | `bg.page` | 2 | 3 | 7 | 7.3 | 3.6 | 8.7 | 8.5 | 8.4 |
| `stat-value-error` | `status.error-text` | `bg.page` | 2 | 3 | 6.1 | 6.1 | 3.3 | 6.9 | 7.1 | 7 |
| `stat-value-info` | `link` | `bg.page` | 2 | 3 | 5 | 4.8 | 2.9 ✗ | 6.3 | 7.1 | 7 |
| `stat-unit` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `stat-label` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.6 | 4.5 | 4.4 ✗ |
| `data-grid-colheader` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.6 | 4.5 | 4.4 ✗ |
| `data-grid-rowheader` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.6 | 4.5 | 4.4 ✗ |
| `data-grid-caption` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `data-grid-cell-label` | `text.default` | `bg.page` | 2 | 6.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `badge-default` | `text.default` | `bg.muted` | 3 | 4.5 | 6.5 | 6.4 | 3.5 ✗ | 5.7 | 4.7 | 4.4 ✗ |
| `badge-primary` | `text.on-action` | `action.primary` | 3 | 4.5 | 14.5 | 11.2 | 10.8 | 11.2 | 10.8 | 4.4 ✗ |
| `badge-secondary` | `text.on-action` | `action.secondary` | 3 | 4.5 | 9.7 | 7.8 | 7.3 | 7.3 | 6.7 | 3.7 ✗ |
| `badge-success` | `status.success-text` | `status.success-bg` | 3 | 4.5 | 5.1 | 5.3 | 3.1 ✗ | 5.4 | 6.5 | 6.4 |
| `badge-error` | `status.error-text` | `status.error-bg` | 3 | 4.5 | 5.4 | 5.5 | 3.1 ✗ | 6 | 5.7 | 5.6 |
| `badge-warning` | `status.warning-text` | `status.warning-bg` | 3 | 4.5 | 6.2 | 6.5 | 3.4 ✗ | 7.1 | 6.4 | 6.2 |
| `button-primary-medium` | `text.on-action` | `action.primary` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 11.2 | 10.8 | 4.4 ✗ |
| `button-primary-small` | `text.on-action` | `action.primary` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 11.2 | 10.8 | 4.4 ✗ |
| `button-secondary` | `action.primary` | `bg.page` | 2 | 4.5 | 13.2 | 13.4 | 4.5 | 11.7 | 10.2 | 10.1 |
| `button-secondary-on-surface` | `action.primary` | `bg.surface` | 2 | 4.5 | 10.3 | 10.5 | 4.2 ✗ | 9.8 | 7.9 | 7.7 |
| `button-tertiary` | `action.tertiary-text` | `action.tertiary` | 2 | 4.5 | 9.3 | 9.5 | 4 ✗ | 13 | 10.2 | 9.8 |
| `button-ghost` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `button-ghost-on-surface` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `button-ghost-hover` | `text.default` | `bg.hover` | 2 | 4.5 | 6.5 | 6.4 | 3.5 ✗ | 5.7 | 4.7 | 4.4 ✗ |
| `dismiss-icon-hover` | `text.default` | `bg.hover` | non-text | 3 | 6.5 | 6.4 | 3.5 | 5.7 | 4.7 | 4.4 |
| `button-ghost-subtle-icon` | `text.subtle` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.6 | 4.5 | 4.4 |
| `button-destructive` | `action.destructive-text` | `bg.page` | 2 | 4.5 | 6.1 | 6.1 | 3.3 ✗ | 6.9 | 7.1 | 7 |
| `button-destructive-on-surface` | `action.destructive-text` | `bg.surface` | 2 | 4.5 | 4.8 | 4.8 | 2.9 ✗ | 5.8 | 5.4 | 5.3 |
| `alert-title-info` | `text.default` | `bg.surface` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `alert-message-info` | `text.default` | `bg.surface` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `status-title-success` | `status.success-text` | `bg.surface` | 1 | 4.5 | 4.5 | 4.6 | 2.9 ✗ | 5.2 | 6.2 | 6.1 |
| `status-title-warning` | `status.warning-text` | `bg.surface` | 1 | 4.5 | 5.5 | 5.7 | 3.2 ✗ | 7.3 | 6.5 | 6.4 |
| `status-title-error` | `status.error-text` | `bg.surface` | 1 | 4.5 | 4.8 | 4.8 | 2.9 ✗ | 5.8 | 5.4 | 5.3 |
| `toast-message-info` | `toast.message` | `bg.surface` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 5.6 | 4.5 | 4.4 ✗ |
| `nav-brand` | `text.default` | `bg.surface` | 2 | 3 | 9.3 | 9.7 | 4.1 | 10.7 | 8.5 | 8.3 |
| `nav-link` | `text.subtle-on-surface` | `bg.surface` | 2 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.6 | 4.5 | 4.4 ✗ |
| `nav-link-active` | `action.primary` | `bg.surface` | 2 | 4.5 | 10.3 | 10.5 | 4.2 ✗ | 9.8 | 7.9 | 7.7 |
| `nav-badge` | `text.on-action` | `action.secondary` | 3 | 4.5 | 9.7 | 7.8 | 7.3 | 7.3 | 6.7 | 3.7 ✗ |
| `nav-inverse-brand` | `text.inverse` | `bg.inverse` | 2 | 3 | 14.5 | 11.2 | 10.8 | 15.3 | 16 | 4.8 |
| `nav-inverse-link` | `text.subtle-on-inverse` | `bg.inverse` | 2 | 4.5 | 7.6 | 5.8 | 5.6 | 8.1 | 8.4 | 3.8 ✗ |
| `nav-inverse-link-active` | `text.inverse` | `bg.inverse` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 15.3 | 16 | 4.8 |
| `heading-h1` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 12.9 | 11 | 10.9 |
| `heading-h2` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 12.9 | 11 | 10.9 |
| `heading-h3` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 12.9 | 11 | 10.9 |
| `heading-h4` | `text.default` | `bg.page` | 2 | 3 | 11.9 | 12.4 | 4.4 | 12.9 | 11 | 10.9 |
| `heading-h5` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `heading-h6` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `heading-secondary` | `text.subtle` | `bg.page` | 2 | 3 | 4.8 | 5 | 3 | 6.8 | 5.3 | 5.3 |
| `table-column-header` | `text.subtle-on-surface` | `bg.page` | 2 | 4.5 | 6.4 | 6.7 | 3.4 ✗ | 6.8 | 5.3 | 5.3 |
| `table-cell` | `text.default` | `bg.page` | 2 | 6.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `table-cell-label` | `text.subtle-on-surface` | `bg.page` | 3 | 4.5 | 6.4 | 6.7 | 3.4 ✗ | 6.8 | 5.3 | 5.3 |
| `table-cell-zebra` | `text.default` | `bg.surface` | 2 | 6.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `table-kv-row-header` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `table-kv-row-header-zebra` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `table-caption` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `tabs-inactive` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `tabs-active` | `action.primary` | `bg.page` | 2 | 4.5 | 13.2 | 13.4 | 4.5 | 11.7 | 10.2 | 10.1 |
| `tabs-inverse-inactive` | `text.subtle-on-inverse` | `bg.inverse` | 2 | 4.5 | 7.6 | 5.8 | 5.6 | 8.1 | 8.4 | 3.8 ✗ |
| `tabs-inverse-active` | `text.inverse` | `bg.inverse` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 15.3 | 16 | 4.8 |
| `breadcrumb-link` | `link` | `bg.page` | 2 | 4.5 | 5 | 4.8 | 2.9 ✗ | 6.3 | 7.1 | 7 |
| `breadcrumb-current` | `text.default` | `bg.page` | 2 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `breadcrumb-separator` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `pagination-page` | `text.subtle` | `bg.page` | 2 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `pagination-current` | `text.on-action` | `action.primary` | 3 | 4.5 | 14.5 | 11.2 | 10.8 | 11.2 | 10.8 | 4.4 ✗ |
| `pagination-ellipsis` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `pagination-compact-status` | `text.default` | `bg.page` | 2 | 6.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `chip-default` | `text.default` | `bg.surface` | 2 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `chip-selected` | `text.on-action` | `action.primary` | 2 | 4.5 | 14.5 | 11.2 | 10.8 | 11.2 | 10.8 | 4.4 ✗ |
| `modal-title` | `text.default` | `bg.elevated` | 2 | 3 | 12.4 | 13 | 4.5 | 8.7 | 6.9 | 6.6 |
| `modal-body` | `text.default` | `bg.elevated` | 1 | 4.5 | 12.4 | 13 | 4.5 | 8.7 | 6.9 | 6.6 |
| `card-footer` | `text.subtle-on-surface` | `bg.surface` | 3 | 4.5 | 5 | 5.2 | 3.1 ✗ | 5.6 | 4.5 | 4.4 ✗ |
| `article-body` | `text.default` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `article-inline-code` | `text.code` | `bg.code` | 2 | 6.5 | 9.6 | 10 | 4.1 ✗ | 11.4 | 9.2 | 9 |
| `article-code-block` | `text.code` | `bg.code` | 2 | 6.5 | 9.6 | 10 | 4.1 ✗ | 11.4 | 9.2 | 9 |
| `article-blockquote` | `blockquote.text` | `bg.page` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 12.9 | 11 | 10.9 |
| `nav-badge-text` | `text.on-action` | `action.secondary` | 3 | 4.5 | 9.7 | 7.8 | 7.3 | 7.3 | 6.7 | 3.7 ✗ |
| `tone-picker-col-header` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `tone-picker-row-header` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `tone-picker-preview-code` | `text.default` | `bg.surface` | 2 | 6.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `tone-picker-preview-empty` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `tone-picker-hint` | `text.subtle` | `bg.page` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `article-link` | `link` | `bg.page` | 2 | 4.5 | 5 | 4.8 | 2.9 ✗ | 6.3 | 7.1 | 7 |
| `article-link-visited` | `link-visited` | `bg.page` | 2 | 4.5 | 5.5 | 5 | 3 ✗ | 6.6 | 6.9 | 6.9 |
| `article-link-hover` | `link-hover` | `bg.page` | 2 | 4.5 | 6.1 | 5.8 | 3.2 ✗ | 11.2 | 10.2 | 10.1 |
| `alert-icon-info` | `text.subtle` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.6 | 4.5 | 4.4 |
| `status-icon-success` | `status.success` | `bg.surface` | non-text | 3 | 3 | 3 | 2.2 ✗ | 4.5 | 4.2 | 4.1 |
| `status-icon-warning` | `status.warning` | `bg.surface` | non-text | 3 | 3.1 | 3.3 | 2.3 ✗ | 5 | 4.7 | 4.6 |
| `status-icon-error` | `status.error` | `bg.surface` | non-text | 3 | 3.1 | 3.1 | 2.3 ✗ | 3.4 | 3.3 | 3.3 |
| `autocomplete-suggestion` | `text.default` | `bg.elevated` | 1 | 4.5 | 12.4 | 13 | 4.5 | 8.7 | 6.9 | 6.6 |
| `code-inline` | `text.code` | `bg.code` | 2 | 6.5 | 9.6 | 10 | 4.1 ✗ | 11.4 | 9.2 | 9 |
| `callout-body` | `text.default` | `callout.bg` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 10.7 | 8.5 | 8.3 |
| `form-control-border-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 6.8 | 5.3 | 5.3 |
| `form-control-border-on-surface` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.6 | 4.5 | 4.4 |
| `switch-track-thumb-off` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.6 | 4.5 | 4.4 |
| `slider-thumb-border-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 6.8 | 5.3 | 5.3 |
| `slider-track-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 6.8 | 5.3 | 5.3 |
| `slider-track-on-surface` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.6 | 4.5 | 4.4 |
| `form-control-border-on-elevated` | `border.control` | `bg.elevated` | non-text | 3 | 5 | 5.3 | 3.1 | 4.6 | 3.6 | 3.5 |
| `scrollbar-thumb-on-page` | `border.control` | `bg.page` | non-text | 3 | 4.8 | 5 | 3 | 6.8 | 5.3 | 5.3 |
| `scrollbar-thumb-on-surface` | `border.control` | `bg.surface` | non-text | 3 | 3.8 | 3.9 | 2.6 ✗ | 5.6 | 4.5 | 4.4 |
| `scrollbar-thumb-on-elevated` | `border.control` | `bg.elevated` | non-text | 3 | 5 | 5.3 | 3.1 | 4.6 | 3.6 | 3.5 |
| `scrollbar-thumb-on-code` | `border.control` | `bg.code` | non-text | 3 | 3.9 | 4.1 | 2.6 ✗ | 6 | 4.8 | 4.7 |
| `text-on-bg-forward` | `text.default` | `bg.forward` | 1 | 4.5 | 11.9 | 12.4 | 4.4 ✗ | 10.7 | 8.7 | 8.4 |
| `text-subtle-on-bg-forward` | `text.subtle` | `bg.forward` | 3 | 4.5 | 4.8 | 5 | 3 ✗ | 5.6 | 4.6 | 4.4 ✗ |
| `text-on-bg-recede` | `text.default` | `bg.recede` | 1 | 4.5 | 9.3 | 9.7 | 4.1 ✗ | 12.9 | 11 | 10.9 |
| `text-subtle-on-surface-on-bg-recede` | `text.subtle-on-surface` | `bg.recede` | 3 | 4.5 | 5 | 5.2 | 3 ✗ | 6.8 | 5.3 | 5.3 |
| `focus-ring-on-page` | `focus` | `bg.page` | non-text | 3 | 4.2 | 4 | 2.6 ✗ | 6.3 | 7.1 | 7 |
| `focus-ring-on-surface` | `focus` | `bg.surface` | non-text | 3 | 3.3 | 3.1 | 2.2 ✗ | 5.2 | 5.5 | 5.4 |
| `focus-ring-on-elevated` | `focus` | `bg.elevated` | non-text | 3 | 4.4 | 4.2 | 2.7 ✗ | 4.2 | 4.4 | 4.3 |

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

