import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';

/**
 * Every story passes axe-core against WCAG 2.2 A and AA (#252).
 *
 * axe-core is the engine under nearly every automated accessibility setup in
 * industry use (Storybook's a11y addon, Chromatic, sa11y, Accessibility Insights)
 * and the most consistent W3C ACT Rules implementation. It is built to report no
 * false positives, which is what makes a failure safe to block a merge on. It is
 * a floor, not a verdict: by Deque's own count it detects issues in about a third
 * of WCAG 2.1 AA success criteria. What it cannot judge is the human review list
 * this spec reports but does not gate on (see below).
 *
 * **What fails.** Any violation of a rule tagged WCAG 2.0, 2.1 or 2.2 at level A
 * or AA, at any impact. The baseline was nearly clean when this landed, so the
 * strict setting costs nothing and keeps "minor" from becoming a place to hide.
 *
 * **What is reported, not gated.** axe's best-practice rules (heading order and
 * similar) and its "incomplete" results, which are checks axe could run but not
 * decide. Both are written to `axe-report/axe-report.json` and summarised by
 * `scripts/axe-report.js`. That summary is the human review list.
 *
 * **Contrast is off.** klar owns contrast (`npm run audit:contrast`): OKCA with
 * Candor's tiered floors, a gamut gate and drift checks on every recorded figure.
 * axe's `color-contrast` measures WCAG 2 ratios against flat 4.5 and 3.0 floors.
 * Running both would give two verdicts in two algorithms that sometimes disagree.
 *
 * **Light theme only.** With contrast off, every remaining rule checks structure
 * and ARIA, which do not change with the theme. A survey of all 251 stories in
 * both themes found the non-contrast results identical in light and dark.
 *
 * **Exceptions are data.** `tests/axe-exceptions.json` lists known violations,
 * each with the stories it covers, a reason and the issue that will remove it.
 * An exception that no longer matches a violation also fails, so the list cannot
 * outlive the bugs it records.
 *
 * **One test, one step per story.** Playwright collects tests before it starts
 * Storybook, so the story list cannot be read at collection time. Each story is a
 * named step with soft assertions instead, so a failure still names its story and
 * rule. The discovery floor makes a broken index fail loudly rather than pass
 * having checked nothing.
 */

interface AxeException {
  rule: string;
  stories: string[];
  reason: string;
  issue: number;
}

interface AxeNode { target: unknown[] }
interface AxeResult { id: string; impact: string | null; tags: string[]; help: string; helpUrl: string; nodes: AxeNode[] }

const GATED_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const RUN_TAGS = [...GATED_TAGS, 'best-practice'];
const MIN_STORIES = 200;

const AXE_SOURCE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const EXCEPTIONS: AxeException[] = JSON.parse(readFileSync(join(process.cwd(), 'tests', 'axe-exceptions.json'), 'utf8'));

const isGated = (r: AxeResult) => r.tags.some((t) => GATED_TAGS.includes(t));
const targets = (r: AxeResult) => r.nodes.slice(0, 3).map((n) => n.target.map(String).join(' > '));

test('every story passes axe-core (WCAG 2.2 A/AA)', async ({ page, request }) => {
  test.setTimeout(30 * 60_000);

  const index = await (await request.get('/index.json')).json();
  const stories = (Object.values(index.entries) as { id: string; type: string; title: string }[])
    .filter((e) => e.type === 'story')
    .sort((a, b) => a.id.localeCompare(b.id));
  expect(stories.length, 'story discovery found too few stories; the index read is broken').toBeGreaterThanOrEqual(MIN_STORIES);

  const used = new Set<string>();
  const report: { story: string; reported: Omit<AxeResult, 'nodes'>[]; incomplete: Omit<AxeResult, 'nodes'>[] }[] = [];

  for (const story of stories) {
    await test.step(story.id, async () => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForSelector('#storybook-root > *', { timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(300);
      await page.addScriptTag({ content: AXE_SOURCE });
      const result = await page.evaluate(async (tags) => {
        // @ts-expect-error axe is injected above
        const r = await window.axe.run('#storybook-root', {
          runOnly: { type: 'tag', values: tags },
          rules: { 'color-contrast': { enabled: false } },
          resultTypes: ['violations', 'incomplete'],
        });
        const slim = (v: any) => ({ id: v.id, impact: v.impact, tags: v.tags, help: v.help, helpUrl: v.helpUrl, nodes: v.nodes.map((n: any) => ({ target: n.target })) });
        return { violations: r.violations.map(slim), incomplete: r.incomplete.map(slim) };
      }, RUN_TAGS) as { violations: AxeResult[]; incomplete: AxeResult[] };

      for (const v of result.violations.filter(isGated)) {
        const ex = EXCEPTIONS.find((e) => e.rule === v.id && e.stories.includes(story.id));
        if (ex) { used.add(`${ex.rule}|${story.id}`); continue; }
        expect.soft(v, `${story.id}: ${v.id} (${v.impact}) ${v.help}\n  ${targets(v).join('\n  ')}\n  ${v.helpUrl}`).toBeUndefined();
      }
      const strip = ({ nodes, ...rest }: AxeResult) => ({ ...rest, nodeCount: nodes.length, targets: targets({ nodes } as AxeResult) });
      report.push({
        story: story.id,
        reported: result.violations.filter((v) => !isGated(v)).map(strip),
        incomplete: result.incomplete.map(strip),
      });
    });
  }

  for (const ex of EXCEPTIONS) {
    for (const s of ex.stories) {
      expect.soft(used.has(`${ex.rule}|${s}`), `stale exception: ${ex.rule} no longer fails on ${s} (#${ex.issue}); remove it from tests/axe-exceptions.json`).toBe(true);
    }
  }

  mkdirSync('axe-report', { recursive: true });
  writeFileSync(join('axe-report', 'axe-report.json'), JSON.stringify({ stories: stories.length, exceptions: EXCEPTIONS, report }, null, 2));
});
