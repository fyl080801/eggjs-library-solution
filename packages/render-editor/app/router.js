'use strict'

const pump = require('mz-modules/pump')

const path = require('path')

const fs = require('fs')

const compressing = require('compressing')

module.exports = (app, name) => {
  const { prefix } = app.config.renderEditor || {}

  const normalizePrefix = app.normalizeUrl(
    typeof prefix === 'string' ? prefix : '/render-editor',
  )

  app.router.all(app.normalizeUrl(normalizePrefix, '/api/v1/routes'), (ctx) => {
    ctx.body = {}
  })

  // 上传文件
  app.router.post(app.normalizeUrl(normalizePrefix, '/upload'), async (ctx) => {
    const file = ctx.request.files[0]

    if (!file) {
      return ctx.throw(404)
    }

    if (!fs.existsSync(path.join(process.cwd(), 'app/public'))) {
      fs.promises.mkdir(path.join(process.cwd(), 'app/public'))
    }

    const extname = path.extname(file.filename).toLowerCase()
    const filename = 'package' + extname
    const targetPath = path.join(process.cwd(), 'app/public', filename)
    const source = fs.createReadStream(file.filepath)
    const target = fs.createWriteStream(targetPath)

    try {
      await pump(source, target)
      ctx.logger.info('save %s to %s', file.filepath, targetPath)

      await fs.promises.rm(ctx.service.render.getRenderRoot(), {
        force: true,
        recursive: true,
      })

      await compressing[extname.replace('.', '')].uncompress(
        targetPath,
        ctx.service.render.getRenderRoot(),
      )

      ctx.service.script.build()
    } finally {
      // delete those request tmp files
      await ctx.cleanupRequestFiles()
    }

    ctx.status = 200
  })

  // 页面
  app.router.get(
    `${normalizePrefix}*`,
    app.viewInject(name, 'index.html'),
    (ctx) => {
      ctx.body = {
        prefix: normalizePrefix,
      }
    },
  )
}
