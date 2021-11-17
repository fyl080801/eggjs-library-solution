'use strict';

const { name } = require('./package.json');

module.exports = (app) => {
  app.addStaticConfig(name);
};
