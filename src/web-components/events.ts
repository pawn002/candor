// Candor web-component event surface — canonical event names and `detail` types.
//
// Published so TypeScript consumers get real types on `CustomEvent.detail`
// instead of grepping the minified bundle (#163). The naming convention is #164.
//
// ── Naming convention ────────────────────────────────────────────────────────
// Candor follows the DOM's own two-event rule, applied uniformly so there is
// nothing component-specific to memorise:
//
//   • `change` — the COMMITTED value. Every value control emits it: input,
//     select, radio, checkbox, switch, slider, listbox, combobox, chip. This is
//     the predictable event to reach for. For discrete controls (checkbox,
//     radio, select, switch) the single action IS the commit, so `change` is the
//     only value event they emit — exactly like their native counterparts.
//
//   • `input` — the LIVE, mid-edit value, fired continuously. Only controls with
//     a real editing phase emit it: candor-input (per keystroke), candor-slider
//     (per drag tick / arrow step), and candor-combobox (per filter-text
//     keystroke). Mirrors native `<input>` / `<input type="range">`. The inner
//     control's native `input` (which is composed) is stopped at the shadow
//     boundary, so a consumer receives exactly one `input` — ours, with `detail`
//     set to the value — not the native one as well.
//
// Semantic, non-value events keep distinct names: `send`, `dismissed`, `closed`,
// `selected`, `toggle`, `clicked`, `page-change`, `tab-change`, `color-select`,
// `cell-activate`. Every event is `bubbles: true, composed: true` so it crosses
// the shadow boundary.
//
// ── Deprecated aliases ───────────────────────────────────────────────────────
// Three controls historically used bespoke value-changed names. Each legacy
// alias is still emitted with its ORIGINAL semantics, so existing listeners keep
// working; it maps to whichever new event shares those semantics. The aliases
// are deprecated and will be removed in the next major (#164):
//   • candor-input   `input-change`    (live)     → use `input`
//   • candor-slider  `value-change`    (live)     → use `input`
//   • candor-chip    `selected-change` (discrete) → use `change`
//
// Note on `HTMLElementEventMap`: we deliberately do NOT globally augment it.
// `change`, `input`, and `toggle` already exist there as plain `Event`, and
// redefining them to `CustomEvent<…>` globally would mistype unrelated DOM code.
// Consumers use the per-component `*EventMap` interfaces below, or annotate a
// handler directly with the exported `*Detail` type:
//   (e: CustomEvent<CandorSelectChangeDetail>) => …

import type { ListboxOption } from './components/form/listbox/candor-listbox';
import type { ComboboxOption } from './components/form/combobox/candor-combobox';
import type { MenuItem } from './components/menu/candor-menu';
import type { GridCell } from './components/data-grid/candor-data-grid';
import type { ToneColorSelectDetail } from './components/tone-picker/candor-tone-picker';

// ── `detail` payload types ───────────────────────────────────────────────────

/** candor-input `change` (committed) and `input` (live) — and deprecated `input-change`: the field's text value. */
export type CandorInputChangeDetail = string;
/** candor-input `input`: the live text value on each keystroke. */
export type CandorInputInputDetail = string;
/** candor-select `change`: the selected option's value. */
export type CandorSelectChangeDetail = string;
/** candor-radio `change`: the selected radio's value. */
export type CandorRadioChangeDetail = string;
/** candor-checkbox `change`: the new checked state. */
export type CandorCheckboxChangeDetail = boolean;
/** candor-switch `change`: the new on/off state. */
export type CandorSwitchChangeDetail = boolean;
/** candor-slider `change` (committed) — and deprecated `value-change`: the numeric value. */
export type CandorSliderChangeDetail = number;
/** candor-slider `input`: the live numeric value on each drag tick / arrow step. */
export type CandorSliderInputDetail = number;
/** candor-listbox `change`: the selected option. */
export type CandorListboxChangeDetail = ListboxOption;
/** candor-combobox `change`: the selected option, or `null` when cleared. */
export type CandorComboboxChangeDetail = ComboboxOption | null;
/** candor-combobox `input`: the live filter text as the user types. */
export type CandorComboboxInputDetail = string;
/** candor-chip `change` — and deprecated `selected-change`: the new selected state. */
export type CandorChipChangeDetail = boolean;

