'use strict';

const koaWebpack = require('koa-webpack');

module.exports = (options, app) => {
  const { matcher = () => {} } = app.config.pages || '';

  const middlewareMap = {};

  Object.keys(app.webpackConfigs).forEach((key) => {
    middlewareMap[key] = koaWebpack(app.webpackConfigs[key]);
  });

  return async function (ctx, next) {
    const matched = middlewareMap[matcher(ctx)];

    return (matched && (await matched)(ctx, next)) || next();
  };
};
