const path = require('path');

// exports.statics = {
//   default: '@egglib/render',
//   clients: {
//     '@egglib/render': {
//       type: 'dev',
//     },
//   },
//   env: {},
// };

exports.statics = {
  default: '@egglib/test1',
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
