'use strict'

const koaWebpack = require('koa-webpack')

module.exports = (options, app) => {
  const { matcher } = app.config.statics || {}

  const staticsMatcher =
    matcher && typeof matcher === 'function'
      ? matcher
      : (ctx) => {
          let key = Object.keys(app.statics || {}).find((p) => {
            return ctx.request.url.indexOf(`/${p}/`) === 0
          })

          if (!key) {
            key = Object.keys(app.vuecliConfigs || {}).find((p) => {
              return ctx.request.url.indexOf(`/${p}/`) === 0
            })
          }

          return key || app.config.statics.default
        }

  const middlewareMap = {}

  Object.keys(app.vuecliConfigs).forEach((key) => {
    middlewareMap[key] = koaWebpack(app.vuecliConfigs[key])
  })

  return async function (ctx, next) {
    const matched = middlewareMap[staticsMatcher(ctx)]

    return (matched && (await matched)(ctx, next)) || next()
  }
}
