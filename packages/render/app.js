'use strict'

const { name } = require('./package.json')

module.exports = (app) => {
  app.addPageConfig(name)

  const { prefix = '/render', external = [] } = app.config.render || {}

  const renderPrefix = `/${prefix.replace(/^\//g, '')}`

  app.router.get(`${renderPrefix}/api/v1/render`, async (ctx) => {
    const { query, service } = ctx
    ctx.body = await service.render.getRenderPage(query.path)
  })

  app.router.get(
    `${renderPrefix}/*`,
    app.viewInject(name, 'index.html'),
    (ctx) => {
      ctx.body = {
        prefix: renderPrefix,
        external: JSON.stringify(external),
      }
    },
  )
}
