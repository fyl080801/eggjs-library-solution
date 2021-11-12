'use strict';

const { name } = require('./package.json');
const path = require('path');

module.exports = (app) => {
  app.addPageConfig(name, path.resolve(__dirname, './'));

  app.router.get('/index', (ctx) => {
    ctx.body = { text: 'asdasdasdas' };
  });

  app.router.get('*', app.injectView(name, 'index.html'), (ctx) => {
    ctx.body = { text: 'asdasdasdas' };
  });
};
