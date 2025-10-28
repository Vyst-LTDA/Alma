/*
 * Copyright (C) 2025 Vyst Enterprise. / Vyst Software.
 * Original File Author: Pedro Henrique (phkaiser13)
 *
 * License:
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at:
 *       http://www.apache.org/licenses/LICENSE-2.0
 *   This software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 *   OF ANY KIND, either express or implied. See the License for the specific language 
 *   governing permissions and limitations under the License.
 *
 * Distribution & Contribution:
 *   This project is open-source and contributions are welcome. Please visit 
 *   https://github.com/phkaiser13/Storia-LITE for documentation, issue tracking, and contribution guidelines.
 *
 * SPDX-License-Identifier: Apache-2.0
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
