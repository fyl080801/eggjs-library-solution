import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { createVuePlugin } from 'vite-plugin-vue2';

import { name } from './package.json';

export default defineConfig({
  base: `${name}`,
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    createVuePlugin(),
  ],
});
