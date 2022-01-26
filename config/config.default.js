/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1636560035989_1239';

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.development = {
    overrideDefault: true,
    overrideIgnore: true,
    watchDirs: ['app', 'config', 'app.js', 'agent.js'],
    ignoreDirs: ['src/**/*', '.cache/**/*', 'packages/test3/src/**/*'],
  };

  config.cluster = {
    listen: {
      port: process.env.PORT || 3001,
      hostname: '0.0.0.0',
    },
  };

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
