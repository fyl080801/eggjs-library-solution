'use strict'

const path = require('path')

exports.render = {
  // prefix: '/render',
  configRoot: path.resolve(process.cwd(), 'pages'),
  external: ['https://cdn.jsdelivr.net/npm/element-ui/lib/index.js'],
  styles: ['https://cdn.jsdelivr.net/npm/element-ui/lib/theme-chalk/index.css'],
}

exports.renderEditor = {
  prefix: '/render-editor',
}
