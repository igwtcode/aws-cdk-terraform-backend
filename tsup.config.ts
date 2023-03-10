import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: false,
  minify: true,
  splitting: false,
  sourcemap: false,
  entry: ['src/index.ts'],
  format: ['cjs'],
  // format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'node',
  target: 'node14',
  tsconfig: 'tsconfig.json',
});
