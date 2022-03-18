'use strict'

const koaWebpack = require('koa-webpack')

module.exports = (options, app) => {
  const middlewareMap = {}

  Object.keys(app.vuecliConfigs).forEach((key) => {
    middlewareMap[key] = koaWebpack(app.vuecliConfigs[key])
  })

  return async function (ctx, next) {
    const matched = middlewareMap[app.matchStatic(ctx, app.vuecliConfigs)]

    return (matched && (await matched)(ctx, next)) || next()
  }
}
