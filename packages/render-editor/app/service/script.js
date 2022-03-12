'use strict'

const { Service } = require('egg')

const path = require('path')

const fs = require('fs')

const { build } = require('vite')

const { createVuePlugin } = require('vite-plugin-vue2')

class ScriptService extends Service {
  async build(root) {
    const appConfig = path.resolve(root, 'app.json')

    if (!fs.existsSync(appConfig)) {
      return
    }

    const config = JSON.parse(await fs.promises.readFile(appConfig))

    if (!config.script) {
      return
    }

    build({
      build: {
        rollupOptions: {
          external: ['@jrender-legacy/core', 'vue', '@vue/composition-api'],
          input: {
            entry: path.resolve(root, config.script),
          },
          output: {
            format: 'iife',
            dir: root,
            globals: {
              '@jrender-legacy/core': 'JRender',
              vue: 'Vue',
              '@vue/composition-api': 'VueCompositionAPI',
            },
          },
        },
        manifest: true,
      },
      plugins: [createVuePlugin()],
    })
  }
}

module.exports = ScriptService
