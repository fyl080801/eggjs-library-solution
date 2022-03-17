'use strict'

module.exports = {
  getMiddleware(compiler, devMiddleware) {
    return (context, next) => {
      const ready = new Promise((resolve, reject) => {
        for (const comp of [].concat(compiler.compilers || compiler)) {
          comp.hooks.failed.tap('egglib/webpack', (error) => {
            reject(error)
          })
        }

        devMiddleware.waitUntilValid(() => {
          resolve(true)
        })
      })

      const init = new Promise((resolve) => {
        devMiddleware(
          context.req,
          {
            end: (content) => {
              context.body = content
              resolve()
            },
            getHeader: context.get.bind(context),
            setHeader: context.set.bind(context),
            locals: context.state,
          },
          () => resolve(next()),
        )
      })

      return Promise.all([ready, init])
    }
  },
}
