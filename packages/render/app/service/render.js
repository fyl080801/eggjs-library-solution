'use strict'

const { Service } = require('egg')
const fs = require('fs')
const { resolve, join } = require('path')
const pathToRegex = require('path-to-regex')
const jsyaml = require('js-yaml')

const extRegx = /\.yaml$/g

const paramRegx = /^\[[a-zA-Z]+\]$/g

const paramContentRegx = /[a-zA-Z]+/g

const tryToParam = (input) => {
  return new RegExp(paramRegx).test(input)
    ? `:${input.match(paramContentRegx)}`
    : input
}

const getAll = async (dir) => {
  const paths = []

  const readMember = async (path, callback) => {
    const fullpath = resolve(dir, path)

    const stat = await fs.promises.stat(fullpath)

    if (stat.isDirectory()) {
      const members = await fs.promises.readdir(fullpath)

      await Promise.all(members.map((m) => readMember(join(path, m), callback)))
    } else if (stat.isFile() && extRegx.test(path)) {
      callback(path.replace(extRegx, ''))
    }
  }

  const roots = await fs.promises.readdir(dir)

  await Promise.all(
    roots.map((r) =>
      readMember(join(r), (key) => {
        paths.push(key)
      }),
    ),
  )

  return paths
}

class RenderService extends Service {
  async getRenderPage(path) {
    let { configRoot } = this.app.config.render || {}

    configRoot = configRoot || resolve(process.cwd(), 'renders')

    if (!this.app.renderConfig) {
      this.app.renderConfig = {}

      const configFile = resolve(configRoot, 'app.json')

      const haveConfig = fs.existsSync(configFile)

      if (haveConfig) {
        try {
          const config = JSON.parse(await fs.promises.readFile(configFile))
          this.app.renderConfig = Object.assign(this.app.renderConfig, config)
        } catch {}
      }
    }

    if (!this.app.renders) {
      const all = await getAll(configRoot)

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
              resolve(configRoot, `${item}.yaml`),
              'utf-8',
            )
          },
        }
      })
    }

    const matched = this.app.renders.find((item) => item.parser.match(path))

    try {
      if (matched) {
        const pageConfig = jsyaml.load(await matched.reader())

        const matchConfig = matched.parser.match(path)

        pageConfig.dataSource = pageConfig.dataSource || {}

        pageConfig.dataSource.params = {
          props: matchConfig,
        }

        return pageConfig
      } else if (this.app.renderConfig.default) {
        const defaultFilePath = join(
          configRoot,
          `${this.app.renderConfig.default.replace(extRegx, '')}.yaml`,
        )

        const defaultFile = await fs.promises.readFile(defaultFilePath, 'utf-8')

        return jsyaml.load(defaultFile)
      }
    } catch (e) {
      console.log(e)
      return {}
    }

    return {}
  }
}

module.exports = RenderService
