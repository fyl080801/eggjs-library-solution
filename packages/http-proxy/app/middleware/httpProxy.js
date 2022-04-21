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

      const proxy = koa2connect(
        createProxyMiddleware(
          new URL(originpath, instance.target).pathname,
          instance,
        ),
      )

      await proxy(ctx, next)
    } else {
      await next()
    }
  }
}
