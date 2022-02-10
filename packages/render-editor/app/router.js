'use strict'

module.exports = (app, name) => {
  const { prefix } = app.config.renderEditor || {}

  const normalizePrefix = app.normalizeUrl(
    typeof prefix === 'string' ? prefix : '/render-editor',
  )

  app.router.all(app.normalizeUrl(normalizePrefix, '/api/v1/routes'), (ctx) => {
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
