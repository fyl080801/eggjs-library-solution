'use strict'

const webpackDevMiddleware = require('../lib')

module.exports = (options, app) => {
  const middlewareMap = {}

  Object.keys(app.webpackConfigs).forEach((key) => {
    middlewareMap[key] = webpackDevMiddleware(app.webpackConfigs[key])
  })

  return async (ctx, next) => {
    const matched = middlewareMap[app.matchStatic(ctx, app.webpackConfigs)]

    return (matched && (await matched)(ctx, next)) || next()
  }
}
