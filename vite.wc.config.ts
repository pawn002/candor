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
      entry: {
        'candor-web-components': 'src/web-components/index.ts',
        'tone-data': 'src/web-components/tone-data.ts',
      },
      formats: ['es', 'umd'],
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
