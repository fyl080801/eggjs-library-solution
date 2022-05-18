'use strict'

const Mock = require('mockjs')

const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`${url}`),
    type: type || 'get',
    response(ctx) {
      console.log('request invoke:' + ctx.path)
      return Mock.mock(respond instanceof Function ? respond(ctx) : respond)
    },
  }
}

module.exports = (options) => {
  const { mockPath } = options

  const table = new Map()

  const registerRoutes = () => {
    const mocks = require(mockPath)

    for (const mock of mocks) {
      const faked = responseFake(mock.url, mock.type, mock.response)
      const name = faked.type.toUpperCase()
      let method = table.get(name)
      if (!method) {
        method = []
        table.set(name, method)
      }
      method.push(faked)
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
  // const chalk = require('chalk')

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
          console.log(`\n > Mock Server hot reload success! changed  ${path}`)
          // console.log(
          //   chalk.magentaBright(
          //     `\n > Mock Server hot reload success! changed  ${path}`,
          //   ),
          // )
        } catch (error) {
          // console.log(chalk.redBright(error))
          console.log(error)
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

    const response = mock.response(ctx)
    // 需要补充头信息填充

    const headers = response.headers || {}

    Object.keys(headers).forEach((key) => {
      ctx.set(key, headers[key])
    })

    ctx.body = response.data
  }
}
