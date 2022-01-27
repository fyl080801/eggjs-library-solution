'use strict';

const path = require('path');
const { createServer, loadConfigFromFile, mergeConfig } = require('vite');
const fs = require('fs');
const net = require('net');
const os = require('os');

const serviceToken = Symbol('serviceToken');

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

const createPortDiscover = () => {
  const checkAvailablePort = (port) => {
    return new Promise((resolve, reject) => {
      const server = net.createServer();

      server.unref();

      server.on('error', reject);

      server.listen({ port, hosts }, () => {
        const { port } = server.address();

        server.close(() => {
          resolve(port);
        });
      });
    });
  };

  const getLocalHosts = () => {
    const interfaces = os.networkInterfaces();

    const results = new Set([undefined, '0.0.0.0']);

    for (const inter of Object.values(interfaces)) {
      for (const config of inter) {
        results.add(config.address);
      }
    }

    return results;
  };

  const getPort = async (from, callback) => {
    const result = await checkAvailablePort(from)
      .then((e) => e)
      .catch((e) => e);

    if (result instanceof Error) {
      await getPort(from + 1, callback);
    } else {
      callback(from);
    }
  };

  const hosts = getLocalHosts();

  return async (start) => {
    return new Promise((resolve) => {
      getPort(start, (result) => {
        resolve(result);
      });
    });
  };
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

  get _service() {
    if (!this[serviceToken]) {
      this[serviceToken] = {};
    }

    return this[serviceToken];
  },

  addPageConfig(name, dir) {
    const { clients = {} } = this.config.statics || {};
    const dirname = dir || getCallerFile.call(this);
    const client = clients[name] || {};

    if (!client.type || client.type === 'dist') {
      this.statics[name] = path.resolve(dirname, client.dist || 'dist');
    } else if (client.type === 'dev') {
      this.viteConfigs[name] = {
        name,
        rootPath: dirname,
        configFile: path.resolve(
          dirname,
          client.configFile || 'vite.config.js',
        ),
      };
    }
  },

  async getServer(currentCtx) {
    const { matcher } = this.config.statics || {};

    const staticsMatcher =
      matcher && typeof matcher === 'function'
        ? matcher
        : (ctx) => {
            let key = Object.keys(this.statics || {}).find((p) => {
              return ctx.request.url.indexOf(`/${p}/`) === 0;
            });

            if (!key) {
              key = Object.keys(this.viteConfigs || {}).find((p) => {
                return ctx.request.url.indexOf(`/${p}/`) === 0;
              });
            }

            return key || this.config.statics.default;
          };

    const getWsPort = createPortDiscover();

    let wsPort = 24678;

    await Promise.all(
      Object.keys(this.viteConfigs).map(async (key, index) => {
        if (!this._service[key]) {
          const config = this.viteConfigs[key];

          if (!config) {
            return;
          }

          const viteConfig = await loadConfigFromFile({}, config.configFile);

          if (!viteConfig) {
            return;
          }

          wsPort = await getWsPort(wsPort + 1);

          this._service[key] = await createServer(
            mergeConfig(viteConfig, {
              mode: 'development',
              root: config.rootPath,
              base: `/${config.name}/`,
              server: {
                middlewareMode: true,
                cors: false,
                hmr: {
                  port: wsPort,
                  clientPort: wsPort,
                },
              },
            }),
          );
        }
      }),
    );

    return this._service[
      typeof currentCtx === 'string' ? currentCtx : staticsMatcher(currentCtx)
    ];
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
        const config = this.viteConfigs[name];

        const server = await this.getServer(name);

        if (!server) {
          return await next();
        }

        const content = await server.transformIndexHtml(
          ctx.request.url,
          await fs.promises.readFile(path.join(config.rootPath, view), 'utf-8'),
        );

        ctx.body = await ctx.renderString(content, data);
      }

      ctx.set('Content-Type', 'text/html');
    };
  },
};
