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
      entry: 'src/web-components/index.ts',
      name: 'CandorWebComponents',
      fileName: (format) => `candor-web-components.${format === 'es' ? 'js' : 'umd.cjs'}`,
      formats: ['es', 'umd'],
    },
    outDir: 'web-components/dist',
    emptyOutDir: true,
  },
});
