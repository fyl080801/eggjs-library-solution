'use strict'

const WEBPACK = Symbol('Application#WEBPACK')

module.exports = {
  get webpackConfigs() {
    if (!this[WEBPACK]) {
      this[WEBPACK] = {}
    }
    return this[WEBPACK]
  },
}
