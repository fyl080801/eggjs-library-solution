'use strict'

const webpack = require('webpack')
const Service = require('@vue/cli-service')
const webpackDevMiddleware = require('../lib')

module.exports = () => {
  // 这里的service之后放到config里由项目定义
  const service = new Service(process.cwd())

  service.init(process.env.NODE_ENV)

  const config = Service.defineConfig(service.resolveWebpackConfig())

  config.plugins.push(new webpack.HotModuleReplacementPlugin())

  let middleware = null

  return async (ctx, next) => {
    if (!middleware) {
      middleware = await webpackDevMiddleware({ compiler: webpack(config) })
    }
    return middleware(ctx, next)
  }
}
