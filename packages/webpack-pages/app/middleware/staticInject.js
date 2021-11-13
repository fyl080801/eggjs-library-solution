'use strict';

module.exports = (options, app) => {
  // static
  app.config.static.dir = [
    {
      prefix: app.config.static.prefix,
      dir: app.config.static.dir,
    },
  ];

  delete app.config.static.prefix;

  Object.keys(app.pageConfigs).forEach((key) => {
    const config = app.pageConfigs[key];

    if (typeof config === 'string') {
      app.config.static.dir.push({
        prefix: `/${key}/`,
        dir: config,
      });
    }
  });

  // view
  app.config.view.root = [...app.config.view.root, ''];

  return async function (ctx, next) {
    await next();
  };
};
