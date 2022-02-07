const { name } = require('./package.json');

module.exports = (app) => {
  app.addPageConfig(name);

  app.router.get('*', app.viewInject(name, 'index.html'), () => {});
};
