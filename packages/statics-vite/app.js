'use strict'

module.exports = (app) => {
  const { clients = {} } = app.config.statics || {}

  if (Object.keys(clients).find((key) => clients[key].type === 'dev')) {
    app.config.coreMiddleware.push('vite')
  }

  const staticIndex = app.config.coreMiddleware.indexOf('static')

  app.config.coreMiddleware.splice(staticIndex, 0, 'staticInject')
}
