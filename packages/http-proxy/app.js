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
        return
      }

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
