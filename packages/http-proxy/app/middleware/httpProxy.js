'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')

const koa2connect = require('koa2-connect')

const pathMatching = require('egg-path-matching')

module.exports = (options) => {
  return async (ctx, next) => {
    const originpath = ctx.request.originalUrl || ctx.request.url

    let matchedProxy = null

    if (Array.isArray(options)) {
      const matchedIndex = options.findIndex((item) => {
        return item.match instanceof RegExp
          ? new RegExp(item.match).test(originpath)
          : pathMatching({ match: item.match })({ path: originpath })
      })
      matchedProxy = options[matchedIndex] && options[matchedIndex].proxy
    } else if (typeof options === 'object') {
      const matchedKey = Object.keys(options || {}).find((key) => {
        return pathMatching({ match: key })({ path: originpath })
      })
      matchedProxy = options[matchedKey]
    }

    if (!matchedProxy) {
      await next()
      return
    }

    const instance =
      typeof matchedProxy === 'function' ? matchedProxy(ctx) : matchedProxy

    const config = instance instanceof Promise ? await instance : instance

    if (!config) {
      await next()
      return
    }

    const proxy = createProxyMiddleware(config)

    if (!config.ws) {
      await koa2connect(proxy)(ctx, next)
    } else {
      await next()
    }
  }
}
