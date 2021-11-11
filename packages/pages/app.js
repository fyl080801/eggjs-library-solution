'use strict';

module.exports = (app) => {
  const { enableWebpack } = app.config.pages || {};

  if (enableWebpack) {
    app.config.coreMiddleware.push('webpack');
  }
};
