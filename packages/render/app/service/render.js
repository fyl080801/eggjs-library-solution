'use strict';

const { Service } = require('egg');
const fs = require('fs');
const { resolve, join } = require('path');
const pathToRegex = require('path-to-regex');
const jsyaml = require('js-yaml');

const extRegx = /\.yaml$/g;

const paramRegx = /^\[[a-zA-Z]+\]$/g;

const paramContentRegx = /[a-zA-Z]+/g;

const tryToParam = (input) => {
  return paramRegx.test(input) ? `:${paramContentRegx.exec(input)[0]}` : input;
};

const getAll = async (dir) => {
  const paths = [];

  const readMember = async (path, callback) => {
    const fullpath = resolve(dir, path);

    const stat = await fs.promises.stat(fullpath);

    if (stat.isDirectory()) {
      const members = await fs.promises.readdir(fullpath);

      await Promise.all(
        members.map((m) => readMember(join(path, m), callback)),
      );
    } else if (stat.isFile() && extRegx.test(path)) {
      callback(path.replace(extRegx, ''));
    }
  };

  const roots = await fs.promises.readdir(dir);

  await Promise.all(
    roots.map((r) =>
      readMember(join(r), (key) => {
        paths.push(key);
      }),
    ),
  );

  return paths;
};

class RenderService extends Service {
  async getRenderPage(path) {
    let { configDir } = this.app.config.render || {};

    configDir = configDir || resolve(process.cwd(), 'renders');

    if (!this.app.renderConfig) {
      this.app.renderConfig = {};

      const configFile = resolve(configDir, '.render');

      const haveConfig = fs.existsSync(configFile);

      if (haveConfig) {
        try {
          const config = jsyaml.load(await fs.promises.readFile(configFile));
          this.app.renderConfig = Object.assign(this.app.renderConfig, config);
        } catch {}
      }
    }

    if (!this.app.renders) {
      const all = await getAll(configDir);

      this.app.renders = all.map((item) => {
        return {
          key: item,
          parser: new pathToRegex(
            item
              .split('/')
              .map((item) => tryToParam(item))
              .join('/'),
          ),
          reader: async () => {
            return await fs.promises.readFile(
              resolve(configDir, `${item}.yaml`),
              'utf-8',
            );
          },
        };
      });
    }

    const matched = this.app.renders.find((item) => item.parser.match(path));

    try {
      if (matched) {
        const pageConfig = jsyaml.load(await matched.reader());

        const matchConfig = matched.parser.match(path);

        pageConfig.dataSource = pageConfig.dataSource || {};

        pageConfig.dataSource.params = {
          props: matchConfig,
        };

        return pageConfig;
      } else if (this.app.renderConfig.default) {
        const defaultFilePath = join(
          configDir,
          `${this.app.renderConfig.default.replace(extRegx, '')}.yaml`,
        );

        const defaultFile = await fs.promises.readFile(
          defaultFilePath,
          'utf-8',
        );

        return jsyaml.load(defaultFile);
      }
    } catch (e) {
      console.log(e);
      return {};
    }

    return {};
  }
}

module.exports = RenderService;
