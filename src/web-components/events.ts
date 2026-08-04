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
//     (per drag tick / arrow step), candor-combobox (per filter-text keystroke),
//     and candor-autocomplete (per free-text keystroke). Mirrors native
//     `<input>` / `<input type="range">`. The inner
//     control's native `input` (which is composed) is stopped at the shadow
//     boundary, so a consumer receives exactly one `input` — ours, with `detail`
//     set to the value — not the native one as well.
//
// A selection that commits is a value change, so `change` also covers
// candor-tabs (the newly-active tab id) and candor-pagination (the new page
// number). Neither contains a native control that fires `change`, so nothing
// collides at the host.
//
// Semantic, non-value events keep distinct names: `send`, `dismiss`, `close`,
// `select`, `toggle`, `color-select`, `cell-activate`. Every event is
// `bubbles: true, composed: true` so it crosses the shadow boundary.
//
// ── Two rules the names follow ───────────────────────────────────────────────
// 1. PRESENT TENSE, matching the DOM's own vocabulary — `close`, not `closed`;
//    `dismiss`, not `dismissed`; `select`, not `selected`. Past tense read as a
//    separate category of event when it was only ever a separate spelling.
// 2. NO CUSTOM EVENT WHERE A NATIVE ONE ALREADY ARRIVES. candor-button used to
//    emit `clicked` alongside the native `click`, which already retargets to the
//    host and reaches the consumer unaided (verified: one click delivered one of
//    each). A duplicate that must be kept in sync is worse than no event.
//
// `close` is safe to use despite the inner <dialog> having a native `close`:
// that event is neither bubbling nor composed, so it does not escape the shadow
// root (verified).
//
// Removed in 5.0.0 (#201): the bespoke value-changed names `input-change`,
// `value-change` and `selected-change` (deprecated in 4.2.0 by #164), plus the
// renames and the `clicked` removal described above.
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

/** candor-input `change` (committed): the field's text value. */
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
/** candor-slider `change` (committed): the numeric value. */
export type CandorSliderChangeDetail = number;
/** candor-slider `input`: the live numeric value on each drag tick / arrow step. */
export type CandorSliderInputDetail = number;
/** candor-listbox `change`: the selected option. */
export type CandorListboxChangeDetail = ListboxOption;
/** candor-combobox `change`: the selected option, or `null` when cleared. */
export type CandorComboboxChangeDetail = ComboboxOption | null;
/** candor-combobox `input`: the live filter text as the user types. */
export type CandorComboboxInputDetail = string;
/** candor-autocomplete `change` (committed) and `input` (live): the free-text value.
 * Always a plain string — the value is never constrained to the suggestion set. */
export type CandorAutocompleteChangeDetail = string;
/** candor-autocomplete `input`: the live free-text value on each keystroke. */
export type CandorAutocompleteInputDetail = string;
/** candor-chip `change`: the new selected state. */
export type CandorChipChangeDetail = boolean;

