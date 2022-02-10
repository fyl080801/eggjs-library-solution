'use strict'

const { name } = require('./package.json')

module.exports = (app) => {
  app.addPageConfig(name)

  const { prefix, external = [] } = app.config.render || {}

  const basePrefix = typeof prefix === 'string' ? prefix : '/render'

  const renderPrefix = `/${basePrefix
    .split('/')
    .filter((item) => item)
    .join('/')}`

  const homePrefix = `${renderPrefix}/*`
    .split('/')
    .filter((item) => item)
    .join('/')

  const apiPath = `${renderPrefix}/api/v1/render`
    .split('/')
    .filter((item) => item)
    .join('/')

  app.router.get(
    apiPath.startsWith('/') ? apiPath : `/${apiPath}`,
    async (ctx) => {
      const { query, service } = ctx
      ctx.body = await service.render.getRenderPage(query.path)
    },
  )

  app.router.get(
    homePrefix.startsWith('/') ? homePrefix : `/${homePrefix}`,
    app.viewInject(name, 'index.html'),
    (ctx) => {
      ctx.body = {
        prefix: renderPrefix,
        external: JSON.stringify(external),
      }
    },
  )
}
