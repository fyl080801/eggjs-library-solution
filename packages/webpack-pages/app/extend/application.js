'use strict';

const path = require('path');
const fs = require('fs');

const PAGES = Symbol('Application#pages');
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
    if (!this[PAGES]) {
      this[PAGES] = {};
    }
    return this[PAGES];
  },
  get staticConfigs() {
    if (!this[STATICS]) {
      this[STATICS] = {};
    }
    return this[STATICS];
  },
  addPageConfig(name, dir) {
    const dist = dir || 'dist';
    const dirname = getCallerFile.call(this);
    const staticPath = path.resolve(dirname, dist);
    const { enableWebpack } = this.config.pages || {};
    const distExists = fs.existsSync(staticPath);

    if (!distExists && enableWebpack) {
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
    } else if (distExists) {
      this.staticConfigs[name] = staticPath;
    }
  },
  addStaticConfig(name, dir) {
    const dist = dir || 'dist';
    const dirname = getCallerFile.call(this);
    const staticPath = path.resolve(dirname, dist);

    if (fs.existsSync(staticPath)) {
      this.staticConfigs[name] = staticPath;
    }
  },
  injectView(name, view) {
    const config = this.webpackConfigs[name] || this.staticConfigs[name];

    return async (ctx, next) => {
      await next();

      const data = (typeof ctx.body === 'object' && ctx.body) || {};

      // 注入视图输出
      if (typeof config !== 'string') {
        // dev
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
      } else {
        await ctx.render(path.resolve(config, view), data);
      }

      ctx.set('Content-Type', 'text/html');
    };
  },
};
