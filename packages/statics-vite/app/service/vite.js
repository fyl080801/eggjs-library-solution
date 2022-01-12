'use strict';

const { Service } = require('egg');
const { createServer, loadConfigFromFile } = require('vite');

const serviceToken = Symbol('serviceToken');

class ViteService extends Service {
  get _service() {
    if (!this[serviceToken]) {
      this[serviceToken] = {};
    }

    return this[serviceToken];
  }
  async getServer(currentCtx) {
    const { matcher } = this.app.config.statics || {};

    const staticsMatcher =
      matcher && typeof matcher === 'function'
        ? matcher
        : (ctx) => {
            let key = Object.keys(this.app.statics || {}).find((p) => {
              return ctx.request.url.indexOf(`/${p}/`) === 0;
            });

            if (!key) {
              key = Object.keys(this.app.viteConfigs || {}).find((p) => {
                return ctx.request.url.indexOf(`/${p}/`) === 0;
              });
            }

            return key || this.app.config.statics.default;
          };

    await Promise.all(
      Object.keys(this.app.viteConfigs).map(async (key) => {
        if (!this._service[key]) {
          const config = this.app.viteConfigs[key];

          if (!config) {
            return;
          }

          const viteConfig = await loadConfigFromFile({}, config.configFile);

          if (!viteConfig) {
            return;
          }

          this._service[key] = await createServer({
            ...viteConfig,
            root: config.rootPath,
            base: `/${config.name}/`,
            server: { middlewareMode: true },
          });
        }
      }),
    );

    return this._service[staticsMatcher(currentCtx)];
  }
}

module.exports = ViteService;
