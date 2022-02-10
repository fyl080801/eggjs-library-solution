'use strict'

module.exports = (app) => {
  const staticIndex = app.config.coreMiddleware.indexOf('static')

  app.config.coreMiddleware.splice(staticIndex, 0, 'staticInject')
}
