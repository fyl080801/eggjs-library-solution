'use strict'

const { join } = require('path')

const root = require('app-root-path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const { getClient } = require('./client')
const { getMiddleware } = require('./middleware')

const defaults = { devMiddleware: {}, hotClient: {} }

module.exports = async (opts) => {
  const options = Object.assign({}, defaults, opts)

  let { compiler, config } = options

  if (!compiler) {
    if (!config) {
      config = require(options.configPath ||
        join(root.path, 'webpack.config.js'))
    }

    compiler = webpack(config)
  }

  if (!options.devMiddleware.publicPath) {
    const { publicPath } = compiler.options.output

    if (!publicPath) {
      throw new Error(
        "egglib/webpack: publicPath must be set on `dev` options, or in a compiler's `output` configuration.",
      )
    }

    options.devMiddleware.publicPath = publicPath
  }

  const hotClient = await getClient(compiler)
  const devMiddleware = webpackDevMiddleware(compiler, options.devMiddleware)
  const middleware = getMiddleware(compiler, devMiddleware)
  const close = (callback) => {
    const next = hotClient ? () => hotClient.close(callback) : callback
    devMiddleware.close(next)
  }

  return Object.assign(middleware, {
    hotClient,
    devMiddleware,
    close,
  })
}
