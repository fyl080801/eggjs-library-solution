'use strict'

const { name } = require('./package.json')

module.exports = (app) => {
  app.addPageConfig(name)

  require('./lib/manifests')(app)
  require('./app/router')(app, name)
}
