import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';

/**
 * A host `aria-label` must reach the element that carries the component's role,
 * and must not stay on the host (#270).
 *
 * ARIA on a custom-element host does not cross the shadow boundary, so
 * `<candor-input aria-label="Email">` leaves the inner `<input>` unnamed unless
 * the component mirrors the value inward — which `observeHostAriaLabel` does,
 * also stripping the attribute so the name is announced once rather than twice.
 * Six of the ten form controls did this and four did not, and the four failed
 * *silently*: no error, no warning, and a rendering pixel-identical to a correct
 * one. Chromatic cannot see an unnamed input and the contrast and gamut audits
 * do not look at naming, so nothing in the repo would have caught a regression.
 *
 * **The component list is derived, not written down.** A hand-maintained list is
 * a false negative waiting to happen: the next form control gets added, nobody
 * remembers the list, and the suite goes green having tested everything except
 * the new thing. The set is the union of two source-derived rules, and it needs
 * both halves:
 *
 *   - **renders a native `<input>`/`<textarea>`/`<select>`** — the *obligation*.
 *     This is what makes the rule apply, so a component cannot leave the set by
 *     simply not forwarding. It is the half that would have caught #270.
 *   - **calls `observeHostAriaLabel`** — the *coverage*. Anything that opts in
 *     gets verified, including components whose role sits on a `<button>` or a
 *     `<ul>` rather than a native control (`candor-listbox`, `candor-menu`,
 *     `candor-progress`, …). On its own this half is circular — it can only
 *     check components that already claim to forward — which is why it is the
 *     second half and not the whole rule.
 *
 * Comments are stripped before the native-control scan. Without that,
 * `candor-listbox` matched on the words "rather than a native `<select>`" in its
 * own TSDoc — prose describing what the component deliberately is *not*, read by
 * a regex as proof that it is. Same shape as the `12px-ok:` marker rule in
 * CLAUDE.md: documentation must not be able to satisfy the check it documents.
 *
 * Both directions of the trap are covered per component:
 *   A. attribute present before insertion — the plain-HTML path.
 *   B. attribute set after insertion — the framework path, where React and
 *      Angular attach the element and write attributes afterwards. This is what
 *      the MutationObserver in the helper exists for, and what a
 *      `connectedCallback`-only read would miss.
 */

const COMPONENTS_DIR = join(__dirname, '..', 'src', 'web-components', 'components');

/** A component under test: its tag, and the story whose canvas already has it loaded. */
interface Subject {
  tag: string;
  storyId: string;
  /** Whether a native control is present — only then is the strong assertion available. */
  hasNativeControl: boolean;
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.startsWith('candor-') && entry.name.endsWith('.ts') && !entry.name.endsWith('.stories.ts')
      ? [full]
      : [];
  });
}

const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** `Components/Form/ChatInput` → `components-form-chatinput`, matching Storybook's own id derivation. */
const kebab = (title: string) =>
  title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

function discover(): Subject[] {
  const found: Subject[] = [];

  for (const file of walk(COMPONENTS_DIR)) {
    const raw = readFileSync(file, 'utf8');
    const code = stripComments(raw);

    const hasNativeControl = /<(input|textarea|select)\b/.test(code);
    const forwards = /observeHostAriaLabel/.test(code);
    if (!hasNativeControl && !forwards) continue;

    const tag = /@customElement\(\s*['"]([a-z][a-z0-9-]*)['"]/.exec(code)?.[1];
    const title = /title:\s*['"]([^'"]+)['"]/.exec(readFileSync(file.replace(/\.ts$/, '.stories.ts'), 'utf8'))?.[1];
    if (!tag || !title) throw new Error(`${file}: could not derive tag or story title`);

    found.push({ tag, storyId: `${kebab(title)}--default`, hasNativeControl });
  }

  return found.sort((a, b) => a.tag.localeCompare(b.tag));
}

const subjects = discover();

// A discovery bug must fail loudly rather than pass by testing nothing — which
// is the exact failure mode the rest of this spec exists to prevent. The floor
// is what the union produced when this was written; growing it is fine.
test('discovery finds every component that must forward a host aria-label', () => {
  expect(subjects.length).toBeGreaterThanOrEqual(18);
  // The four from #270, named explicitly: they are the regression this guards.
  expect(subjects.map((s) => s.tag)).toEqual(
    expect.arrayContaining(['candor-input', 'candor-checkbox', 'candor-radio', 'candor-chat-input']),
  );
});

const NAME = 'Bandersnatch label';

for (const { tag, storyId, hasNativeControl } of subjects) {
  test(`<${tag}> forwards a host aria-label inward`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);

    // Build both probes in one pass. The custom element is already defined here
    // because the story imported it, so createElement returns an upgraded
    // instance and there is no whenDefined race.
    await page.evaluate(
      async ({ tag, name }) => {
        const before = document.createElement(tag);
        before.id = 'probe-before';
        before.setAttribute('aria-label', name);
        document.body.appendChild(before);

        const after = document.createElement(tag);
        after.id = 'probe-after';
        document.body.appendChild(after);
        after.setAttribute('aria-label', name);

        await Promise.all(
          [before, after].map((el) => (el as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete),
        );
      },
      { tag, name: NAME },
    );

    for (const probe of ['before', 'after']) {
      await test.step(`aria-label set ${probe} insertion`, async () => {
        const host = page.locator(`#probe-${probe}`);

        // Stripped from the host, so the name is announced once rather than
        // twice (host generic + inner element).
        await expect(host).not.toHaveAttribute('aria-label');

        // Landed on exactly one inner element. Two would be a double-naming bug
        // of a different flavour, so assert the count rather than presence.
        const inner = host.locator(`[aria-label="${NAME}"]`);
        await expect(inner).toHaveCount(1);

        // The attribute is the mechanism; the accessible *name* is the property
        // that matters. Asserting the computed name catches the case where the
        // attribute is present but inert — an `aria-labelledby` on the same
        // element outranks it, which candor-listbox's trigger is one edit away
        // from doing since it carries both.
        await expect(inner).toHaveAccessibleName(NAME);

        if (hasNativeControl) {
          // Where a native control exists it is the thing that must be named —
          // a name parked on a wrapper would satisfy the checks above and still
          // leave the focusable control anonymous.
          await expect(host.locator('input, textarea, select').first()).toHaveAccessibleName(NAME);
        }
      });
    }
  });
}
