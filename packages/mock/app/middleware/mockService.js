'use strict'

module.exports = (options) => {
  if (process.env.DEV_MODE !== 'mock') {
    return function (ctx, next) {
      return next()
    }
  }

  const { mockPath } = options

  const table = new Map()

  const registerRoutes = () => {
    const mocks = require(mockPath)

    for (const mock of mocks) {
      const name = mock.type.toUpperCase()
      let method = table.get(name)
      if (!method) {
        method = []
        table.set(name, method)
      }
      method.push(mock)
    }
  }

  const unregisterRoutes = () => {
    Object.keys(require.cache).forEach((i) => {
      if (i.includes(mockPath)) {
        delete require.cache[require.resolve(i)]
      }
    })
    table.clear()
  }

  const chokidar = require('chokidar')
  const chalk = require('chalk')

  registerRoutes()

  chokidar
    .watch(mockPath, {
      ignored: /mock-server/,
      ignoreInitial: true,
    })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          unregisterRoutes()
          registerRoutes()
          console.log(
            chalk.magentaBright(
              `\n > Mock Server hot reload success! changed  ${path}`,
            ),
          )
        } catch (error) {
          console.log(chalk.redBright(error))
        }
      }
    })

  return function (ctx, next) {
    const method = table.get(ctx.request.method.toUpperCase())

    if (!method) {
      return next()
    }

    const mock = method.find((item) => item.url.test(ctx.request.url))

    if (!mock) {
      return next()
    }

    ctx.body = mock.response(ctx)
  }
}
