#!/usr/bin/env node
/**
 * Gates the claims the *published READMEs* make about the component surface
 * against what the *source* actually registers.
 *
 * The bug this exists for (#267): at 5.0.1 three different element counts were
 * in circulation across Candor's own surfaces — "37 custom elements" twice in
 * web-components/README.md prose, 40 tags in that same README's table, and 41
 * in issue #257's title. A consumer repeated the 41 in its own notes, so a
 * figure from an issue title became a downstream package's documentation.
 *
 * The diagnosis that looks obvious is wrong, and the wrong fix is worse than
 * the drift. **37 and 40 are both correct.** There are 37 component source
 * files and 40 registered custom elements, because `candor-tabs`,
 * `candor-toast` and `candor-toolbar` each register a companion element
 * alongside the parent. Anyone "correcting" 37 to 40 everywhere breaks the
 * hook-coverage measurements in CLAUDE.md and Introduction.mdx, whose
 * denominator is components and whose parts sum to exactly 37.
 *
 * So the defect is not a stale number. It is that the two nouns — "component"
 * and "custom element" — were used interchangeably, which left nobody able to
 * say which number a given sentence was asking for. That is what this script
 * pins: each claim is checked against the count its own noun names.
 *
 * The 41, for the record, is what `grep -c "@customElement('candor-"` returns
 * over src/. The extra match is `candor-foo` inside a doc comment in
 * utils/host-aria.ts — the same shape as the `12px-ok:` marker rule and the
 * `@import` example in check-package-deps.js. Prose that demonstrates a syntax
 * must not be read as an instance of it, which is why the scan below reads
 * decorators at the start of a line rather than anywhere in the file.
 *
 * Three claims are checked:
 *
 *   tags       — the tag table in web-components/README.md must list exactly
 *                the registered set, in both directions. This is the check
 *                proposed at the end of #260: shipped claim vs. build reality.
 *
 *   elements   — "N custom elements" prose must equal the registered tag count.
 *
 *   components — "N components" prose must equal the component-file count.
 *
 * Deliberately not checked: whether the table's *categories* are right. That is
 * a judgment about grouping, not a fact about the build, and a check that
 * cannot verify something should not imply that it did (#213).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'web-components', 'components');
const WC_README = path.join(ROOT, 'web-components', 'README.md');
const ROOT_README = path.join(ROOT, 'README.md');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

/**
 * Component source files: `candor-*.ts`, excluding stories.
 *
 * "Component" is defined as a source file rather than a tag because that is the
 * unit the hook-coverage figures elsewhere are measured over, and the unit a
 * reader means by "component" — `candor-toast-container` is part of the toast
 * component, not a thirty-eighth one.
 */
const componentFiles = walk(COMPONENTS_DIR).filter(
  (p) => /candor-[a-z-]+\.ts$/.test(p) && !p.endsWith('.stories.ts'),
);

/**
 * Registered tags, read from decorators at the start of a line.
 *
 * Anchoring to the line start is what excludes the `@customElement('candor-foo')`
 * inside the host-aria.ts doc comment, where it is indented behind a ` * `.
 */
const registered = new Set();
for (const f of walk(path.join(ROOT, 'src', 'web-components'))) {
  if (!f.endsWith('.ts') || f.endsWith('.stories.ts')) continue;
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/^@customElement\(\s*['"]([a-z][a-z0-9-]*)['"]\s*\)/gm)) {
    registered.add(m[1]);
  }
}

const nComponents = componentFiles.length;
const nElements = registered.size;

let failed = false;
const fail = (msg) => {
  console.log(`  ✖ ${msg}`);
  failed = true;
};

console.log(`\nBuild reality: ${nComponents} components, ${nElements} registered custom elements`);

if (nElements === 0 || nComponents === 0) {
  fail('found no components or no registered tags — the scan is broken, not the docs');
  process.exit(1);
}

// ── tags: the README table against the registered set ────────────────────────
console.log('\nweb-components/README.md — tag table');

const wcReadme = fs.readFileSync(WC_README, 'utf8');
const tableSection = wcReadme.slice(wcReadme.indexOf('## What\'s included'));
const tableEnd = tableSection.indexOf('\n## ', 3);
const table = tableEnd === -1 ? tableSection : tableSection.slice(0, tableEnd);

const tabled = new Set();
for (const m of table.matchAll(/`(candor-[a-z0-9-]+)`/g)) tabled.add(m[1]);

const missing = [...registered].filter((t) => !tabled.has(t)).sort();
const extra = [...tabled].filter((t) => !registered.has(t)).sort();

for (const t of missing) fail(`\`${t}\` is registered but absent from the table`);
for (const t of extra) fail(`\`${t}\` is in the table but is not registered — removed or misspelt?`);
if (missing.length === 0 && extra.length === 0) {
  console.log(`  ✓ table lists exactly the ${nElements} registered tags`);
}

// ── counts: each prose claim against the count its own noun names ────────────
//
// "N custom elements" → tags. "N components" → source files. A sentence naming
// both (the What's-included line does) is matched by each pattern in turn.
//
// The lookbehind is load-bearing: "Lit 3 custom elements" otherwise reads as a
// claim of three, which is the version number of the framework. Caught only
// because this script was run — the failure it produced looked exactly like a
// real drift report.
const claims = [
  { re: /(?<!Lit )(\d+)\s+custom elements/g, expected: nElements, noun: 'custom elements' },
  { re: /(\d+)\s+(?:Lit 3 )?components/g, expected: nComponents, noun: 'components' },
];

for (const file of [WC_README, ROOT_README]) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  console.log(`\n${rel} — count claims`);
  const text = fs.readFileSync(file, 'utf8');
  let found = 0;
  let bad = 0;

  for (const { re, expected, noun } of claims) {
    for (const m of text.matchAll(re)) {
      found++;
      const n = Number(m[1]);
      if (n !== expected) {
        bad++;
        const line = text.slice(0, m.index).split('\n').length;
        fail(`line ${line}: claims ${n} ${noun}, build has ${expected} — "${m[0]}"`);
      }
    }
  }

  if (found === 0) console.log('  · no count claims');
  else if (bad === 0) console.log(`  ✓ ${found} count claim(s) match the build`);
}

