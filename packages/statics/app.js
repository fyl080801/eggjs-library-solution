'use strict'

const { globalServiceProvider, createSingleService } = require('./lib/service')

globalServiceProvider.addService(createSingleService('onViewConfig'))

globalServiceProvider.addService(createSingleService('onViewInject'))

module.exports = (app) => {
  const staticIndex = app.config.coreMiddleware.indexOf('static')

  app.config.coreMiddleware.splice(staticIndex, 0, 'staticInject')
}
