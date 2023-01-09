import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue2'
import WindiCSS from 'vite-plugin-windicss'

import { name } from './package.json'

export default defineConfig({
  base: `/${name}/`,
  plugins: [
    legacy({
      targets: ['defaults', 'IE 11'],
    }),
    vue(),
    WindiCSS(),
  ],
})