/** candor-button `clicked`: the underlying pointer/keyboard activation event. */
export type CandorButtonClickedDetail = MouseEvent;
/** candor-menu `selected`: the chosen menu item (never a separator). */
export type CandorMenuSelectedDetail = MenuItem;
/** candor-pagination `page-change`: the new 1-based page number. */
export type CandorPaginationPageChangeDetail = number;
/** candor-tabs `tab-change`: the newly-active tab id. */
export type CandorTabsTabChangeDetail = string;
/** candor-disclosure `toggle`: the new open state. */
export type CandorDisclosureToggleDetail = boolean;
/** candor-accordion-item `toggle`: the new open state. */
export type CandorAccordionItemToggleDetail = boolean;
/** candor-chat-input `send`: the submitted message text. */
export interface CandorChatInputSendDetail {
  value: string;
}
/** candor-data-grid `cell-activate`: the activated cell and its grid coordinates. */
export interface CandorCellActivateDetail {
  row: number;
  col: number;
  cell: GridCell;
}
/** candor-tone-picker `color-select`: the chosen tone (re-exported for convenience). */
export type CandorToneColorSelectDetail = ToneColorSelectDetail;

// ── Per-component event maps ─────────────────────────────────────────────────
// Consumers can reference these for typed `addEventListener` overloads, e.g.
//   el.addEventListener('change', (e: CandorInputEventMap['change']) => …)
// Events with no payload use `CustomEvent<undefined>`.

export interface CandorInputEventMap {
  /** Committed value — fires on blur / Enter. */
  change: CustomEvent<CandorInputChangeDetail>;
  /** Live value — fires on every keystroke. */
  input: CustomEvent<CandorInputInputDetail>;
  /** @deprecated live value; use `input` — removed in the next major (#164). */
  'input-change': CustomEvent<CandorInputInputDetail>;
}
export interface CandorSelectEventMap {
  change: CustomEvent<CandorSelectChangeDetail>;
}
export interface CandorRadioEventMap {
  change: CustomEvent<CandorRadioChangeDetail>;
}
export interface CandorCheckboxEventMap {
  change: CustomEvent<CandorCheckboxChangeDetail>;
}
export interface CandorSwitchEventMap {
  change: CustomEvent<CandorSwitchChangeDetail>;
}
export interface CandorSliderEventMap {
  /** Committed value — fires once on pointer release / keyboard commit. */
  change: CustomEvent<CandorSliderChangeDetail>;
  /** Live value — fires on every drag tick / arrow step. */
  input: CustomEvent<CandorSliderInputDetail>;
  /** @deprecated live value; use `input` — removed in the next major (#164). */
  'value-change': CustomEvent<CandorSliderInputDetail>;
}
export interface CandorListboxEventMap {
  change: CustomEvent<CandorListboxChangeDetail>;
}
export interface CandorComboboxEventMap {
  /** Committed selection — fires when an option is chosen (or `null` on clear). */
  change: CustomEvent<CandorComboboxChangeDetail>;
  /** Live filter text — fires as the user types. */
  input: CustomEvent<CandorComboboxInputDetail>;
}
export interface CandorChipEventMap {
  change: CustomEvent<CandorChipChangeDetail>;
  /** @deprecated use `change` — removed in the next major (#164). */
  'selected-change': CustomEvent<CandorChipChangeDetail>;
  dismissed: CustomEvent<undefined>;
}
export interface CandorButtonEventMap {
  clicked: CustomEvent<CandorButtonClickedDetail>;
}
export interface CandorMenuEventMap {
  selected: CustomEvent<CandorMenuSelectedDetail>;
}
export interface CandorPaginationEventMap {
  'page-change': CustomEvent<CandorPaginationPageChangeDetail>;
}
export interface CandorTabsEventMap {
  'tab-change': CustomEvent<CandorTabsTabChangeDetail>;
}
export interface CandorDisclosureEventMap {
  toggle: CustomEvent<CandorDisclosureToggleDetail>;
}
export interface CandorAccordionItemEventMap {
  toggle: CustomEvent<CandorAccordionItemToggleDetail>;
}
export interface CandorChatInputEventMap {
  send: CustomEvent<CandorChatInputSendDetail>;
}
export interface CandorDataGridEventMap {
  'cell-activate': CustomEvent<CandorCellActivateDetail>;
}
export interface CandorTonePickerEventMap {
  'color-select': CustomEvent<CandorToneColorSelectDetail>;
}
export interface CandorModalEventMap {
  closed: CustomEvent<undefined>;
}
export interface CandorDrawerEventMap {
  closed: CustomEvent<undefined>;
}
export interface CandorAlertEventMap {
  dismissed: CustomEvent<undefined>;
}
export interface CandorToastEventMap {
  dismissed: CustomEvent<undefined>;
}
