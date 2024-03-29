'use strict'

const { useServiceProvider } = require('@egglib/statics/lib/service')
const path = require('path')

module.exports = (app) => {
  const { clients = {} } = app.config.statics || {}

  if (Object.keys(clients).find((key) => clients[key].dev)) {
    const corsIndex = app.config.coreMiddleware.indexOf('cors')
    app.config.coreMiddleware.splice(corsIndex + 1, 0, 'vuecli')
  }

  useServiceProvider(({ onViewConfig, onViewInject }) => {
    onViewConfig(({ name, rootPath }) => {
      const Service = require('@vue/cli-service')

      const ins = new Service(rootPath)

      ins.init(process.env.NODE_ENV)

      const config = ins.resolveWebpackConfig()

      app.vuecliConfigs[name] = {
        config,
        devMiddleware: {
          publicPath: config.output.publicPath,
          serverSideRender: true,
        },
        hotClient: {},
      }
    })

    onViewInject(async ({ name, ctx, view }) => {
      const config = app.vuecliConfigs[name]

      const viewUrl = `${ctx.request.protocol}://${path.join(
        ctx.request.host,
        (config.devMiddleware || {}).publicPath,
        view,
      )}`

      const response = await ctx.curl(viewUrl, {
        method: 'GET',
        timeout: 500000,
        headers: {
          accept: 'text/html',
        },
        rejectUnauthorized: false,
      })

      return response.data.toString()
    })
  })
}
