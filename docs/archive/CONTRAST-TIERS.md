# Contrast Tiers — Draft

> **Status:** Draft v2 — open questions resolved; pending Storybook documentation pass
>
> **Archived — figures are historical.** Every OKCA score below was measured under
> klar 1.x and against the Angular-era component names (`app-input`, `app-badge`).
> klar 2.0.0 recalibrated OKCA, lifting scores in the 3–7 band by roughly +0.4:
> `--color-text-subtle` now measures 5.0, `--color-link` 5.1. The numbers have been
> left as originally recorded because this document is the record of a decision made
> on them — the tier **thresholds** it proposes are unchanged and remain in force
> (see `CLAUDE.md` → "OKCA Contrast Thresholds"). For current figures, run
> `npm run audit:contrast` (#211).

Candor's OKCA Contrast Guidance story specifies one threshold per size/weight cell. This document proposes a second axis: **use-case tiers** that adjust the 14px threshold based on the perceptual task the text serves.

---

## The perceptual argument

APCA's insight: the visual system processes fluent reading (prose, instructions decoded sequentially) differently from spot recognition (pattern-matching a short label against known visual context). The same letter at the same size has a different minimum contrast requirement depending on the task.

Candor has a concrete version of this problem. `--color-text-subtle` at OKCA 4.6 at 14px:
- **Too low** for hint text if you assume the user is reading it like prose (9.5 needed)
- **Sufficient** for hint text if you treat it as supplementary context the user glances at after already understanding the field

The right answer depends on the tier.

---

## Three tiers

### Tier 1 — Reading text

Text that must be read sequentially or consulted to make a decision. Failure to perceive it can cause user error.

**Apply full OKCA thresholds — no relaxation.**

| Size | Regular | Bold |
|---|---|---|
| ≥ 24px | 3.0 | 3.0 |
| 19–23px | 4.5 | 3.0 |
| 16–18px | 4.5 | 4.5 |
| **14px** | **9.5** | **6.5** |

Candor components at Tier 1:
- Toast message body
- Alert body text
- Modal prose
- Form error messages (`role="status"`)
- Article inline text

---

### Tier 2 — Functional UI text

Short labels and navigation items users scan rather than read. Meaning is in the word, not the sentence — but the text is the **sole** channel for that meaning.

**14px relaxation: 9.5 → 6.5 regular / 6.5 → 4.5 bold.**

Rationale: recognition is perceptually less demanding than sequential decoding. Bold at 14px has effectively heavier stroke mass than regular at 16px; applying the 16px bold floor (4.5) is already defensible. The 6.5 regular threshold keeps genuine margin above floor while acknowledging the non-fluent task.

| Size | Regular | Bold |
|---|---|---|
| ≥ 24px | 3.0 | 3.0 |
| 19–23px | 4.5 | 3.0 |
| 16–18px | 4.5 | 4.5 |
| **14px** | **6.5** | **4.5** |

Candor components at Tier 2:
- Breadcrumb page names
- Pagination page numbers
- Table cell data at 14px
- Accordion quiet-variant headings
- Chip labels

**Token implication:** `--color-text-subtle` at OKCA 4.6 fails Tier 2 regular. Functional 14px text using this token must be **bold** or use `--color-text-default`. This is an authoring constraint, not a token fix.

---

### Tier 3 — Supplementary / redundant text

Text where meaning is redundantly coded through at least one additional non-contrast channel: color, icon, shape, or spatial position. Contrast reinforces rather than carries.

**Condition (hard):** This tier is only valid when redundancy is verified per component. Color-alone doesn't count — the redundant channel must work under colorblindness too (shape, icon, or spatial context required).

**14px relaxation: OKCA 4.5 floor — same as 16px minimum.** The size penalty is suspended because the task is pattern recognition, not reading.

| Size | Regular | Bold |
|---|---|---|
| ≥ 24px | 3.0 | 3.0 |
| 19–23px | 4.5 | 3.0 |
| 16–18px | 4.5 | 4.5 |
| **14px** | **4.5** | **4.5** |

Candor components at Tier 3:
- **Badge text** — variant controls color + icon + label simultaneously; redundant coding validated by the system
- **Form hint text** — supplementary; user located the field via label; hint is additional context
- **Breadcrumb separators** — structural punctuation, not semantic text
- **Pagination ellipsis** — structural indicator; page numbers around it carry the meaning
- **`stat` secondary labels** — descriptor for a primary value rendered at larger size
- **Table secondary/metadata text** — supplementary to the primary cell value

---

### What Tier 3 does not permit

- A status cell built with only text (no icon, no color coding, no badge shape) is **not** Tier 3 regardless of how minor the information seems
- Icon redundancy requires a visible text label alongside it — icon-only fallback doesn't constitute redundancy for the text
- The tier assignment is per-component, documented in the component's story — not a consumer-side opt-in

---

## Summary table

| Tier | Use case | 14px regular | 14px bold |
|---|---|---|---|
| 1 — Reading | Prose, errors, decision-critical | 9.5 | 6.5 |
| 2 — Functional UI | Short labels, navigation, sole-channel data | 6.5 | 4.5 |
| 3 — Supplementary | Hints, badges with redundancy, decorative structural | 4.5 | 4.5 |

---

## Audit re-score under these tiers

| Component | Token (14px OKCA) | Tier | Pass? |
|---|---|---|---|
| `app-input` hint text | `--color-text-subtle` (4.6) | 3 | ✅ |
| `app-badge` text | status tokens (4.5–6.1) | 3 | ✅ |
| Breadcrumb separators | `--color-text-subtle` (4.6) | 3 | ✅ |
| Breadcrumb links (bold) | `--color-link` (4.6) | 2 | ✅ — bold threshold 4.5 |
| Pagination ellipsis | `--color-text-subtle` (4.6) | 3 | ✅ |
| Pagination numbers | `--color-text-default` (~11) | 2 | ✅ |
| Chip text | `--color-text-subtle` (4.6) | 3 | ✅ |
| Toast message | `--color-text-default` (~11) | 1 | ✅ |
| `stat` labels | `--color-text-subtle` (4.6) | 3 | ✅ |
| Table secondary text | `--color-text-subtle` (4.6) | 3 | ✅ |
| Accordion quiet heading (bold) | `--color-text-subtle` (4.6) | 2 | ✅ — bold threshold 4.5 |

All pairs pass under the tier system. The two Tier 2 cases that required intervention — breadcrumb links and accordion quiet headings — both resolved by applying bold weight, which brings them inside the Tier 2 bold threshold of 4.5.

---

## Relationship to existing documentation

- `OKCAContrastGuidance` story in `typography-showcase.stories.ts` — will need to be extended with the tier system once this draft stabilises
- `ACCESSIBILITY-CONFORMANCE.md` — the tier assignments will need to be referenced in the conformance statement
- Per-component stories — each component should document its tier assignment in a dedicated story or in the component-level prose
