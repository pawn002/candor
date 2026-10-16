#!/usr/bin/env node
// Summarise axe-report/axe-report.json (written by tests/axe.spec.ts) as Markdown.
//
// This is the human review list, not a gate. The spec already failed the build on
// any WCAG A/AA violation. What remains here is what axe could not decide on its
// own ("needs review") and its best-practice findings, grouped by rule so each one
// can be confirmed as a bug or recorded as reviewed. In CI it is appended to the
// job summary; locally, run `node scripts/axe-report.js` after the spec.
//
// A finding a person has reviewed and found correct is recorded in
// tests/axe-reviewed.json as {rule, stories, verdict, evidence}, and moves from
// the review list to a Reviewed section. Prefer evidence that is a test: a
// verdict nothing re-checks is only true on the day it was written. An entry
// that no longer matches anything is listed as stale, so it can be removed.
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'axe-report', 'axe-report.json');
if (!fs.existsSync(file)) {
  console.log('## axe-core report\n\nNo report: the axe spec did not run to completion.');
  process.exit(0);
}
const { stories, exceptions, report } = JSON.parse(fs.readFileSync(file, 'utf8'));
const reviewedFile = path.join(process.cwd(), 'tests', 'axe-reviewed.json');
const reviewed = fs.existsSync(reviewedFile) ? JSON.parse(fs.readFileSync(reviewedFile, 'utf8')) : [];
const reviewFor = (rule, story) => reviewed.find((r) => r.rule === rule && r.stories.includes(story));
const used = new Set();

const group = (key, keep = () => true) => {
  const byRule = new Map();
  for (const { story, [key]: items } of report) {
    for (const r of items) {
      if (!keep(r.id, story)) continue;
      const g = byRule.get(r.id) || { id: r.id, impact: r.impact, help: r.help, helpUrl: r.helpUrl, stories: [] };
      g.stories.push({ story, targets: r.targets });
      byRule.set(r.id, g);
    }
  }
  return [...byRule.values()].sort((a, b) => b.stories.length - a.stories.length);
};

const section = (title, intro, groups) => {
  let out = `### ${title}\n\n${intro}\n\n`;
  if (!groups.length) return out + 'None.\n\n';
  for (const g of groups) {
    out += `**\`${g.id}\`** (${g.impact || 'n/a'}), ${g.stories.length} ${g.stories.length === 1 ? 'story' : 'stories'}: ${g.help}. [Rule](${g.helpUrl})\n\n`;
    for (const s of g.stories.slice(0, 15)) out += `- \`${s.story}\`: ${s.targets.map((t) => `\`${t}\``).join(', ')}\n`;
    if (g.stories.length > 15) out += `- and ${g.stories.length - 15} more\n`;
    out += '\n';
  }
  return out;
};

let md = `## axe-core report\n\n${stories} stories checked against WCAG 2.2 A/AA. Any violation there fails the build; ${exceptions.length} known exception ${exceptions.length === 1 ? 'entry is' : 'entries are'} in force (${exceptions.map((e) => `#${e.issue}`).join(', ') || 'none'}).\n\n`;
const isReviewed = (rule, story) => {
  const r = reviewFor(rule, story);
  if (r) used.add(`${rule} ${story}`);
  return Boolean(r);
};
md += section('Needs human review', 'Checks axe ran but could not decide. Each wants a person to confirm it as a bug or record it as reviewed in `tests/axe-reviewed.json`.', group('incomplete', (rule, story) => !isReviewed(rule, story)));
md += '### Reviewed\n\nFindings a person checked and recorded in `tests/axe-reviewed.json`.\n\n';
md += reviewed.length ? reviewed.map((r) => {
  const live = r.stories.filter((s) => used.has(`${r.rule} ${s}`));
  const stale = r.stories.filter((s) => !used.has(`${r.rule} ${s}`));
  return `- **\`${r.rule}\`**, ${live.length} ${live.length === 1 ? 'story' : 'stories'}: ${r.verdict} Evidence: ${r.evidence}` +
    (stale.length ? ` **Stale, no longer reported:** ${stale.map((s) => `\`${s}\``).join(', ')}.` : '');
}).join('\n') + '\n\n' : 'None.\n\n';
md += section('Best practice', 'Not WCAG requirements, so not gated.', group('reported'));
process.stdout.write(md);
