'use strict'

const path = require('path')
const fs = require('fs')
const { useServiceProvider } = require('@egglib/statics')

module.exports = (app) => {
  const { clients = {} } = app.config.statics || {}

  if (Object.keys(clients).find((key) => clients[key].dev)) {
    app.config.coreMiddleware.push('vite')
  }

  useServiceProvider(({ onViewConfig, onViewInject }) => {
    onViewConfig(({ name, client, rootPath }) => {
      app.viteConfigs[name] = {
        name,
        rootPath,
        configFile: path.resolve(
          rootPath,
          client.configFile || 'vite.config.js',
        ),
      }
    })

    onViewInject(async ({ name, ctx, view }) => {
      const config = app.viteConfigs[name]

      const server = await app.getServer(name)

      if (!server) {
        return false
      }

      const content = await server.transformIndexHtml(
        ctx.request.url,
        await fs.promises.readFile(path.join(config.rootPath, view), 'utf-8'),
      )

      return content
    })
  })
}
