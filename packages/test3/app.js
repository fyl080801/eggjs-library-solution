'use strict';

const { name } = require('./package.json');

module.exports = (app) => {
  app.addPageConfig(name);

  // app.router.get('/index', (ctx) => {
  //   ctx.body = { text: 'asdasdasdas' };
  // });

  app.router.get('/test3', app.viewInject(name, 'index.html'), () => {
    // ctx.body = {};
  });
};
