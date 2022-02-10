'use strict'

const urljoin = require('url-join')

const normalizeUrl = (...args) => {
  const url = urljoin(...args)

  return url.startsWith('/') ? url : `/${url}`
}

module.exports = (app, name) => {
  const { prefix } = app.config.renderEditor || {}

  const normalizePrefix = normalizeUrl(
    typeof prefix === 'string' ? prefix : '/render-editor',
  )

  app.router.all(normalizeUrl(normalizePrefix, '/api/v1/routes'), (ctx) => {
    // console.log(ctx.method)
    ctx.body = {}
  })

  app.router.get(
    `${normalizePrefix}*`,
    app.viewInject(name, 'index.html'),
    (ctx) => {
      ctx.body = {
        prefix: normalizePrefix,
      }
    },
  )
}
