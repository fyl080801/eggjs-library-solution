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
      const mk = `render-manifest/${item}`

      app.addPageConfig(mk, path.resolve(manifestRoot, item))

      const info = require(path.resolve(manifestRoot, item, 'manifest.json'))

      app.manifest[mk] = info
    })
}
