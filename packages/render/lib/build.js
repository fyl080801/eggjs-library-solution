'use strict'

const { build } = require('vite')
const path = require('path')
const { createVuePlugin } = require('vite-plugin-vue2')
const fetch = require('node-fetch')
const fs = require('fs')
const { v4 } = require('uuid')

module.exports = async (dir, config) => {
  const { external = [] } = config
  const builderPath = path.resolve(dir, 'builder')

  if (fs.existsSync(builderPath)) {
    await fs.promises.rm(builderPath, { recursive: true, force: true })
  }

  await fs.promises.mkdir(builderPath, {})

  const results = await Promise.all(
    external.map((url) => {
      return fetch(url)
    }),
  )
  const downloads = await Promise.all(
    results.map((item) => {
      return item.text()
    }),
  )

  const caches = await Promise.all(
    downloads.map((item) => {
      const filename = path.resolve(dir, `builder/${v4()}.js`)

      return fs.promises.writeFile(filename, item).then(() => {
        return filename
      })
    }),
  )

  const entryname = 'entry.js'

  await fs.promises.writeFile(
    path.resolve(dir, `builder/${entryname}`),
    caches.map((c) => `import '${c}'`).join(';'),
  )

  await build({
    build: {
      rollupOptions: {
        external: ['@jrender-legacy/core', 'vue', '@vue/composition-api'],
        input: {
          entry: path.resolve(dir, 'builder/entry.js'),
        },
        output: {
          format: 'iife',
          globals: {
            '@jrender-legacy/core': 'JRender',
            vue: 'Vue',
            '@vue/composition-api': 'VueCompositionAPI',
          },
        },
      },
      outDir: path.resolve(dir, 'output'),
      manifest: true,
    },
    plugins: [createVuePlugin()],
  })

  await fs.promises.rm(builderPath, { recursive: true, force: true })
}
