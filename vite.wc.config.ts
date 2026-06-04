import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      include: ['src/web-components'],
      exclude: ['**/*.stories.ts'],
      outDir: 'web-components/dist',
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
