'use strict';

const { name } = require('./package.json');
const path = require('path');

module.exports = (app) => {
  app.addPageConfig(name, {
    config: {
      mode: 'development',
      entry: [path.resolve(__dirname, './src/main.js')],
      output: {
        publicPath: '/public/',
      },
    },
  });

  app.router.get('/index', (ctx) => {
    ctx.body = 'aaa';
  });
};
// { amd?, bail?, cache?, context?, dependencies?, devServer?, devtool?, entry?, externals?, infrastructureLogging?, loader?, mode?, module?, name?, node?, optimization?, output?, parallelism?, performance?, plugins?, profile?, recordsInputPath?, recordsOutputPath?, recordsPath?, resolve?, resolveLoader?, serve?, stats?, target?, watch?, watchOptions? }
