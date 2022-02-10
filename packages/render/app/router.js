'use strict'

const urljoin = require('url-join')

const normalizeUrl = (...args) => {
  const url = urljoin(...args)

  return url.startsWith('/') ? url : `/${url}`
}

module.exports = (app, name) => {
  const { prefix, external = [] } = app.config.render || {}

  const renderPrefix = normalizeUrl(
    typeof prefix === 'string' ? prefix : '/render',
  )

  app.router.get(normalizeUrl(renderPrefix, '/api/v1/render'), async (ctx) => {
    const { query, service } = ctx
    ctx.body = await service.render.getRenderPage(query.path)
  })

  app.router.get(
    normalizeUrl(renderPrefix, '*'),
    app.viewInject(name, 'index.html'),
    (ctx) => {
      ctx.body = {
        prefix: renderPrefix,
        external: JSON.stringify(external),
      }
    },
  )
}
