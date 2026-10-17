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

// ---------------------------------------------------------------------------
// staticDirs assets vs. Chromatic's `externals` (#281)
//
// Files in public/ are served at the Storybook root but are NOT in any story's
// module graph, so TurboSnap cannot see a change to one. Chromatic's `externals`
// option exists for exactly this: list such paths and a change to one forces a
// full rebuild.
//
// Candor deliberately does NOT set it, because today nothing in public/ can
// affect a snapshot. Chromatic captures the story iframe, and public/ holds two
// favicons — consumed by the *manager* chrome and by src/index.html — plus an
// unreferenced wordmark. `.storybook/preview-head.html`, the one file injected
// into the iframe, pulls Google Fonts and inline CSS and references nothing
// here. So `externals` would spend a full 292-snapshot rebuild on every favicon
// edit to guard a visual change that cannot occur.
//
// That reasoning is true of the tree as it stands and stops being true the
// moment a story renders one of these assets: TurboSnap would then bypass a
// build in which the image genuinely changed, and the snapshot would be stale
// with nothing reporting it. That is the #218 shape — a guard passing because
// it measured the wrong thing — so the condition is checked rather than trusted.
//
// The scan requires a *path* context (src=, href=, url(), or a leading slash),
// not a bare filename. `editor-example.stories.ts` prints "hero-banner.png" as
// visible copy inside a mock editor; that is prose about a file, not a request
// for one, and the same distinction the `12px-ok:` marker and the native-control
// scan both turn on.
console.log('\nstaticDirs assets — public/ vs. Chromatic externals');

const PUBLIC_DIR = path.join(ROOT, 'public');
const MAIN_TS = path.join(ROOT, '.storybook', 'main.ts');

const publicAssets = fs.existsSync(PUBLIC_DIR)
  ? fs.readdirSync(PUBLIC_DIR).filter((f) => f !== '.gitkeep')
  : [];

// `externals:` at the start of a config line, not the word in a comment.
const externalsSet = /^\s*externals\s*:/m.test(stripComments(fs.readFileSync(MAIN_TS, 'utf8')));

const referencedAssets = [];
if (publicAssets.length > 0) {
  const scanned = [
    ...storyFiles,
    ...walk(path.join(ROOT, 'src')).filter((f) => f.endsWith('.mdx')),
    path.join(ROOT, '.storybook', 'preview-head.html'),
    path.join(ROOT, '.storybook', 'preview.ts'),
  ].filter((f) => fs.existsSync(f));

  for (const asset of publicAssets) {
    const name = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const inPath = new RegExp(
      `(?:src|href)\\s*=\\s*["'\`][^"'\`]*${name}|url\\(\\s*["']?[^)"']*${name}|/${name}`,
    );
    for (const file of scanned) {
      if (inPath.test(fs.readFileSync(file, 'utf8'))) {
        referencedAssets.push(`${asset} (${path.relative(ROOT, file)})`);
        break;
      }
    }
  }
}

if (referencedAssets.length > 0 && !externalsSet) {
  fail(
    `a rendered file references public/ assets that TurboSnap cannot see — set \`externals\` in .storybook/main.ts so a change to one forces a full rebuild (#281):\n      ` +
      referencedAssets.join('\n      '),
  );
} else if (publicAssets.length === 0) {
  console.log('  ✓ public/ holds no assets — externals not needed');
} else if (referencedAssets.length === 0) {
  console.log(
    `  ✓ none of the ${publicAssets.length} public/ assets is rendered in a story — externals correctly unset`,
  );
} else {
  console.log(`  ✓ ${referencedAssets.length} rendered public/ asset(s), and externals is set`);
}

// ── scrollers: every component that scrolls draws Candor's scrollbar ─────────
//
// A scroller left to the browser draws the UA scrollbar: a light track in dark
// mode, a 15px bar under 32px controls, a grab area nobody chose (#307). The
// fix is the shared style in utils/scrollbar.ts, and this check is what keeps
// a new scroller from shipping without it.
//
// The subjects are derived, not listed: any component whose styles declare
// `overflow`, `overflow-x` or `overflow-y` as `auto` or `scroll` is a scroller,
// and must call scrollbarStyles() or scrollbarRules(). A rule block that also
// sets `scrollbar-width: none` is exempt. It has hidden its scrollbar on
// purpose and provides its own affordance (candor-tabs' scroll buttons), so
// there is no bar to style. Comments are stripped first, so a sentence about
// `overflow-x: auto` cannot make a component a scroller.
console.log('\nScrollers — every scrolling component uses the shared scrollbar');

