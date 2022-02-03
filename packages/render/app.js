const { name } = require('./package.json');

module.exports = (app) => {
  app.addPageConfig(name);

  const { homePath = '*', renderPath = '' } = app.config.render || {};

  app.router.get(
    `/${renderPath.replace(/^\//g, '')}/api/v1/render`,
    async (ctx) => {
      const { query, service } = ctx;

      ctx.body = await service.render.getRenderPage(query.path);
    },
  );

  app.router.get(homePath, app.viewInject(name, 'index.html'), (ctx) => {
    ctx.body = {
      prefix: renderPath,
    };
  });
};
