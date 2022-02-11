'use strict'

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
    (ctx) => {
      ctx.body = {
        prefix: renderPrefix,
        external: JSON.stringify(external),
        styles,
      }
    },
  )
}
