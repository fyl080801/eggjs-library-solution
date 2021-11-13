'use strict';

const { name } = require('./package.json');

module.exports = (app) => {
  app.addPageConfig(name);

  app.router.get('/index', (ctx) => {
    ctx.body = { text: 'asdasdasdas' };
  });

  app.router.get('*', app.injectView(name, 'index.html'), (ctx) => {
    ctx.body = { text: 'zzzz' };
  });
};
