'use strict';

const { name } = require('./package.json');
const path = require('path');
const Service = require('@vue/cli-service');

module.exports = (app) => {
  // 之后要判断是否是编译的包
  const isDist = false;

  // 不存在dist走webpack，存在dist走静态资源
  if (!isDist) {
    const service = new Service(path.resolve(__dirname, './'));
    service.init(process.env.NODE_ENV);
    const config = service.resolveWebpackConfig();

    app.addPageConfig(name, {
      config,
      devMiddleware: {
        publicPath: config.output.publicPath,
        serverSideRender: true,
      },
      hotClient: {},
    });
  }

  app.router.get('/index', app.injectView(name, 'index.html'), (ctx) => {
    ctx.body = { text: 'asdasdasdas' };
  });
};
