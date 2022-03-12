'use strict'

const fs = require('fs')

const path = require('path')

module.exports = (app, name) => {
  const { prefix, external = [], styles = [] } = app.config.render || {}

  const renderPrefix = app.normalizeUrl(
    typeof prefix === 'string' ? prefix : '/render',
  )

  app.router.get(
    app.normalizeUrl(renderPrefix, '/api/v1/render'),
    async (ctx) => {
      const { query, service } = ctx
      ctx.body = await service.render.getRenderPage(query.path)
    },
  )

  app.router.get(
    app.normalizeUrl(renderPrefix, '*'),
    app.viewInject(name, 'index.html'),
    async (ctx) => {
      const configRoot = ctx.service.render.getRenderRoot()

      const manifestFile = path.resolve(configRoot, 'manifest.json')

      const extend = []

      if (fs.existsSync(manifestFile)) {
        const manifest = JSON.parse(await fs.promises.readFile(manifestFile))

        Object.values(manifest).forEach((item) => {
          extend.push(`/render-extends/${item.file}`)
        })
      }

      ctx.body = {
        prefix: renderPrefix,
        external: JSON.stringify(extend.concat(external)),
        styles,
      }
    },
  )
}
