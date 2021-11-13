'use strict';

module.exports = (app) => {
  const { enableWebpack } = app.config.pages || {};

  if (enableWebpack) {
    app.config.coreMiddleware.push('webpack');
  }

  const staticIndex = app.config.coreMiddleware.indexOf('static');

  app.config.coreMiddleware.splice(staticIndex, 0, 'staticInject');
};