/** candor-menu `select`: the chosen menu item (never a separator). */
export type CandorMenuSelectDetail = MenuItem;
/** candor-pagination `change`: the new 1-based page number. */
export type CandorPaginationChangeDetail = number;
/** candor-tabs `change`: the newly-active tab id. */
export type CandorTabsChangeDetail = string;
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
export interface CandorAutocompleteEventMap {
  /** Committed free text — fires on blur, on Enter, and when a suggestion is chosen. */
  change: CustomEvent<CandorAutocompleteChangeDetail>;
  /** Live free text — fires on every keystroke. */
  input: CustomEvent<CandorAutocompleteInputDetail>;
}
export interface CandorChipEventMap {
  change: CustomEvent<CandorChipChangeDetail>;
  dismiss: CustomEvent<undefined>;
}
/**
 * Deliberately empty. candor-button emits no Candor event — the inner button's
 * native `click` retargets to the host and reaches consumers unaided, so adding
 * one would duplicate it (#201). "Emits nothing" is a real statement about the
 * API, not an omission, and declaring it is what makes a listener on the removed
 * `clicked` a compile error rather than silently dead code (#236). Without this
 * the class gets no overloads and falls back to the permissive native signature,
 * which accepts any string.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CandorButtonEventMap {}
export interface CandorMenuEventMap {
  select: CustomEvent<CandorMenuSelectDetail>;
}
export interface CandorPaginationEventMap {
  change: CustomEvent<CandorPaginationChangeDetail>;
}
export interface CandorTabsEventMap {
  change: CustomEvent<CandorTabsChangeDetail>;
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
  close: CustomEvent<undefined>;
}
export interface CandorDrawerEventMap {
  close: CustomEvent<undefined>;
}
export interface CandorAlertEventMap {
  dismiss: CustomEvent<undefined>;
}
export interface CandorToastEventMap {
  dismiss: CustomEvent<undefined>;
}

// ── Enforcement: typed `addEventListener` on each component ──────────────────
// The maps above describe the event surface; these overloads make the compiler
// hold consumers to it. Without them a listener on an event that does not exist
// is valid TypeScript — `addEventListener`'s signature is `(type: string, …)`,
// so there is nothing to check the string against — and the failure is silent at
// runtime: the handler simply never fires. That is a CSS-shaped failure mode on
// a code-shaped API, and it is what made every rename in #201 invisible to a
// consumer's build (#236).
//
// Two overloads per component, Candor's map first and the native map second, so
// `'change'` resolves to `CustomEvent<…>` while `'click'` and `'keydown'` keep
// their native types. A name in neither map matches no overload and is an error.
//
// A component that emits nothing still needs an entry — see CandorButtonEventMap
// above. Omitting one does not leave that component neutral; it leaves the class
// with no overloads at all, falling back to the permissive native signature that
// accepts any string. `candor-button` is exactly where that matters, since its
// `clicked` was removed in #201.
//
// This does NOT contradict the note above about `HTMLElementEventMap`. That
// objection is to augmenting it GLOBALLY, which would retype `change`/`input`/
// `toggle` for every element in a consumer's project. These are per-class and
// invisible to anything that is not a Candor element.
//
// Reaches the ordinary case, not just consumers who hand-annotate: every
// component augments `HTMLElementTagNameMap`, so `document.querySelector(
// 'candor-tabs')` is already typed `CandorTabs`.
//
// Limits, deliberately:
//   • Framework template bindings (`@change=`, `(change)=`) never go through
//     this signature; neither does an untyped reference such as getElementById.
//   • Omitting a permissive `(type: string, …)` fallback is what creates the
//     error at all — so dispatching your own custom event on a Candor element
//     needs a widening cast: `(el as HTMLElement).addEventListener(…)`.
//   • Same cast for a union of Candor elements: TypeScript will not call an
//     overloaded method on a union type.
//
// `tests/event-types.test-d.ts` holds these overloads to their job with
// `@ts-expect-error`, so they cannot quietly stop working.

declare module './components/form/input/candor-input' {
  interface CandorInput {
    addEventListener<K extends keyof CandorInputEventMap>(
      type: K,
      listener: (this: CandorInput, ev: CandorInputEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorInput, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorInputEventMap>(
      type: K,
      listener: (this: CandorInput, ev: CandorInputEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorInput, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/select/candor-select' {
  interface CandorSelect {
    addEventListener<K extends keyof CandorSelectEventMap>(
      type: K,
      listener: (this: CandorSelect, ev: CandorSelectEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorSelect, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorSelectEventMap>(
      type: K,
      listener: (this: CandorSelect, ev: CandorSelectEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorSelect, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/radio/candor-radio' {
  interface CandorRadio {
    addEventListener<K extends keyof CandorRadioEventMap>(
      type: K,
      listener: (this: CandorRadio, ev: CandorRadioEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorRadio, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorRadioEventMap>(
      type: K,
      listener: (this: CandorRadio, ev: CandorRadioEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorRadio, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/checkbox/candor-checkbox' {
  interface CandorCheckbox {
    addEventListener<K extends keyof CandorCheckboxEventMap>(
      type: K,
      listener: (this: CandorCheckbox, ev: CandorCheckboxEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorCheckbox, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorCheckboxEventMap>(
      type: K,
      listener: (this: CandorCheckbox, ev: CandorCheckboxEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorCheckbox, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/switch/candor-switch' {
  interface CandorSwitch {
    addEventListener<K extends keyof CandorSwitchEventMap>(
      type: K,
      listener: (this: CandorSwitch, ev: CandorSwitchEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorSwitch, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorSwitchEventMap>(
      type: K,
      listener: (this: CandorSwitch, ev: CandorSwitchEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorSwitch, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/slider/candor-slider' {
  interface CandorSlider {
    addEventListener<K extends keyof CandorSliderEventMap>(
      type: K,
      listener: (this: CandorSlider, ev: CandorSliderEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorSlider, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorSliderEventMap>(
      type: K,
      listener: (this: CandorSlider, ev: CandorSliderEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorSlider, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/listbox/candor-listbox' {
  interface CandorListbox {
    addEventListener<K extends keyof CandorListboxEventMap>(
      type: K,
      listener: (this: CandorListbox, ev: CandorListboxEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorListbox, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorListboxEventMap>(
      type: K,
      listener: (this: CandorListbox, ev: CandorListboxEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorListbox, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/combobox/candor-combobox' {
  interface CandorCombobox {
    addEventListener<K extends keyof CandorComboboxEventMap>(
      type: K,
      listener: (this: CandorCombobox, ev: CandorComboboxEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorCombobox, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorComboboxEventMap>(
      type: K,
      listener: (this: CandorCombobox, ev: CandorComboboxEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorCombobox, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/autocomplete/candor-autocomplete' {
  interface CandorAutocomplete {
    addEventListener<K extends keyof CandorAutocompleteEventMap>(
      type: K,
      listener: (this: CandorAutocomplete, ev: CandorAutocompleteEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorAutocomplete, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorAutocompleteEventMap>(
      type: K,
      listener: (this: CandorAutocomplete, ev: CandorAutocompleteEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorAutocomplete, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/chip/candor-chip' {
  interface CandorChip {
    addEventListener<K extends keyof CandorChipEventMap>(
      type: K,
      listener: (this: CandorChip, ev: CandorChipEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorChip, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorChipEventMap>(
      type: K,
      listener: (this: CandorChip, ev: CandorChipEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorChip, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/button/candor-button' {
  interface CandorButton {
    addEventListener<K extends keyof CandorButtonEventMap>(
      type: K,
      listener: (this: CandorButton, ev: CandorButtonEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorButton, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorButtonEventMap>(
      type: K,
      listener: (this: CandorButton, ev: CandorButtonEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorButton, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/menu/candor-menu' {
  interface CandorMenu {
    addEventListener<K extends keyof CandorMenuEventMap>(
      type: K,
      listener: (this: CandorMenu, ev: CandorMenuEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorMenu, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorMenuEventMap>(
      type: K,
      listener: (this: CandorMenu, ev: CandorMenuEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorMenu, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/pagination/candor-pagination' {
  interface CandorPagination {
    addEventListener<K extends keyof CandorPaginationEventMap>(
      type: K,
      listener: (this: CandorPagination, ev: CandorPaginationEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorPagination, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorPaginationEventMap>(
      type: K,
      listener: (this: CandorPagination, ev: CandorPaginationEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorPagination, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/tabs/candor-tabs' {
  interface CandorTabs {
    addEventListener<K extends keyof CandorTabsEventMap>(
      type: K,
      listener: (this: CandorTabs, ev: CandorTabsEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorTabs, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorTabsEventMap>(
      type: K,
      listener: (this: CandorTabs, ev: CandorTabsEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorTabs, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/disclosure/candor-disclosure' {
  interface CandorDisclosure {
    addEventListener<K extends keyof CandorDisclosureEventMap>(
      type: K,
      listener: (this: CandorDisclosure, ev: CandorDisclosureEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorDisclosure, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorDisclosureEventMap>(
      type: K,
      listener: (this: CandorDisclosure, ev: CandorDisclosureEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorDisclosure, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/accordion/candor-accordion-item' {
  interface CandorAccordionItem {
    addEventListener<K extends keyof CandorAccordionItemEventMap>(
      type: K,
      listener: (this: CandorAccordionItem, ev: CandorAccordionItemEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorAccordionItem, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorAccordionItemEventMap>(
      type: K,
      listener: (this: CandorAccordionItem, ev: CandorAccordionItemEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorAccordionItem, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/form/chat-input/candor-chat-input' {
  interface CandorChatInput {
    addEventListener<K extends keyof CandorChatInputEventMap>(
      type: K,
      listener: (this: CandorChatInput, ev: CandorChatInputEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorChatInput, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorChatInputEventMap>(
      type: K,
      listener: (this: CandorChatInput, ev: CandorChatInputEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorChatInput, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/data-grid/candor-data-grid' {
  interface CandorDataGrid {
    addEventListener<K extends keyof CandorDataGridEventMap>(
      type: K,
      listener: (this: CandorDataGrid, ev: CandorDataGridEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorDataGrid, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorDataGridEventMap>(
      type: K,
      listener: (this: CandorDataGrid, ev: CandorDataGridEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorDataGrid, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/tone-picker/candor-tone-picker' {
  interface CandorTonePicker {
    addEventListener<K extends keyof CandorTonePickerEventMap>(
      type: K,
      listener: (this: CandorTonePicker, ev: CandorTonePickerEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorTonePicker, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorTonePickerEventMap>(
      type: K,
      listener: (this: CandorTonePicker, ev: CandorTonePickerEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorTonePicker, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/modal/candor-modal' {
  interface CandorModal {
    addEventListener<K extends keyof CandorModalEventMap>(
      type: K,
      listener: (this: CandorModal, ev: CandorModalEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorModal, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorModalEventMap>(
      type: K,
      listener: (this: CandorModal, ev: CandorModalEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorModal, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/drawer/candor-drawer' {
  interface CandorDrawer {
    addEventListener<K extends keyof CandorDrawerEventMap>(
      type: K,
      listener: (this: CandorDrawer, ev: CandorDrawerEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorDrawer, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorDrawerEventMap>(
      type: K,
      listener: (this: CandorDrawer, ev: CandorDrawerEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorDrawer, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/alert/candor-alert' {
  interface CandorAlert {
    addEventListener<K extends keyof CandorAlertEventMap>(
      type: K,
      listener: (this: CandorAlert, ev: CandorAlertEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorAlert, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorAlertEventMap>(
      type: K,
      listener: (this: CandorAlert, ev: CandorAlertEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorAlert, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
declare module './components/toast/candor-toast' {
  interface CandorToast {
    addEventListener<K extends keyof CandorToastEventMap>(
      type: K,
      listener: (this: CandorToast, ev: CandorToastEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorToast, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CandorToastEventMap>(
      type: K,
      listener: (this: CandorToast, ev: CandorToastEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: CandorToast, ev: HTMLElementEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
