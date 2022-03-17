'use strict'

const devServer = require('webpack-dev-server')

module.exports = {
  getClient(compiler) {
    return new Promise((resolve) => {
      const server = new devServer({}, compiler)

      server.start().then(() => {
        resolve(server)
      })
    })
  },
}
