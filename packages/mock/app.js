'use strict'

module.exports = (app) => {
  const index =
    app.config.coreMiddleware.indexOf('httpProxy') ||
    app.config.coreMiddleware.indexOf('bodyParser')

  app.config.coreMiddleware.splice(index, 0, 'mockService')
}
