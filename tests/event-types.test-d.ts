/**
 * Type-level tests for the per-component `addEventListener` overloads (#236).
 *
 * Nothing here runs. `tsc --noEmit` is the assertion — this file compiles only
 * if the overloads behave, and the `@ts-expect-error` lines make that a
 * two-way check: each one fails the build if the error it expects *stops*
 * happening. So the overloads cannot quietly regress into accepting anything,
 * which is the exact failure they exist to prevent.
 *
 * Three properties are asserted per component:
 *   1. a Candor event name resolves, and `detail` has the right type;
 *   2. a native event name still resolves, with its native type;
 *   3. a name in neither map is a compile error.
 *
 * The removed names from #201 are used as the negative cases deliberately —
 * those are the breaks that shipped silently, and this is what would have
 * caught them.
 */

import type { CandorInput } from '../src/web-components/components/form/input/candor-input';
import type { CandorSlider } from '../src/web-components/components/form/slider/candor-slider';
import type { CandorChip } from '../src/web-components/components/chip/candor-chip';
import type { CandorButton } from '../src/web-components/components/button/candor-button';
import type { CandorTabs } from '../src/web-components/components/tabs/candor-tabs';
import type { CandorPagination } from '../src/web-components/components/pagination/candor-pagination';
import type { CandorModal } from '../src/web-components/components/modal/candor-modal';
import type { CandorDrawer } from '../src/web-components/components/drawer/candor-drawer';
import type { CandorAlert } from '../src/web-components/components/alert/candor-alert';
import type { CandorToast } from '../src/web-components/components/toast/candor-toast';
import type { CandorMenu } from '../src/web-components/components/menu/candor-menu';
import type { CandorCheckbox } from '../src/web-components/components/form/checkbox/candor-checkbox';
import type { MenuItem } from '../src/web-components/components/menu/candor-menu';
import '../src/web-components/events';

declare const input: CandorInput;
declare const slider: CandorSlider;
declare const chip: CandorChip;
declare const button: CandorButton;
declare const tabs: CandorTabs;
declare const pager: CandorPagination;
declare const modal: CandorModal;
declare const drawer: CandorDrawer;
declare const alert: CandorAlert;
declare const toast: CandorToast;
declare const menu: CandorMenu;
declare const checkbox: CandorCheckbox;

// ── 1. Candor events resolve, with a correctly-typed `detail` ────────────────

input.addEventListener('change', (e) => {
  const v: string = e.detail;
  void v;
});
input.addEventListener('input', (e) => {
  const v: string = e.detail;
  void v;
});
slider.addEventListener('input', (e) => {
  const v: number = e.detail;
  void v;
});
chip.addEventListener('change', (e) => {
  const v: boolean = e.detail;
  void v;
});
checkbox.addEventListener('change', (e) => {
  const v: boolean = e.detail;
  void v;
});
tabs.addEventListener('change', (e) => {
  const v: string = e.detail;
  void v;
});
pager.addEventListener('change', (e) => {
  const v: number = e.detail;
  void v;
});
menu.addEventListener('select', (e) => {
  const v: MenuItem = e.detail;
  void v;
});
modal.addEventListener('close', () => {});
drawer.addEventListener('close', () => {});
alert.addEventListener('dismiss', () => {});
toast.addEventListener('dismiss', () => {});
chip.addEventListener('dismiss', () => {});

// `detail` is genuinely narrowed, not `any` — a wrong annotation must fail.
// (The directive sits on the assignment, not the call: `@ts-expect-error` only
// suppresses the line immediately after it, and the error is inside the body.)
slider.addEventListener('input', (e) => {
  // @ts-expect-error — candor-slider's `input` detail is number, not string
  const v: string = e.detail;
  void v;
});

// ── 2. Native events still resolve, with their native types ─────────────────

button.addEventListener('click', (e) => {
  const x: number = e.clientX;
  void x;
});
input.addEventListener('focus', (e) => {
  const t: EventTarget | null = e.target;
  void t;
});
tabs.addEventListener('keydown', (e) => {
  const k: string = e.key;
  void k;
});

// ── 3. The names removed in 5.0.0 (#201) are compile errors ─────────────────
// Each of these was a working listener in 4.2.0 and is silently dead in 5.0.0.
// If any line below stops erroring, the overloads have regressed.

// @ts-expect-error — `input-change` removed in 5.0.0, use `input`
input.addEventListener('input-change', () => {});
// @ts-expect-error — `value-change` removed in 5.0.0, use `input`
slider.addEventListener('value-change', () => {});
// @ts-expect-error — `selected-change` removed in 5.0.0, use `change`
chip.addEventListener('selected-change', () => {});
// @ts-expect-error — `clicked` removed in 5.0.0, use the native `click`
button.addEventListener('clicked', () => {});
// @ts-expect-error — `closed` renamed to `close` in 5.0.0
modal.addEventListener('closed', () => {});
// @ts-expect-error — `closed` renamed to `close` in 5.0.0
drawer.addEventListener('closed', () => {});
// @ts-expect-error — `dismissed` renamed to `dismiss` in 5.0.0
alert.addEventListener('dismissed', () => {});
// @ts-expect-error — `dismissed` renamed to `dismiss` in 5.0.0
toast.addEventListener('dismissed', () => {});
// @ts-expect-error — `selected` renamed to `select` in 5.0.0
menu.addEventListener('selected', () => {});
// @ts-expect-error — `tab-change` renamed to `change` in 5.0.0
tabs.addEventListener('tab-change', () => {});
// @ts-expect-error — `page-change` renamed to `change` in 5.0.0
pager.addEventListener('page-change', () => {});

// A plain typo is caught for the same reason.
// @ts-expect-error — no such event; `change` is the committed value
input.addEventListener('changed', () => {});

// ── 4. removeEventListener is constrained identically ───────────────────────

const onTab = (e: CustomEvent<string>) => void e.detail;
tabs.addEventListener('change', onTab);
tabs.removeEventListener('change', onTab);
// @ts-expect-error — same constraint applies when removing
tabs.removeEventListener('tab-change', onTab);
