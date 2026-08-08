/**
 * Custom Elements Manifest config — generates `web-components/custom-elements.json`.
 *
 * The manifest is the ecosystem's existing answer to the question #267 is about:
 * a machine-readable description of the element surface that VS Code and
 * JetBrains consume for completion and hover, and that an agent can read without
 * a browser. It exists because #269 put a class-level TSDoc block and `@fires`
 * tags on all 40 elements — generated from undocumented source it would have
 * been an accurate list of names, which is roughly what the `.d.ts` already
 * provide. Descriptions are what make it worth shipping.
 *
 * `.mjs` because the repo root is CommonJS and the analyzer's config is ESM.
 *
 * Three plugins below, each fixing something the default output gets wrong for
 * this repo. Read the reasoning before removing one.
 */

/**
 * Derive `cssParts` and `cssProperties` from the source rather than from
 * `@csspart` / `@cssprop` tags.
 *
 * Hand-written tags would be a second source of truth for something the code
 * already states — a `part="input"` in the template *is* the declaration — and
 * CLAUDE.md's governance makes part names public API under semver, so a tag that
 * drifts from the template is a false promise rather than a stale comment. #246
 * is the standing warning here: 27 of 37 components expose no hook at all, and
 * the surface grows by demand, so anything that invents entries is worse than
 * nothing.
 *
 * Attribution is per **class node**, not per file. Three modules define two
 * elements each, and `candor-toast.ts` is the live case: its
 * `--candor-toast-*` properties belong to `CandorToast`, not to
 * `CandorToastContainer` alongside it. A file-level scan would credit both.
 */
function derivedStyleHooks() {
  /** @type {Map<string, {parts: string[], props: string[]}>} */
  const byClass = new Map();

  return {
    name: 'candor-derived-style-hooks',

    analyzePhase({ ts, node }) {
      if (!ts.isClassDeclaration(node) || !node.name) return;
      // getText() is this class only, so a sibling class in the same module
      // cannot leak its hooks in here.
      const src = node.getText();
      const uniq = (re) => [...new Set([...src.matchAll(re)].map((m) => m[1]))].sort();
      byClass.set(node.name.getText(), {
        parts: uniq(/part="([a-z][a-z0-9-]*)"/g),
        props: uniq(/(--candor-[a-z0-9-]+)/g),
      });
    },

    moduleLinkPhase({ moduleDoc }) {
      for (const decl of moduleDoc.declarations ?? []) {
        const found = byClass.get(decl.name);
        if (!found) continue;
        if (found.parts.length) decl.cssParts = found.parts.map((name) => ({ name }));
        if (found.props.length) decl.cssProperties = found.props.map((name) => ({ name }));
      }
    },
  };
}

/**
 * Drop private and protected members.
 *
 * 214 of the 403 members the analyzer collects are private — `_internals`,
 * `_onKeydown`, `_groupSiblings`. The manifest is a published description of the
 * *public* surface, and this whole issue is about consumers treating what ships
 * as the surface, so shipping internals invites precisely the wrong inference.
 * The `privacy` field exists so tools *can* filter, but that puts the burden on
 * every consumer rather than settling it once here.
 */
function stripNonPublicMembers() {
  return {
    name: 'candor-strip-non-public-members',
    moduleLinkPhase({ moduleDoc }) {
      for (const decl of moduleDoc.declarations ?? []) {
        if (!decl.members) continue;
        decl.members = decl.members.filter((m) => m.privacy !== 'private' && m.privacy !== 'protected');
        if (decl.members.length === 0) delete decl.members;
      }
    },
  };
}

/**
 * Normalise CRLF to LF in every string in the manifest.
 *
 * **This is what makes the staleness gate usable at all.** TSDoc text is copied
 * verbatim out of the source, so a Windows checkout produces 899 escaped `\r`
 * sequences that a Linux CI run does not — and `git diff --exit-code` on the
 * committed manifest would then fail on every CI run for a reason that has
 * nothing to do with the change. A guard that is red for the wrong reason is one
 * people learn to ignore, which is the failure mode this repo keeps designing
 * against.
 */
function normaliseNewlines() {
  const walk = (v) =>
    typeof v === 'string'
      ? v.replace(/\r\n/g, '\n')
      : Array.isArray(v)
        ? v.map(walk)
        : v && typeof v === 'object'
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
          : v;

  return {
    name: 'candor-normalise-newlines',
    packageLinkPhase({ customElementsManifest }) {
      for (const mod of customElementsManifest.modules ?? []) {
        for (const [k, v] of Object.entries(mod)) mod[k] = walk(v);
      }
    },
  };
}

/**
 * Sort the manifest into a stable order.
 *
 * **Without this the artifact is not reproducible and the staleness gate is
 * unusable.** The analyzer resolves its globs in an order that varies between
 * runs: measured here, three consecutive runs produced byte-identical *lengths*
 * and identical element sets in three different module orders, first diverging
 * at index 3 (button vs. card). `git diff --exit-code` on the committed file
 * would then fail at random, on changes that touched nothing — the worst kind of
 * red, because it is indistinguishable from a real one and teaches people to
 * re-run CI until it passes.
 *
 * Sorting also makes review possible: a real change shows up as a few lines
 * rather than as a reshuffle of 40 modules.
 */
function deterministicOrder() {
  return {
    name: 'candor-deterministic-order',
    packageLinkPhase({ customElementsManifest }) {
      const mods = customElementsManifest.modules ?? [];
      mods.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
      for (const mod of mods) {
        // Two modules define more than one element; fix their order too.
        mod.declarations?.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        mod.exports?.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      }
    },
  };
}

export default {
  globs: ['src/web-components/components/**/candor-*.ts'],
  exclude: ['**/*.stories.ts'],
  // Package root, so the `customElements` field in web-components/package.json
  // resolves it and `files` ships it. Module `path` values stay repo-relative
  // and point at `src/` — the convention published manifests follow.
  outdir: 'web-components',
  litelement: true,
  plugins: [derivedStyleHooks(), stripNonPublicMembers(), normaliseNewlines(), deterministicOrder()],
};
