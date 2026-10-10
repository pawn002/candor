import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * The package build: ESM, one output file per source module (#257).
 *
 * `preserveModules` is what makes per-component entry points possible — each
 * `@candor-design/web-components/<name>` subpath resolves to that component's
 * own module, so a consumer that renders nine elements ships nine, not 40.
 * The `exports` map pointing at these files is generated from the barrel by
 * `scripts/sync-wc-exports.js` and checked by `npm run audit:packaging`.
 *
 * Lit is external and a peer dependency (#256), so a consumer that also uses
 * Lit gets one copy rather than two. culori stays a regular dependency.
 *
 * The self-contained `<script>`-tag build, which has to bundle both, is
 * vite.wc-standalone.config.ts — run after this one by `build:wc`.
 */
const external = (id: string) => /^(lit|lit-html|lit-element|@lit\/[^/]+|culori)(\/|$)/.test(id);

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      include: ['src/web-components'],
      // icons.ts is component chrome, not an icon set (#260). Its module ships
      // because components import it, but no `exports` entry reaches it, and a
      // declaration file for it reads as a catalogue a consumer can import from.
      exclude: [
        '**/*.stories.ts',
        'src/web-components/examples',
        'src/web-components/design-tokens',
        'src/web-components/story-utils.ts',
        'src/web-components/icons.ts',
      ],
      // `outDirs`, not `outDir`. vite-plugin-dts 5 delegates to unplugin-dts,
      // which renamed the option — and an unknown key is ignored rather than
      // rejected, so the plugin silently fell back to preserving the full source
      // path and emitted `dist/src/web-components/index.d.ts`. package.json
      // points `types` at `./dist/index.d.ts`, so the declarations stopped being
      // reachable at all. `entryRoot` is what puts them back at the dist root
      // (#237).
      outDirs: 'web-components/dist',
      entryRoot: 'src/web-components',
      tsconfigPath: './tsconfig.wc.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/web-components/index.ts',
        'tone-data': 'src/web-components/tone-data.ts',
      },
      formats: ['es'],
    },
    outDir: 'web-components/dist',
    emptyOutDir: true,
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src/web-components',
        entryFileNames: '[name].js',
      },
    },
  },
});
