'use strict'

const { name } = require('./package.json')

const path = require('path')

const build = require('./lib/build')

module.exports = (app) => {
  app.beforeStart(async () => {
    console.log('start load render extends')
    await build(__dirname, app.config.render)
    console.log('render extends is build')
  })

  app.addPageConfig(name)
  app.addPageConfig('render-extends', path.resolve(__dirname, `output`))

  require('./app/router')(app, name)
}
