'use strict'

const { name } = require('./package.json')
const path = require('path')

module.exports = (app) => {
  app.addPageConfig(name)
  app.addPageConfig(
    'render-extends',
    app.config.render.configRoot || path.resolve(process.cwd(), 'pages'),
  )

  require('./app/router')(app, name)
}
