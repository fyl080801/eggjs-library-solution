'use strict'

module.exports = (appInfo) => {
  const config = (exports = {})

  config.keys = appInfo.name + '_1636560035989_1239'

  config.development = {
    overrideDefault: true,
    overrideIgnore: true,
    watchDirs: ['app', 'config', 'app.js', 'agent.js', 'packages'],
    ignoreDirs: ['node_modules', 'src/**/*', 'packages/render/src/**/*'],
  }

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  }

  config.middleware = []

  const userConfig = {}

  return {
    ...config,
    ...userConfig,
  }
}
