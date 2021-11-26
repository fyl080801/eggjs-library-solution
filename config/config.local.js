'use strict';

module.exports = () => {
  const config = (exports = {});

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0',
    },
  };

  config.statics = {
    matcher: (ctx) => {
      const key = Object.keys(ctx.app.statics).find((p) => {
        return ctx.request.url.indexOf(`/${p}/`) === 0;
      });

      return key || '@egglib/test1';
    },
    clients: {
      '@egglib/test1': {
        type: 'webpack',
      },
    },
  };

  return { ...config };
};
