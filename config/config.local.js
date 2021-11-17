'use strict';

module.exports = () => {
  const config = (exports = {});

  config.pages = {
    enableWebpack: true,
    matcher: (ctx) => {
      const key = Object.keys(ctx.app.staticConfigs).find((p) => {
        return ctx.request.url.indexOf(`/${p}/`) === 0;
      });

      return key || '@egglib/test1';
    },
  };

  return { ...config };
};
