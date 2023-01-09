'use strict'

const { createServer, loadConfigFromFile, mergeConfig } = require('vite')
const net = require('net')
const os = require('os')

const serviceToken = Symbol('serviceToken')
const serviceInitToken = Symbol('Application#serviceInitToken')

const VITE = Symbol('Application#vite')

const getLocalHosts = () => {
  const interfaces = os.networkInterfaces()

  const results = new Set([undefined, '::'])

  for (const inter of Object.values(interfaces)) {
    for (const config of inter) {
      results.add(config.address)
    }
  }

  return results
}

const createPortDiscover = () => {
  const hosts = getLocalHosts()

  const checkAvailablePort = (port) => {
    return new Promise((resolve, reject) => {
      const server = net.createServer()

      server.unref()

      server.on('error', reject)

      server.listen({ port, hosts }, () => {
        const { port } = server.address()

        server.close(() => {
          resolve(port)
        })
      })
    })
  }

  const getPort = async (from, callback) => {
    const result = await checkAvailablePort(from)
      .then((e) => e)
      .catch((e) => e)

    if (result instanceof Error) {
      await getPort(from + 1, callback)
    } else {
      callback(from)
    }
  }

  return async (start) => {
    return new Promise((resolve) => {
      getPort(start, (result) => {
        resolve(result)
      })
    })
  }
}

const createMutilPortDiscover = (from, count) => {
  let wsPort = from

  const discover = createPortDiscover()

  return async () => {
    const results = []

    for (let i = 0; i < count; i++) {
      wsPort = await discover(wsPort + 1)
      results.push(wsPort)
    }

    return results
  }
}

module.exports = {
  get viteConfigs() {
    if (!this[VITE]) {
      this[VITE] = {}
    }
    return this[VITE]
  },

  get _viteService() {
    if (!this[serviceToken]) {
      this[serviceToken] = {}
    }

    return this[serviceToken]
  },

  get _viteInit() {
    return this[serviceInitToken]
  },
  set _viteInit(value) {
    this[serviceInitToken] = value
  },

  async getServer(currentCtx) {
    if (!this._viteInit) {
      // 服务可能很快，所以这里用同步方式获得多个可用端口用于hmr服务
      const wsPorts = await createMutilPortDiscover(
        24678,
        Object.keys(this.viteConfigs).length,
      )()

      await Promise.all(
        Object.keys(this.viteConfigs).map(async (key, index) => {
          if (!this._viteService[key]) {
            const config = this.viteConfigs[key]

            if (!config) {
              return
            }

            const viteConfig = await loadConfigFromFile({}, config.configFile)

            if (!viteConfig) {
              return
            }

            this._viteService[key] = await createServer(
              mergeConfig(viteConfig, {
                mode: 'development',
                root: config.rootPath,
                base: `/${config.name}/`,
                server: {
                  middlewareMode: true,
                  cors: false,
                  hmr: {
                    port: wsPorts[index],
                    clientPort: wsPorts[index],
                  },
                },
                appType: 'custom',
              }),
            )
          }
        }),
      )

      this._viteInit = true
    }

    // const { matcher } = this.config.statics || {}

    // const staticsMatcher =
    //   matcher && typeof matcher === 'function'
    //     ? matcher
    //     : (ctx) => {
    //         let key = Object.keys(this.statics || {}).find((p) => {
    //           return ctx.request.url.indexOf(`/${p}/`) === 0
    //         })

    //         if (!key) {
    //           key = Object.keys(this.viteConfigs || {}).find((p) => {
    //             return ctx.request.url.indexOf(`/${p}/`) === 0
    //           })
    //         }

    //         return key || this.config.statics.default
    //       }

    return this._viteService[
      typeof currentCtx === 'string'
        ? currentCtx
        : this.matchStatic(currentCtx, this.viteConfigs)
    ]
  },
}
