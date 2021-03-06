'use strict'

const path = require('path')

const urljoin = require('url-join')

const STATICS = Symbol('Application#statcis')

const PIPELINE = Symbol('Application#PIPELINE')

const PROVIDERS = Symbol('Application#statcis_PROVIDERS')

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

  get staticProvider() {
    return this[PROVIDERS]
  },
  set staticProvider(value) {
    this[PROVIDERS] = value
  },

  normalizeUrl(...args) {
    const url = urljoin(...args)

    return url.startsWith('/') ? url : `/${url}`
  },

  setProvider(provider) {
    if (
      !provider ||
      typeof provider.setConfig !== 'function' ||
      typeof provider.viewInjector !== 'function'
    ) {
      return
    }

    this.staticProvider = provider
  },

  addPageConfig(name, dir) {
    const { clients = {} } = this.config.statics || {}
    const dirname = dir || getCallerFile.call(this)
    const client = clients[name] || {}

    if (!client.dev || !this.staticProvider) {
      this.statics[name] = dir || path.resolve(dirname, client.dist || 'dist')
    } else {
      this.staticProvider.setConfig({
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

      if (!client.dev || !this.staticProvider) {
        const config = this.statics[name]
        await ctx.render(path.resolve(config, view), data)
        ctx.set('Content-Type', 'text/html')
      } else {
        const result = await this.staticProvider.viewInjector({
          name,
          ctx,
          view,
        })

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
