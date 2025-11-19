/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import path from 'path';
// FIX: Import process to provide types for process.cwd()
import process from 'process';
// FIX: Import fileURLToPath to define __dirname in ES modules
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// FIX: Define __dirname for ES module scope as it's not available by default.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: './',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      viteSingleFile(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      assetsInlineLimit: 100000000,
      assetsDir: '',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      }
    },
  };
});