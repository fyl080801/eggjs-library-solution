'use strict'

const renderToken = Symbol('Application#render')
const renderConfigToken = Symbol('Application#renderConfig')
const manifestToken = Symbol('Application#manifest')

module.exports = {
  get renders() {
    return this[renderToken]
  },
  set renders(value) {
    this[renderToken] = value
  },

  get renderConfig() {
    return this[renderConfigToken]
  },
  set renderConfig(value) {
    this[renderConfigToken] = value
  },

  get manifest() {
    if (!this[manifestToken]) {
      this[manifestToken] = {}
    }
    return this[manifestToken]
  },
}