// ── TSDoc: uniform class-level coverage, and events checked against source ───
//
// Coverage is uniform across all 40 registered elements *because* that is what
// makes it gateable (#267). Selective coverage cannot be checked — an assertion
// like "every element declares its events" only has meaning if every element is
// supposed to — and it also manufactures a false signal, since a missing comment
// starts to read as "nothing surprising here" once most siblings have one. That
// is the #213 lesson: a half-filled column is a false-negative generator.
//
// What is NOT checked, stated so it is not assumed: whether a block is *true*.
// Prose cannot be verified, and this script must not imply it verified it. Only
// the two mechanical halves are gated — that a block exists, and that its
// `@fires` tags agree with the `new CustomEvent` calls in the same file.
//
// Member-level TSDoc is deliberately un-gated. There are 180 public members and
// requiring a comment on each produces filler on the obvious ones, which trains
// readers to skip TSDoc and destroys the signal for members that need it. Member
// comments are by exception; `candor-radio`'s `name` is the model.
console.log('\nTSDoc — class blocks and @fires');

const EVENT_RE = /new CustomEvent\s*(?:<[^>]*>)?\s*\(\s*['"]([a-zA-Z-]+)['"]/g;
const NO_EVENTS = 'Emits no custom events';

let blocks = 0;
for (const f of walk(path.join(ROOT, 'src', 'web-components'))) {
  if (!f.endsWith('.ts') || f.endsWith('.stories.ts')) continue;
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');

  // A class-level block is a `*/` on the line immediately above the decorator.
  // `\r?` is load-bearing on Windows checkouts: without it every element reports
  // as undocumented, which looks exactly like a real failure of the whole gate.
  for (const m of src.matchAll(/(\*\/\r?\n)?^@customElement\(\s*['"]([a-z][a-z0-9-]*)['"]/gm)) {
    if (m[1]) blocks++;
    else fail(`${rel}: <${m[2]}> has no class-level TSDoc block`);
  }

  const dispatched = [...new Set([...src.matchAll(EVENT_RE)].map((m) => m[1]))];
  const fires = [...new Set([...src.matchAll(/@fires\s+([a-zA-Z-]+)/g)].map((m) => m[1]))];

  for (const e of dispatched) {
    if (!fires.includes(e)) fail(`${rel}: dispatches "${e}" but no @fires tag declares it`);
  }
  for (const e of fires) {
    if (!dispatched.includes(e)) fail(`${rel}: @fires declares "${e}" but nothing dispatches it`);
  }

  // Absence has to be asserted, not inferred — that is the whole point of
  // uniform coverage. Same author-assertion shape as `exempt` in pairings.json.
  if (dispatched.length === 0 && /^@customElement\(/m.test(src) && !src.includes(NO_EVENTS)) {
    fail(`${rel}: dispatches nothing but does not say so — add "${NO_EVENTS}." to the block`);
  }
}

if (blocks === nElements) console.log(`  ✓ all ${blocks} registered elements carry a class block`);

// ── the README's library-wide event list, against the source ────────────────
//
// This list is here because it makes the absence of `changed` concrete, and it
// is gated because the hand-derived version shipped wrong: it named six events
// when there were nine. The three it missed are dispatched as
// `new CustomEvent<Detail>('name')`, and the scan used to build it required `(`
// immediately after CustomEvent. Derivable, so checkable, so checked.
console.log('\nweb-components/README.md — event vocabulary');

const allEvents = new Set();
for (const f of walk(path.join(ROOT, 'src', 'web-components'))) {
  if (!f.endsWith('.ts') || f.endsWith('.stories.ts')) continue;
  for (const m of fs.readFileSync(f, 'utf8').matchAll(EVENT_RE)) allEvents.add(m[1]);
}
const expectedEvents = [...allEvents].sort();

const listed = [...wcReadme.matchAll(/full set across the library is ([^.]*)\./g)]
  .flatMap((m) => [...m[1].matchAll(/`([a-zA-Z-]+)`/g)].map((x) => x[1]))
  .sort();

if (listed.length === 0) {
  fail('the README no longer states the library-wide event set — this check has nothing to verify');
} else if (listed.join(',') !== expectedEvents.join(',')) {
  fail(`README lists [${listed.join(', ')}] but the source dispatches [${expectedEvents.join(', ')}]`);
} else {
  console.log(`  ✓ lists exactly the ${expectedEvents.length} dispatched event names`);
}

// ── the shipped custom-elements manifest ─────────────────────────────────────
//
// CI additionally runs `npm run build:cem` and `git diff --exit-code` on this
// file, which is what catches a *stale* manifest. That check cannot run here,
// because regenerating requires the analyzer and this script is meant to stay
// dependency-free — so what is checked here is the complementary half: that the
// committed manifest describes the elements this source registers.
//
// Both are needed. The git-diff catches "someone changed a component and did not
// regenerate"; this catches "the manifest was regenerated from a glob that
// silently stopped matching", which produces a smaller file that is internally
// consistent and diffs clean against its own regeneration.
console.log('\nweb-components/custom-elements.json');

const CEM_PATH = path.join(ROOT, 'web-components', 'custom-elements.json');

if (!fs.existsSync(CEM_PATH)) {
  fail('the manifest is missing — run `npm run build:cem`');
} else {
  const cem = JSON.parse(fs.readFileSync(CEM_PATH, 'utf8'));
  const described = new Set(
    (cem.modules ?? [])
      .flatMap((m) => m.declarations ?? [])
      .filter((d) => d.customElement && d.tagName)
      .map((d) => d.tagName),
  );

  const cemMissing = [...registered].filter((t) => !described.has(t)).sort();
  const cemExtra = [...described].filter((t) => !registered.has(t)).sort();

  for (const t of cemMissing) fail(`<${t}> is registered but absent from the manifest`);
  for (const t of cemExtra) fail(`<${t}> is in the manifest but is not registered`);

  // A manifest whose descriptions are empty is the failure mode the analyzer
  // cannot report: it succeeds, and produces an accurate list of names — which
  // is roughly what the .d.ts already give, and is the thing #267 said was not
  // worth shipping on its own.
  const undescribed = [...(cem.modules ?? [])]
    .flatMap((m) => m.declarations ?? [])
    .filter((d) => d.customElement && d.tagName && !d.description)
    .map((d) => d.tagName)
    .sort();
  for (const t of undescribed) fail(`<${t}> is in the manifest with no description`);

  if (cemMissing.length === 0 && cemExtra.length === 0 && undescribed.length === 0) {
    console.log(`  ✓ describes exactly the ${described.size} registered elements, all with descriptions`);
  }
}

// ── stories: every rendered tag is registered by a module the story imports ───
// Registration used to be global: `.storybook/preview.ts` imported the barrel,
// so every story rendered every tag whether it asked for it or not. That made
// each component a dependency of all 49 stories, which is why TurboSnap's
// `onlyChanged` selected the entire Storybook on every component change (#281).
//
// Moving registration into each story removes the hub, and creates a failure
// this gate exists to catch: a story that renders a tag it never imported gets
// an unregistered element, which renders as an empty inline box. That is a
// *visual* defect, so the only thing that would have caught it is Chromatic —
// the tool the change was made to keep honest. Static is the right layer.
//
// Tags are read from inside `html` templates only. A `<candor-button>` written
// in a docs-description string is prose describing markup, not markup, and a
// scan that cannot tell the difference would demand an import for a component
// the story never renders — the same trap the aria-label scan hit when it read
// its own TSDoc as evidence (#270).
//
// Stated so it is not assumed covered: markup built dynamically — `unsafeHTML`,
// `innerHTML`, a tag name assembled from a variable — is invisible here, since
// the tag does not exist as a literal until it runs. No story does that today
// (verified: zero matches across all 49), which is what makes a static scan
// sufficient rather than merely convenient. A story that starts to would need
// its import checked by hand, or the practice ruled out.
console.log('\nStories — components are imported where they are rendered');

const BARREL = 'src/web-components/index.ts';

const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// Contents of every lit `html` tagged template literal. Walks rather than
// regexes because `${...}` may itself contain a nested html`` template.
function htmlTemplates(src) {
  const out = [];
  let from = 0;
  for (;;) {
    const re = /\bhtml\s*`/g;
    re.lastIndex = from;
    const hit = re.exec(src);
    if (!hit) return out;
    let i = re.lastIndex;
    let depth = 0;
    let buf = '';
    while (i < src.length) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (depth === 0 && c === '`') { i++; break; }
      if (c === '$' && src[i + 1] === '{') { depth++; i += 2; continue; }
      if (depth > 0) {
        if (c === '{') depth++;
        else if (c === '}') depth--;
        i++;
        continue;
      }
      buf += c;
      i++;
    }
    out.push(buf);
    from = hit.index + 5;
  }
}

function renderedTags(file) {
  const src = stripComments(fs.readFileSync(file, 'utf8'));
  const tags = new Set();
  for (const tpl of htmlTemplates(src)) {
    for (const m of tpl.matchAll(/<(candor-[a-z0-9-]+)/g)) tags.add(m[1]);
  }
  for (const m of src.matchAll(/createElement\(\s*['"](candor-[a-z0-9-]+)/g)) tags.add(m[1]);
  return tags;
}

// Tags reachable from a file's own relative imports, followed transitively —
// `candor-tabs.ts` registers `candor-tab-panel` too, so importing the parent is
// enough for the companion.
function reachableTags(entry, seen = new Set()) {
  const abs = path.resolve(entry);
  if (seen.has(abs) || !fs.existsSync(abs)) return new Set();
  seen.add(abs);

  const src = stripComments(fs.readFileSync(abs, 'utf8'));
  const tags = new Set();
  for (const m of src.matchAll(/^@customElement\(\s*['"]([a-z][a-z0-9-]*)['"]\s*\)/gm)) tags.add(m[1]);

  for (const m of src.matchAll(/^import\s[^'"]*['"](\.[^'"]+)['"]/gm)) {
    const target = path.resolve(path.dirname(abs), m[1]);
    for (const cand of [`${target}.ts`, path.join(target, 'index.ts')]) {
      if (fs.existsSync(cand)) {
        for (const t of reachableTags(cand, seen)) tags.add(t);
        break;
      }
    }
  }
  return tags;
}

const importsBarrel = (file) =>
  [...stripComments(fs.readFileSync(file, 'utf8')).matchAll(/^import\s[^'"]*['"](\.[^'"]+)['"]/gm)].some((m) => {
    const target = path.resolve(path.dirname(path.resolve(file)), m[1]);
    return path.relative(ROOT, `${target}.ts`) === BARREL || path.relative(ROOT, path.join(target, 'index.ts')) === BARREL;
  });

// The barrel is what made every story depend on every component. Re-adding it
// anywhere in the Storybook graph restores that, and every check above would
// still pass — so the property has to be asserted directly, not inferred from
// the tags resolving.
const PREVIEW = path.join(ROOT, '.storybook', 'preview.ts');
if (importsBarrel(PREVIEW)) {
  fail(`.storybook/preview.ts imports ${BARREL} — that puts all ${nElements} elements in every story's dependency graph (#281)`);
}

const storyFiles = walk(path.join(ROOT, 'src')).filter((f) => f.endsWith('.stories.ts'));
let unimported = 0;

for (const story of storyFiles) {
  const rel = path.relative(ROOT, story);
  if (importsBarrel(story)) {
    fail(`${rel} imports ${BARREL} — import the components it renders instead (#281)`);
    unimported++;
    continue;
  }

  const rendered = renderedTags(story);
  if (rendered.size === 0) continue;

  const available = reachableTags(story);
  for (const tag of [...rendered].sort()) {
    if (!available.has(tag)) {
      fail(`${rel} renders <${tag}> but never imports it — it will render as an unregistered element`);
      unimported++;
    }
  }
}

if (storyFiles.length === 0) {
  fail('found no story files — the scan is broken, not the stories');
} else if (unimported === 0) {
  console.log(`  ✓ ${storyFiles.length} story files import every component they render`);
}

if (failed) {
  console.log(
    '\n✖ documentation claims do not match the build.' +
      '\n  Before changing a number, check which noun the sentence uses: a component is a' +
      '\n  source file, a custom element is a registered tag, and they legitimately differ' +
      '\n  (three components register a companion element). Changing 37 to 40 everywhere' +
      '\n  breaks the hook-coverage figures, whose denominator is components.\n',
  );
  process.exit(1);
}

console.log('\n✓  documentation claims match the build\n');
