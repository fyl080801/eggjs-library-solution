import { defineConfig } from 'vite';

import { name } from './package.json';

export default defineConfig({
  resolve: {},
  build: {
    assetsDir: `${name}`,
  },
  plugins: [],
});
