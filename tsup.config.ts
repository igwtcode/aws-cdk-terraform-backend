import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: false,
  minify: true,
  splitting: false,
  sourcemap: false,
  entry: ['src/index.ts'],
  format: ['esm'],
  // format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'node',
  target: 'node16',
  tsconfig: 'tsconfig.json',
});
