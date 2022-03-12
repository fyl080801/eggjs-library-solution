'use strict'

const fs = require('fs')
const path = require('path')

module.exports = (app) => {
  const manifestRoot =
    app.config.render.manifest || path.resolve(process.cwd(), 'manifest')

  if (!fs.existsSync(manifestRoot)) {
    return
  }

  const manifests = fs.readdirSync(manifestRoot)

  manifests
    .filter((item) =>
      fs.statSync(path.resolve(manifestRoot, item)).isDirectory(),
    )
    .forEach((item) => {
      try {
        const manifestFile = path.resolve(manifestRoot, item, 'manifest.json')

        if (!fs.existsSync(manifestFile)) {
          return
        }

        const mk = `render-manifest/${item}`

        app.addPageConfig(mk, path.resolve(manifestRoot, item))

        app.manifest[mk] = require(manifestFile)
      } catch {
        return
      }
    })
}
