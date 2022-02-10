'use strict'

const { name } = require('./package.json')

module.exports = (app) => {
  app.addPageConfig(name)

  app.router.get(
    '/render-editor*',
    app.viewInject(name, 'index.html'),
    (ctx) => {
      ctx.body = {}
    },
  )
}
