'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')

const koa2connect = require('koa2-connect')

const pathMatching = require('egg-path-matching')

module.exports = (options) => {
  return async (ctx, next) => {
    const originpath = ctx.request.originalUrl || ctx.request.url

    const matchedKey = Object.keys(options).find((key) => {
      return key instanceof RegExp
        ? new RegExp(key).test(originpath)
        : pathMatching({ match: key })({ path: originpath })
    })

    if (matchedKey) {
      const matchedProxy = options[matchedKey]

      const instance =
        typeof matchedProxy === 'function' ? matchedProxy(ctx) : matchedProxy

      const config = instance instanceof Promise ? await instance : instance

      const proxy = createProxyMiddleware(config)

      if (config.ws) {
        proxy.upgrade(ctx.req, ctx.socket, ctx.header)
      }

      await koa2connect(proxy)(ctx, next)
    } else {
      await next()
    }
  }
}
