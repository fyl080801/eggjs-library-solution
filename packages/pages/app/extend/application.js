'use strict';

const path = require('path');
const PAGES = Symbol('Application#pages');

module.exports = {
  get pageConfigs() {
    if (!this[PAGES]) {
      this[PAGES] = {};
    }
    return this[PAGES];
  },
  addPageConfig(key, config) {
    this.pageConfigs[key] = config;
  },
  injectView(name, view) {
    const config = this.pageConfigs[name];

    return async (ctx, next) => {
      await next();

      // 注入视图输出
      if (config) {
        // dev
        const viewUrl = `${ctx.request.protocol}://${path.join(
          ctx.request.host,
          (config.devMiddleware || {}).publicPath,
          view,
        )}`;

        const response = await ctx.curl(viewUrl, {
          method: 'GET',
          timeout: 500000,
        });

        const content = response.data.toString();

        ctx.body = await ctx.renderString(
          content,
          (typeof ctx.body === 'object' && ctx.body) || {},
        );
      } else {
        // packed
      }

      ctx.set('Content-Type', 'text/html');
    };
  },
};
