'use strict'

const path = require('path')

const urljoin = require('url-join')
const { isPromise } = require('../../lib/helpers')
const { useServiceProvider } = require('../../lib/service')

const STATICS = Symbol('Application#statcis')

const PIPELINE = Symbol('Application#PIPELINE')

const getCallerFile = function () {
  let filename

  const pst = Error.prepareStackTrace

  Error.prepareStackTrace = function (err, stack) {
    return stack
  }

  try {
    let callerFile
    const err = new Error()
    const currentFile = err.stack.shift().getFileName()

    while (err.stack.length) {
      callerFile = err.stack.shift().getFileName()

      if (currentFile !== callerFile) {
        filename = callerFile
        break
      }
    }
  } catch (err) {
    //
  }

  Error.prepareStackTrace = pst

  return path.dirname(filename)
}

module.exports = {
  get staticPipeline() {
    if (!this[PIPELINE]) {
      this[PIPELINE] = []
    }
    return this[PIPELINE]
  },

  get statics() {
    if (!this[STATICS]) {
      this[STATICS] = {}
    }
    return this[STATICS]
  },

  normalizeUrl(...args) {
    const url = urljoin(...args)

    return url.startsWith('/') ? url : `/${url}`
  },

  addPageConfig(name, dir) {
    const { clients = {} } = this.config.statics || {}
    const dirname = dir || getCallerFile.call(this)
    const client = clients[name] || {}

    const { getService } = useServiceProvider()

    const onViewConfig = getService('onViewConfig')

    if (!client.dev || !onViewConfig) {
      this.statics[name] = dir || path.resolve(dirname, client.dist || 'dist')
    } else {
      onViewConfig({
        name,
        client,
        rootPath: dirname,
      })
    }
  },

  viewInject(name, view) {
    const { clients = {}, env = {} } = this.config.statics || {}
    const client = clients[name] || {}

    return async (ctx, next) => {
      await next()

      const data = Object.assign(
        env,
        (typeof ctx.body === 'object' && ctx.body) || {},
      )

      const { getService } = useServiceProvider()

      const onViewInject = getService('onViewInject')

      if (!client.dev || !onViewInject) {
        const config = this.statics[name]
        await ctx.render(path.resolve(config, view), data)
        ctx.set('Content-Type', 'text/html')
      } else {
        let result = onViewInject({
          name,
          ctx,
          view,
        })

        result = isPromise(result) ? await result : result

        if (typeof result !== 'string') {
          return
        }

        ctx.body = await ctx.renderString(result, data)
        ctx.set('Content-Type', 'text/html')
      }
    }
  },

  matchStatic(ctx, configs) {
    const { matcher } = this.config.statics || {}

    const staticsMatcher =
      matcher && typeof matcher === 'function'
        ? matcher
        : (ctx, _configs) => {
            let key = Object.keys(this.statics || {}).find((p) => {
              return ctx.request.url.indexOf(`/${p}/`) === 0
            })

            if (!key) {
              key = Object.keys(_configs || {}).find((p) => {
                return ctx.request.url.indexOf(`/${p}/`) === 0
              })
            }

            return key || this.config.statics.default
          }

    return staticsMatcher(ctx, configs)
  },
}
