'use strict'

module.exports = (app) => {
  app.router.get(`/`, (ctx) => {
    ctx.redirect('/render/')
  })
}
