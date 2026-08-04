import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      include: ['src/web-components'],
      exclude: ['**/*.stories.ts'],
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
      // Single entry: Vite/Rollup disallow multiple entries when a UMD/IIFE
      // bundle is emitted. The secondary `tone-data` entry (ESM-only) is built
      // separately by vite.tone-data.config.ts — see the build:wc script.
      entry: {
        'candor-web-components': 'src/web-components/index.ts',
      },
      formats: ['es', 'umd'],
      name: 'CandorWebComponents',
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    outDir: 'web-components/dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['culori'],
    },
  },
});
