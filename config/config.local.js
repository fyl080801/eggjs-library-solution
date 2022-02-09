'use strict'

const path = require('path')

exports.statics = {
  default: '@egglib/render',
  clients: {
    '@egglib/render': {
      // type: 'dev',
    },
  },
  env: {},
}

exports.render = {
  homePath: '*',
  renderPath: '/egglib/render',
  configDir: path.resolve(process.cwd(), 'pages'),
  // external: [
  //   {
  //     type: 'script',
  //     src: 'https://cdn.jsdelivr.net/npm/element-ui',
  //   },
  //   {
  //     type: 'link',
  //     href: 'https://cdn.jsdelivr.net/npm/element-ui/lib/theme-chalk/index.css',
  //   },
  // ],
}
