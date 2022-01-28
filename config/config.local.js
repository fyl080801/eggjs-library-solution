'use strict';

const path = require('path');

exports.statics = {
  default: '@egglib/render',
  clients: {
    '@egglib/render': {
      type: 'dev',
    },
  },
  env: {},
};

exports.render = {
  homePath: '*',
  renderPath: '/egglib/render',
  configDir: path.resolve(process.cwd(), 'pages'),
};
