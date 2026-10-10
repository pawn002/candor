import { defineConfig } from 'vite';

/**
 * `@candor-design/web-components/standalone` — every element in one file, with
 * Lit and culori bundled in, for a `<script type="module">` tag (#256).
 *
 * A browser cannot resolve a bare `import 'lit'` without an import map, so a
 * file meant for a script tag has to carry its dependencies. That is the whole
 * reason this build exists separately from the per-module one, and the reason
 * it is not the default: a bundler consumer who imports it gets a second Lit.
 *
 * Runs after vite.wc.config.ts with `emptyOutDir: false`, so it adds to that
 * output rather than replacing it. Its types are the barrel's — the `exports`
 * entry points `types` at `index.d.ts`.
 */
export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: { 'candor-web-components.standalone': 'src/web-components/index.ts' },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    outDir: 'web-components/dist',
    emptyOutDir: false,
  },
});
