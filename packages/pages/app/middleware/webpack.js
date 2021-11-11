'use strict';

const koaWebpack = require('koa-webpack');

module.exports = (options, app) => {
  const { matcher = () => {} } = app.config.pages || '';

  const middlewares = {};

  Object.keys(app.pageConfigs).forEach((key) => {
    middlewares[key] = koaWebpack(app.pageConfigs[key]);
  });

  return async function (ctx, next) {
    const matched = middlewares[matcher(ctx)];

    (matched && (await matched)(ctx, next)) || next();
  };
};
