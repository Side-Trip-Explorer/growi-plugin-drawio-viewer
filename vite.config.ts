// vite.config.ts
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // react を growiFacade.react へのプロキシ shim に差し替える。
      // Growi は自身の React を growiFacade.react に注入するため、
      // プラグインが同じインスタンスを使わないと hooks が壊れる。
      'react/jsx-runtime': path.resolve('./src/react-jsx-runtime-shim.ts'),
      react: path.resolve('./src/react-shim.ts'),
    },
  },
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: ['client-entry.tsx'],
    },
  },
});