const SCROLL_DECL = /overflow(?:-[xy])?\s*:\s*[^;{}]*\b(?:auto|scroll)\b/g;
const scrollers = [];
const unstyled = [];
for (const file of componentFiles) {
  const src = stripComments(fs.readFileSync(file, 'utf8'));
  let scrolls = false;
  for (const m of src.matchAll(SCROLL_DECL)) {
    const open = src.lastIndexOf('{', m.index);
    const close = src.indexOf('}', m.index);
    const block = src.slice(open, close);
    if (/scrollbar-width\s*:\s*none/.test(block)) continue;
    scrolls = true;
  }
  if (!scrolls) continue;
  scrollers.push(file);
  if (!/\bscrollbar(?:Styles|Rules)\s*\(/.test(src)) unstyled.push(path.relative(ROOT, file));
  // The per-axis thumb rules do not reach a host's own scrollbar, so `:host`
  // passes this check while drawing a flat block. Seen on candor-table.
  else if (/\bscrollbar(?:Styles|Rules)\s*\(\s*['"`]:host/.test(src)) unstyled.push(`${path.relative(ROOT, file)} (passes ':host', which the thumb rules cannot reach — scroll an inner element)`);
}

if (unstyled.length > 0) {
  fail(
    `component(s) scroll without the shared scrollbar — add scrollbarStyles('<scroller selector>') from utils/scrollbar.ts to static styles (#307):\n      ` +
      unstyled.join('\n      '),
  );
} else {
  console.log(`  ✓ all ${scrollers.length} scrolling components use the shared scrollbar`);
}

// ── em dashes: none in what a consumer reads ──────────────────────────────────
//
// An em dash in published copy is now widely read as a sign of machine
// writing, and Candor's readers include people primed to dismiss it on that
// basis (#292). So nothing a consumer reads carries one: the READMEs, the MDX
// pages, the public guides in docs/, the unreleased CHANGELOG entries, every
// TSDoc block (it ships in dist/*.d.ts and the manifest), and everything a
// story renders or describes.
//
// Ordinary code comments are exempt: they are internal, and the project is
// open about using AI to help maintain it. So are released CHANGELOG entries,
// which are history, and the docs/ files that are working records rather than
// guides. Every other docs/*.md is covered by default, so a new guide is
// checked without anyone remembering to add it. En dashes in ranges
// (h1–h6, 02:00–04:00) are correct typography and are not matched.
console.log('\nEm dashes — none in consumer-facing copy');

const EM_DASH = '—';
const DOCS_WORKING_RECORDS = new Set(['A11Y-AUDIT.md', 'LESSONS-LEARNED.md', 'CONSCIENCE.md']);

// [start, end) of every lit `html` template body. Text inside one is rendered,
// even when it looks like a comment: a code sample in a story renders its `//`
// lines as visible text, and the first version of this check masked them.
function htmlTemplateRanges(src) {
  const ranges = [];
  const re = /\bhtml\s*`/g;
  let hit;
  while ((hit = re.exec(src))) {
    let i = re.lastIndex;
    let depth = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (depth === 0 && c === '`') break;
      if (c === '$' && src[i + 1] === '{') { depth++; i += 2; continue; }
      if (depth > 0 && c === '{') depth++;
      else if (depth > 0 && c === '}') depth--;
      i++;
    }
    ranges.push([re.lastIndex, i]);
  }
  return ranges;
}

// Blank what no reader sees, keeping every newline so reported line numbers
// hold. `/* */` and `<!-- -->` never render, inside a template or out (a CSS
// comment in a style attribute is still a comment). A `//` line is a comment
// only outside an html template; inside one it is visible text.
const maskComments = (src) => {
  const ranges = htmlTemplateRanges(src);
  const rendered = (at) => ranges.some(([a, b]) => at >= a && at < b);
  const blankAll = (m) => m.replace(/[^\n]/g, ' ');
  const blankOutside = (m, ...rest) => (rendered(rest[rest.length - 2]) ? m : blankAll(m));
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blankAll)
    .replace(/<!--[\s\S]*?-->/g, blankAll)
    .replace(/^[ \t]*\/\/.*$/gm, blankOutside);
};

const dashLines = (text, offsetLine = 0) =>
  text.split('\n').flatMap((l, i) => (l.includes(EM_DASH) ? [offsetLine + i + 1] : []));

const dashHits = [];
const scanned = { markdown: 0, tsdoc: 0, stories: 0 };
const record = (file, lines) => {
  for (const line of lines) dashHits.push(`${path.relative(ROOT, file)}:${line}`);
};

const docsDir = path.join(ROOT, 'docs');
const guides = fs
  .readdirSync(docsDir)
  .filter((f) => f.endsWith('.md') && !DOCS_WORKING_RECORDS.has(f))
  .map((f) => path.join(docsDir, f));
const mdx = walk(path.join(ROOT, 'src')).filter((f) => f.endsWith('.mdx'));
for (const file of [ROOT_README, WC_README, path.join(ROOT, 'tokens', 'README.md'), ...mdx, ...guides]) {
  record(file, dashLines(fs.readFileSync(file, 'utf8')));
  scanned.markdown++;
}

const changelogPath = path.join(ROOT, 'CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf8').replace(/\r\n/g, '\n');
const unreleasedAt = changelog.indexOf('## [Unreleased]');
if (unreleasedAt === -1) {
  fail('CHANGELOG.md has no [Unreleased] section — this check has nothing to verify');
} else {
  const nextRelease = changelog.indexOf('\n## [', unreleasedAt + 1);
  const unreleased = changelog.slice(unreleasedAt, nextRelease === -1 ? undefined : nextRelease);
  record(changelogPath, dashLines(unreleased, changelog.slice(0, unreleasedAt).split('\n').length - 1));
  scanned.markdown++;
}

const tsSources = walk(path.join(ROOT, 'src')).filter((f) => f.endsWith('.ts') && !f.endsWith('.stories.ts'));
for (const file of tsSources) {
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  for (const m of src.matchAll(/\/\*\*[\s\S]*?\*\//g)) {
    record(file, dashLines(m[0], src.slice(0, m.index).split('\n').length - 1));
  }
  scanned.tsdoc++;
}

for (const file of storyFiles) {
  record(file, dashLines(maskComments(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'))));
  scanned.stories++;
}

if (scanned.tsdoc === 0 || scanned.stories === 0 || guides.length === 0) {
  fail('the em-dash scan found no TSDoc sources, stories or guides — the scan is broken, not the copy');
} else if (dashHits.length > 0) {
  fail(
    `${dashHits.length} em dash(es) in consumer-facing copy — rewrite each as a comma, colon, parentheses or a new sentence (#292):\n      ` +
      dashHits.join('\n      '),
  );
} else {
  console.log(
    `  ✓ none in ${scanned.markdown} Markdown/MDX files, TSDoc across ${scanned.tsdoc} sources, or ${scanned.stories} stories`,
  );
}

// ── blockquotes: no Markdown blockquote in what a story renders ──────────────
//
// Storybook's docs theme draws a Markdown blockquote with a bar down its left
// edge: the side-stripe tell #292 removed from the components (#324). Restyling
// it in `.storybook/` would recapture every snapshot (CLAUDE.md), so the rule is
// at the source instead: a note in a story description is a bold lead-in
// paragraph, not a `> ` quote. A line starting `>` and then a space or nothing
// is a blockquote; one starting `></tag>` is markup and is left alone. Fenced
// code is skipped, since a sample may legitimately show a quote.

const quoteHits = [];
for (const file of [...storyFiles, ...mdx]) {
  let fenced = false;
  fs.readFileSync(file, 'utf8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .forEach((l, i) => {
      if (/^\s*(?:\\`){3}|^\s*`{3}/.test(l)) fenced = !fenced;
      else if (!fenced && /^>(?: |$)/.test(l)) quoteHits.push(`${path.relative(ROOT, file)}:${i + 1}`);
    });
}
if (quoteHits.length > 0) {
  fail(
    `${quoteHits.length} Markdown blockquote line(s) in story or MDX copy; Storybook draws them with a side bar. Use a bold lead-in paragraph instead (#324):\n      ` +
      quoteHits.join('\n      '),
  );
} else {
  console.log(`  ✓ no Markdown blockquotes in ${storyFiles.length} stories or ${mdx.length} MDX files`);
}

// ── built-in names: one name per function, across every component ──────────
//
// WCAG 3.2.4 asks that controls doing the same thing are named the same way
// everywhere. Consumers name most controls, but some names are Candor's own,
// written into a component's template. Each one must be in this vocabulary,
// which says what the name does. A new name is then a decision someone made,
// and a second name for a function already listed shows up in review rather
// than in a screen reader. `candor-alert` said "Dismiss" and `candor-toast`
// said "Dismiss notification" for the same action until this check (#252).
// Read from `aria-label` attributes in the source, comments stripped: a plain
// value, or the quoted fallbacks inside an `${...}` expression.

const BUILT_IN_NAMES = {
  Close: 'closes a dialog or drawer (modal, drawer)',
  Dismiss: 'removes the message the button sits in (alert, toast)',
  'Previous page': 'pagination',
  'Next page': 'pagination',
  'Scroll tabs left': 'scrolls an overflowing tab strip (tabs)',
  'Scroll tabs right': 'scrolls an overflowing tab strip (tabs)',
  'Send message': 'submits the chat input (chat-input)',
  Breadcrumb: 'names the breadcrumb landmark',
  Loading: 'names an unlabelled progress indicator',
  'Data grid': 'names an uncaptioned data grid',
  'Dialog content': 'names the scrolling body of a modal',
  'Drawer content': 'names the scrolling body of a drawer',
  Drawer: 'names a drawer that has no heading',
  'Out of gamut': 'marks a tone-picker cell sRGB cannot render',
};

const nameHits = [];
const unknownNames = [];
for (const file of componentFiles) {
  const raw = fs.readFileSync(file, 'utf8');
  const src = stripComments(raw);
  for (const m of src.matchAll(/aria-label="((?:\$\{[^}]*\}|[^"])*)"/g)) {
    const value = m[1];
    const names = value.includes('${') ? [...value.matchAll(/'([^']+)'/g)].map((q) => q[1]) : [value];
    for (const name of names) {
      nameHits.push(name);
      if (!(name in BUILT_IN_NAMES)) {
        // Line from the file as written: stripping comments moves every line.
        const line = raw.slice(0, raw.indexOf(m[0])).split('\n').length;
        unknownNames.push(`${path.relative(ROOT, file)}:${line}: "${name}"`);
      }
    }
  }
}
const unusedNames = Object.keys(BUILT_IN_NAMES).filter((n) => !nameHits.includes(n));
if (nameHits.length < 10) {
  fail('found fewer than 10 built-in aria-label names; the scan is broken, not the components');
} else if (unknownNames.length > 0 || unusedNames.length > 0) {
  fail(
    'built-in control names must come from BUILT_IN_NAMES in this script (WCAG 3.2.4). Reuse the name an existing control with the same function has, or add the new one with what it does:\n      ' +
      [...unknownNames, ...unusedNames.map((n) => `"${n}" is listed but no component uses it; remove it`)].join('\n      '),
  );
} else {
  console.log(`  ✓ ${nameHits.length} built-in control names, all from a vocabulary of ${Object.keys(BUILT_IN_NAMES).length}`);
}

// ── package files: every tokens stylesheet the docs name is one the package ships ──
//
// tokens/README.md documented candor-article.css, candor-syntax.css and
// candor-blog.css, with <link> tags and an 11ty setup, for two major versions
// after 4.0.0 stopped shipping them (#320). Following the README gave 404s.
// A filename in published docs is a promise that the file exists, so the set
// to check against is the tokens package's `exports` map: what a consumer can
// actually import. Prose may still name a removed stylesheet without its
// extension, which is how the README explains what went away.

const TOKENS_PKG = require(path.join(ROOT, 'package.json'));
const shipped = new Set(
  Object.keys(TOKENS_PKG.exports || {})
    .map((k) => path.posix.basename(k))
    .filter((b) => /\.(css|json)$/.test(b)),
);
const PACKAGE_DOCS = [
  ROOT_README,
  path.join(ROOT, 'tokens', 'README.md'),
  WC_README,
  path.join(ROOT, 'src', 'Introduction.mdx'),
  ...fs.readdirSync(path.join(ROOT, 'docs'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(ROOT, 'docs', f)),
];
let namedFiles = 0;
const unshipped = [];
for (const file of PACKAGE_DOCS) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\bcandor-[a-z0-9-]+(?:\.min)?\.(?:css|json)\b/g)) {
    namedFiles++;
    if (!shipped.has(m[0])) {
      const line = text.slice(0, m.index).split('\n').length;
      unshipped.push(`${path.relative(ROOT, file)}:${line} names ${m[0]}`);
    }
  }
}
if (shipped.size === 0) {
  fail('the tokens package exports no .css or .json files — the scan is broken, not the docs');
} else if (unshipped.length > 0) {
  fail(
    `docs name stylesheet(s) @candor-design/tokens does not ship (#320) — remove the reference, or export the file:\n      ` +
      [...new Set(unshipped)].join('\n      '),
  );
} else {
  console.log(`  ✓ all ${namedFiles} tokens filenames named in the docs are files the package ships`);
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
