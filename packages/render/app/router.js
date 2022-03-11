'use strict'

const fs = require('fs')
const path = require('path')

module.exports = (app, name) => {
  const { prefix, styles = [] } = app.config.render || {}

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
      const file = await fs.promises.readFile(
        path.resolve(__dirname, '../output/manifest.json'),
      )

      const resource = JSON.parse(file.toString())

      const external = Object.values(resource).map((item) => {
        return `/render-extends/${item.file}`
      })

      ctx.body = {
        prefix: renderPrefix,
        external,
        styles,
      }
    },
  )
}
