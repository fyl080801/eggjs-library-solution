'use strict'

const path = require('path')

exports.statics = {
  default: '@egglib/render',
  clients: {
    '@egglib/render': {
      type: 'dev',
    },
    '@egglib/render-editor': {
      type: 'dev',
    },
  },
  env: {},
}

exports.render = {
  // prefix: '/render',
  configRoot: path.resolve(process.cwd(), 'pages'),
  external: [
    'https://cdn.jsdelivr.net/npm/element-ui/lib/index.js',
    'https://cdn.jsdelivr.net/npm/element-ui/lib/theme-chalk/index.css',
    '/public/render/component.js',
    '/public/render/extstyle.css',
  ],
}

exports.renderEditor = {
  prefix: '/render-editor111',
}
