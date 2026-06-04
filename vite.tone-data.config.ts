import { defineConfig } from 'vite';

/**
 * Secondary build for the `tone-data` subpath entry
 * (`@candor-design/web-components/tone-data`).
 *
 * Built separately from the main library because Vite/Rollup disallow multiple
 * entries when the main build emits a UMD bundle. `tone-data` is pure data +
 * helpers consumed via `import` (never a `<script>` tag), so ESM-only is
 * sufficient — no UMD needed. Runs after vite.wc.config.ts with
 * `emptyOutDir: false` so it adds to, rather than clears, the main output. The
 * `tone-data.d.ts` declaration is produced by the main build's dts plugin
 * (which covers all of `src/web-components`).
 */
export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: {
        'tone-data': 'src/web-components/tone-data.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    outDir: 'web-components/dist',
    emptyOutDir: false,
    rollupOptions: {
      external: ['culori'],
    },
  },
});
