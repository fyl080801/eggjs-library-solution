import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createVuePlugin } from 'vite-plugin-vue2'

import { name } from './package.json'

export default defineConfig({
  base: `/${name}/`,
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    legacy({
      targets: ['defaults', 'IE 11'],
    }),
    createVuePlugin(),
  ],
})
