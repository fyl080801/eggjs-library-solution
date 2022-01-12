'use strict';

const path = require('path');
const { loadConfigFromFile } = require('vite');

const VITE = Symbol('Application#vite');
const STATICS = Symbol('Application#statcis');

const getCallerFile = function () {
  let filename;

  const pst = Error.prepareStackTrace;

  Error.prepareStackTrace = function (err, stack) {
    return stack;
  };

  try {
    let callerFile;
    const err = new Error();
    const currentFile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerFile = err.stack.shift().getFileName();

      if (currentFile !== callerFile) {
        filename = callerFile;
        break;
      }
    }
  } catch (err) {
    //
  }

  Error.prepareStackTrace = pst;

  return path.dirname(filename);
};

module.exports = {
  get viteConfigs() {
    if (!this[VITE]) {
      this[VITE] = {};
    }
    return this[VITE];
  },
  get statics() {
    if (!this[STATICS]) {
      this[STATICS] = {};
    }
    return this[STATICS];
  },
  addPageConfig(name, dir) {
    const { clients = {} } = this.config.statics || {};
    const dirname = dir || getCallerFile.call(this);
    const client = clients[name] || {};

    if (!client.type || client.type === 'dist') {
      this.statics[name] = path.resolve(dirname, client.dir || 'dist');
    } else if (client.type === 'dev') {
      this.viteConfigs[name] = {
        name,
        rootPath: dirname,
        configFile: path.resolve(dirname, client.dir || 'vite.config.js'),
      };
    }
  },
  viewInject(name, view) {
    const { clients = {}, env = {} } = this.config.statics || {};
    const client = clients[name] || {};

    return async (ctx, next) => {
      await next();

      const data = Object.assign(
        env,
        (typeof ctx.body === 'object' && ctx.body) || {},
      );

      if (!client.type || client.type === 'dist') {
        const config = this.statics[name];
        await ctx.render(path.resolve(config, view), data);
      } else if (client.type === 'dev') {
        const config = this.webpackConfigs[name];

        const viewUrl = `${ctx.request.protocol}://${path.join(
          ctx.request.host,
          (config.devMiddleware || {}).publicPath,
          view,
        )}`;

        const response = await ctx.curl(viewUrl, {
          method: 'GET',
          timeout: 500000,
        });

        const content = response.data.toString();

        ctx.body = await ctx.renderString(content, data);
      }

      ctx.set('Content-Type', 'text/html');
    };
  },
};
