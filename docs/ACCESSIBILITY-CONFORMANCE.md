# Accessibility Conformance Statement

**Product:** Candor Design System (`@candor-design/tokens` + `@candor-design/web-components`)
**Covers:** 6.0.0
**Last reviewed:** 2026-10-16. This is the date the statement was last checked against the code. Each source of evidence below carries its own date.
**Standard:** Web Content Accessibility Guidelines (WCAG) 2.2, Levels A and AA
**Format:** modelled on the VPAT conformance terms (Supports, Partially supports, Not applicable), with two additions explained below

---

## Summary

Candor 6.0.0 does **not** claim full WCAG 2.2 AA conformance. Of the 55 Level A and AA success criteria, 17 belong to the page that uses Candor rather than to Candor (captions, page titles, form flows), and 4 do not apply to anything Candor ships. Of the remaining 34:

| Status | Criteria |
|---|---|
| Supports | 33 |
| Partially supports | 1 |
| Not evaluated | 0 |

WCAG judges pages, not component libraries, so no design system can conform on its own. What Candor can state is which criteria its components meet, what evidence shows it, and what the page around them must add. That is what this document does, one criterion at a time.

**Why it names a version.** Most of the evidence is a check that runs on every pull request and blocks the merge when it fails, so it holds for the release it ships in. Raising this version is an assertion that those checks passed for that release and that every row below was re-read against the code. It is not a find-and-replace ([#197](https://github.com/pawn002/candor/issues/197), [#252](https://github.com/pawn002/candor/issues/252)).

---

## Evidence

Every row in the tables below cites one or more of these sources.

| Source | What it is | Runs | Covers |
|---|---|---|---|
| **axe** | axe-core 4.11 (pinned) against WCAG 2.2 A and AA rules, contrast rule off. Any violation fails the build. `tests/axe.spec.ts` | Every pull request; blocks merge | All 251 stories, light theme |
| **klar** | `npm run audit:contrast`: every foreground/background pairing in `audit/pairings.json`, both themes, against Candor's tiered OKCA floors | Every pull request; blocks merge | 132 pairings, 260 enforced measurements |
| **spec** | Playwright runtime tests: keyboard behaviour, ARIA wiring, host `aria-label` forwarding, live regions, scrollbars. `tests/accessibility.spec.ts`, `tests/host-aria-label.spec.ts`, `tests/events.spec.ts`, `tests/scrollbar.spec.ts` | Every pull request; blocks merge | Named components |
| **sweep** | Playwright on every story for what axe cannot decide: text at double size, the page at 320px wide, the text with WCAG text spacing applied, and every Tab stop compared focused and unfocused in pixels, and checked for being covered. `tests/wcag-runtime.spec.ts` | Every pull request; blocks merge | All 251 stories, light theme, up to 12 Tab stops each |
| **names** | `npm run audit:docs`: every name a component writes for its own controls comes from one vocabulary in `scripts/check-docs-claims.js`, which says what each name does | Every pull request; blocks merge | All 37 components |
| **audit** | Screen-reader and keyboard-only audit in `docs/A11Y-AUDIT.md`. The screen-reader pass inspected the accessibility tree through Playwright, as NVDA with Chrome would expose it. It was **not** a session with a live screen reader. The keyboard pass operated each component with real key presses and checked visible focus | Once, 2026; findings fixed | 28 of 37 components |
| **source** | The component source read against the criterion on 2026-10-16 | At this review | Named components |

"Blocks merge" means the check is in the required-status list on `main`. An administrator can still merge past a red check.

**What the audit does not cover.** Nine components were added or rebuilt after the audit and have had neither pass: `candor-autocomplete`, `candor-code`, `candor-combobox`, `candor-disclosure`, `candor-drawer`, `candor-listbox`, `candor-pagination`, `candor-select` and `candor-toolbar`. Every row below still applies to them through **axe**, **klar** and **spec**, where those sources are cited, but a row that rests on **audit** alone does not extend to them. Treat those rows as unverified for these nine.

**What none of the sources show** is what a person using a screen reader actually hears. Rows that depend on it (4.1.2 and 4.1.3 above all) say so.

### Status terms

- **Supports:** the evidence cited shows the criterion is met, within the scope above.
- **Partially supports:** some of the criterion is met; the row says what is not.
- **Not evaluated:** no evidence either way for 6.0.0. This is not a VPAT term for Level AA; it is used here because claiming support without evidence is the mistake this document exists to avoid.
- **Not applicable:** Candor ships nothing the criterion governs.
- **Consumer:** the criterion is about the page, its content or its media, and the consumer meets it. Where Candor helps, the row says how.

---

## Perceivable

| Criterion | Level | Status | Evidence and notes |
|---|---|---|---|
| 1.1.1 Non-text Content | A | Supports | **axe** (image, SVG, role-img, progressbar and meter names), **audit**. Decorative icons are `aria-hidden`; icon-only controls carry a name. Alt text for the consumer's own images is the consumer's. |
| 1.2.1 to 1.2.5 Time-based Media | A, AA | Consumer | Candor ships no audio or video component. |
| 1.3.1 Info and Relationships | A | Supports | **axe** (lists, table headers, required ARIA parents and children), **audit**, **spec**. Each tab is tied to its panel ([#333](https://github.com/pawn002/candor/issues/333)). Radio groups and table captions need consumer markup (see Consumer responsibilities). |
| 1.3.2 Meaningful Sequence | A | Supports | **audit**: reading order walked for each audited component. |
| 1.3.3 Sensory Characteristics | A | Consumer | Instructions are consumer content. Candor's own built-in instructions (the data grid's keyboard hint) do not rely on shape or position. |
| 1.3.4 Orientation | AA | Supports | **source**: no component restricts orientation. |
| 1.3.5 Identify Input Purpose | AA | Supports | **axe** (`autocomplete-valid`), **source**: `candor-input` passes `autocomplete` to its native input. The consumer sets the value. |
| 1.4.1 Use of Color | A | Partially supports | Status variants carry meaning in an icon shape or in words (`candor-alert`, `candor-toast`, `candor-accessible-text role_="state"`). A badge's text must name the condition, and `candor-stat` needs its slot filled to carry status: both are documented authoring rules Candor cannot enforce. Visited links fall short (see Known limitations). |
| 1.4.2 Audio Control | A | Consumer | No component plays audio. |
| 1.4.3 Contrast (Minimum) | AA | Supports | **klar**, against floors stricter than WCAG's (see Contrast). Re-measured with the WCAG 2.x algorithm on 2026-10-16: all 258 measurements meet the AA minimum. |
| 1.4.4 Resize Text | AA | Supports | **sweep**: with the root text size doubled in a 1280px window, every piece of text doubles, since Candor sizes text in `rem`, and none is newly cut off. 200% browser zoom is covered by **sweep**'s reflow check, which is 400% zoom of the same window. Writing the check found option labels and the listbox's chosen value truncated with an ellipsis, now wrapped, and several stories with fixed pixel widths, now in `rem`. The blog example's line-clamped teaser is the one recorded exception. |
| 1.4.5 Images of Text | AA | Not applicable | Candor renders no images of text. The wordmark is a logo, which the criterion exempts. |
| 1.4.10 Reflow | AA | Supports | **sweep**: no story makes the page scroll sideways at 320px. Tables, grids and code blocks scroll inside their own box, which the criterion allows for two-dimensional content. The numbered `candor-pagination` strip was 16px too wide until it learned to wrap. |
| 1.4.11 Non-text Contrast | AA | Supports | **klar**: borders, icons, the focus ring and the scrollbar thumb at 3.0 or above. The focus ring was first measured for 6.0.0 and failed on every light background, so its light colour moved to a darker blue. A state missing from `audit/pairings.json` is unmeasured. |
| 1.4.12 Text Spacing | AA | Supports | **sweep**: with the criterion's line, paragraph, letter and word spacing applied in every shadow root, no box that hides its overflow hides more text than before. One exception, recorded in the spec: the blog example clamps its teaser excerpts to a set number of lines by design, and the full text is the linked post. Text that spills out of a box without being hidden is not checked, since it is only a loss when it lands on other content. |
| 1.4.13 Content on Hover or Focus | AA | Supports | **spec**: `candor-tooltip` stays open while the pointer moves from the trigger onto the bubble, Escape closes it whether it was shown by hover or by focus, and it stays until the pointer or focus leaves. It was not hoverable until [#339](https://github.com/pawn002/candor/issues/339). |

## Operable

| Criterion | Level | Status | Evidence and notes |
|---|---|---|---|
| 2.1.1 Keyboard | A | Supports | **audit** (keyboard pass), **spec** (Tab order, radio arrow keys, checkbox Space, table cells), **axe** (`scrollable-region-focusable`: a scrolling table or code block takes focus, [#334](https://github.com/pawn002/candor/issues/334)). |
| 2.1.2 No Keyboard Trap | A | Supports | **audit**: a modal keeps focus inside by design and Escape closes it; the menu closes on Escape or Tab. Focus returns to the trigger in both. |
| 2.1.4 Character Key Shortcuts | A | Not applicable | **source**: no component defines a character-key shortcut. |
| 2.2.1 Timing Adjustable | A | Supports | **source**: no component imposes a time limit. `candor-toast` never dismisses itself, and its stories no longer teach a timer. |
| 2.2.2 Pause, Stop, Hide | A | Supports | **source**: the only moving content is indeterminate `candor-progress`, a loading indicator, which the criterion treats as essential. |
| 2.3.1 Three Flashes or Below Threshold | A | Supports | **source**: nothing flashes. |
| 2.4.1 Bypass Blocks | A | Consumer | Skip links and landmarks belong to the page. |
| 2.4.2 Page Titled | A | Consumer | |
| 2.4.3 Focus Order | A | Supports | **audit**, **spec**: a radio group is one tab stop; a modal or drawer whose body scrolls focuses the body, otherwise the close button ([#265](https://github.com/pawn002/candor/issues/265)); focus returns to the trigger when an overlay closes. |
| 2.4.4 Link Purpose (In Context) | A | Supports | **axe** (`link-name`), **audit** (breadcrumb, pagination, navigation). Link text is otherwise the consumer's. |
| 2.4.5 Multiple Ways | AA | Consumer | |
| 2.4.6 Headings and Labels | AA | Supports | **audit**: Candor's built-in labels (Close, Dismiss, Scroll tabs left) describe their purpose. Headings and labels the consumer writes are the consumer's. |
| 2.4.7 Focus Visible | AA | Supports | **sweep**: every Tab stop on every story looks different focused and unfocused. **klar** measures the focus ring. **audit**: checked by hand on every audited component. Every control draws the same focus ring, text fields included. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Supports | **sweep**: at every Tab stop, some of the focused component is still showing. **spec**: Tab closes the combobox and autocomplete lists, which stayed open over the next field until this check found them. A sticky header or banner the page adds is the consumer's. |
| 2.5.1 Pointer Gestures | A | Not applicable | **source**: no path-based or multipoint gestures. |
| 2.5.2 Pointer Cancellation | A | Supports | **spec**: actions run on release, so pressing and dragging away cancels. Combobox and autocomplete options fired on press until [#338](https://github.com/pawn002/candor/pull/338). |
| 2.5.3 Label in Name | A | Supports | **axe**: the experimental `label-content-name-mismatch` rule is switched on for buttons and links, and a second check in the same spec covers form fields: a field with a visible label and an `aria-label` must keep the label's words in its name. A host `aria-label` replaces the visible label on the field it is forwarded to, so a consumer who sets one must include the label's words. |
| 2.5.4 Motion Actuation | A | Not applicable | **source**: nothing responds to device motion. |
| 2.5.7 Dragging Movements | AA | Supports | **source**: `candor-slider` is a native range, so clicking the track sets the value. Nothing else requires dragging. |
| 2.5.8 Target Size (Minimum) | AA | Supports | **axe** (`target-size`). Controls are sized from the hit-target tokens. |

## Understandable

| Criterion | Level | Status | Evidence and notes |
|---|---|---|---|
| 3.1.1 Language of Page | A | Consumer | Set `lang` on `<html>`. |
| 3.1.2 Language of Parts | AA | Consumer | `candor-article` needs `lang` on itself or an ancestor for hyphenation anyway. |
| 3.2.1 On Focus | A | Supports | **source**: focus opens a combobox list, which is not a change of context. Nothing navigates or submits on focus. |
| 3.2.2 On Input | A | Supports | **spec**: `change` fires on commit, not per keystroke. No component submits a form or navigates on input. |
| 3.2.3 Consistent Navigation | AA | Consumer | |
| 3.2.4 Consistent Identification | AA | Supports | **names**: the names Candor writes for its own controls come from one list with one name per function, so Close always closes a dialog or drawer and Dismiss always removes a message. `candor-alert` said "Dismiss" and `candor-toast` "Dismiss notification" for the same action until the list was made. Names the consumer writes are the consumer's to keep consistent. |
| 3.2.6 Consistent Help | A | Consumer | |
| 3.3.1 Error Identification | A | Supports | **spec**: `aria-invalid` is set on error and the error is announced politely and atomically. The wording is the consumer's. |
| 3.3.2 Labels or Instructions | A | Supports | **axe** (label rules), **spec** (host `aria-label` forwarding). Form controls take `label` and `hint`. |
| 3.3.3 Error Suggestion | AA | Consumer | The error text is the consumer's. |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Consumer | |
| 3.3.7 Redundant Entry | A | Consumer | |
| 3.3.8 Accessible Authentication (Minimum) | AA | Supports | **source**: no component blocks paste, and `candor-input` passes `autocomplete` through, so password managers work. |

## Robust

| Criterion | Level | Status | Evidence and notes |
|---|---|---|---|
| 4.1.2 Name, Role, Value | A | Supports | **axe** (27 rules on names, roles, ARIA validity, nested controls), **spec** (host `aria-label` forwarding in both insertion orders; combobox, radio and popup wiring), **audit**. Not confirmed with a live screen reader. |
| 4.1.3 Status Messages | AA | Supports | **spec**: live regions exist before their content arrives ([#266](https://github.com/pawn002/candor/issues/266)); form errors announce politely. **audit**. Not confirmed with a live screen reader. |

Criterion 4.1.1 Parsing is obsolete in WCAG 2.2 and is not listed.

---

## Contrast

Candor's contrast floors are stricter than WCAG's, and they are enforced on every pull request.

- **Two axes.** Each pairing's floor depends on its size and on what the text does. At 14px, functional UI text needs OKCA 6.5 regular or 4.5 bold, supplementary text 4.5, and reading text is not permitted at regular weight at all: it must be 16px or larger ([#240](https://github.com/pawn002/candor/issues/240)). `CLAUDE.md`, "OKCA Contrast Thresholds", has the table.
- **Measured on the colour Candor specifies.** Every authored colour is inside the sRGB gamut, and `npm run audit:tokens` fails the build if one is not ([#225](https://github.com/pawn002/candor/issues/225)). A colour outside sRGB names no single colour, so a contrast figure for it means nothing. Because nothing is left for a browser to substitute, the specified colour is the delivered colour.
- **OKCA is the binding constraint.** On 2026-10-16 every pairing was measured with both OKCA and the WCAG 2.x algorithm. In all 258 measurements OKCA was at or below the WCAG 2.x figure, so a pairing that meets its OKCA floor also meets WCAG.
- **No known exceptions.** All 254 enforced measurements meet their floor in both themes. Two pairings are exempt: the value of a disabled input, which WCAG 1.4.3 exempts, and input placeholder text, which is never the only channel for its meaning.

---

## Consumer responsibilities

Some requirements depend on how the page assembles components. Candor cannot enforce them; the stories show the correct markup.

| Pattern | What the consumer does | Story |
|---|---|---|
| Radio group labelling | Wrap `candor-radio` groups in `<fieldset>` and `<legend>` | Components/Form/Radio: Group, Multiple Groups |
| Table names and row headers | Set `caption` on `candor-table`; use a header row or first-column headers for key/value tables | Components/Table: Default, Key Value |
| Badge context | Write badge text that names the condition ("3 failed", not "3"); give navigation badges a `badgeLabel` | Components/Badge: Label Carries The Meaning; Components/Navigation: With Badges |
| Slider value text | Supply `valueTextFn` when the value needs units or depends on other state | Components/Form/Slider: Percentage, Gradient Track |
| Disabled controls | Put the reason a control is disabled in adjacent text, not a tooltip | Components/Button: Disabled With Reason |
| Status on a stat | Put a `candor-accessible-text role_="state"` in `candor-stat`'s slot when the value carries good or bad | Components/Stat: Colour Is Not The Channel |
| Toasts | Leave each toast until the user dismisses it | Components/Toast |
| Naming a labelled field | If you set `aria-label` on a field that shows a label, include the label's words in it | Components/Form/Input |
| Page structure and language | Supply landmarks, a page title and `lang` on `<html>` | The consumer's application |

---

## Known limitations

### Visited links (1.4.1)

Browsers allow only colour properties in `:visited` rules, to stop pages reading a visitor's history, so a visited link cannot gain a new decoration. `candor-article` links pre-declare a transparent bottom border and colour it on `:visited`, which reads as a second underline: single underline unvisited, double underline visited. That cue survives red-green colour blindness, and both link colours meet contrast. It is still delivered by a colour change, so a strict reading of 1.4.1 is not met. A consumer who needs a fully colour-independent cue can record visited URLs in script and add a class, which has no such restriction.

### No live screen-reader session

The screen-reader evidence is an inspection of the accessibility tree, not a session with NVDA, JAWS, VoiceOver, TalkBack or Narrator. Announcements can differ from what the tree implies, most likely for `<details>`/`<summary>` (`candor-accordion-item`, `candor-disclosure`), the grid keyboard model (`candor-data-grid`, `candor-tone-picker`), and element references that cross a shadow boundary (`candor-tabs`). The composite widgets carry the most risk.

### Nine components outside the audit

See Evidence, above.

### OKLCH colour

Candor's colours are OKLCH only, with no hex fallback. Browsers without OKLCH support (Chrome and Edge before 111, Safari before 15.4, Firefox before 113) render the affected properties without colour.

---

## Reporting an issue

Report accessibility issues as GitHub issues with the `a11y` label, and include:

- the component and story
- the assistive technology and browser
- what was announced or happened, and what was expected

---

## Keeping this statement true

- **New composite widgets** need a screen-reader walkthrough before merge (`.github/PULL_REQUEST_TEMPLATE.md`).
- **ARIA structure changes are breaking** and ship in a major version (`docs/BREAKING-CHANGES.md`).
- **The axe gate** fails on any new A or AA violation, and on an exception in `tests/axe-exceptions.json` that no longer matches anything.
- **The sweep** fails on any story whose text does not double or is cut off at double size, that scrolls sideways at 320px, clips text under wider spacing, or has a Tab stop that does not change when focused or is covered. Its one exception fails too once it stops matching.
- **A new built-in control name** fails `audit:docs` until it is added to the vocabulary with what it does, which is where a second name for an existing function gets noticed.
- **A row moves from Not evaluated to Supports** only when it can cite evidence. A check that runs on every pull request is preferred to a one-off review, because a review is only true on the day it was done.
