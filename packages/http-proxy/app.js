'use strict'

const pathMatching = require('egg-path-matching')
const { createProxyMiddleware } = require('http-proxy-middleware')

class AppBootHook {
  constructor(app) {
    this.app = app
  }

  configDidLoad() {
    const index = this.app.config.coreMiddleware.indexOf('bodyParser')

    this.app.config.coreMiddleware.splice(index, 0, 'httpProxy')
  }

  async serverDidReady() {
    const options = this.app.config.httpProxy

    this.app.server.on('upgrade', async (req, socket, header) => {
      const originpath = req.originalUrl || req.url

      const matchedKey = Object.keys(options).find((key) => {
        return key instanceof RegExp
          ? new RegExp(key).test(originpath)
          : pathMatching({ match: key })({ path: originpath })
      })

      if (!matchedKey) {
        return
      }

      const matchedProxy = options[matchedKey]

      const instance =
        typeof matchedProxy === 'function'
          ? matchedProxy(this.app.createContext(req))
          : matchedProxy

      const config = instance instanceof Promise ? await instance : instance

      if (!config || !config.ws) {
        return
      }

      const proxy = createProxyMiddleware(config)

      if (typeof config.onUpgrade === 'function') {
        const handled = config.onUpgrade(req, socket, header)

        if (handled instanceof Promise) {
          await handled
        }
      }

      proxy.upgrade(req, socket, header)
    })
  }
}

module.exports = AppBootHook
