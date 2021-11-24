'use strict';

const path = require('path');
const fs = require('fs');

const WEBPACK = Symbol('Application#webpack');
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
  get webpackConfigs() {
    if (!this[WEBPACK]) {
      this[WEBPACK] = {};
    }
    return this[WEBPACK];
  },
  get statics() {
    if (!this[STATICS]) {
      this[STATICS] = {};
    }
    return this[STATICS];
  },
  addPageConfig(name, dir) {
    const { clients = {} } = this.config.statics || {};
    const dirname = getCallerFile.call(this);
    const client = clients[name] || {};

    if (!client.type || clients[name].type === 'dist') {
      this.statics[name] = path.resolve(dirname, dir || 'dist');
    } else if (client.type === 'webpack') {
      const Service = require('@vue/cli-service');
      const ins = new Service(dirname);

      ins.init(process.env.NODE_ENV);

      const config = ins.resolveWebpackConfig();

      this.webpackConfigs[name] = {
        config,
        devMiddleware: {
          publicPath: config.output.publicPath,
          serverSideRender: true,
        },
        hotClient: {},
      };
    }
  },
  viewInject(name, view) {
    const { clients = {} } = this.config.statics || {};
    const client = clients[name] || {};

    return async (ctx, next) => {
      await next();

      const data = (typeof ctx.body === 'object' && ctx.body) || {};

      if (!client.type || client.type === 'dist') {
        const config = this.statics[name];
        await ctx.render(path.resolve(config, view), data);
      } else if (client.type === 'webpack') {
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
