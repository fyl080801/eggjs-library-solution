'use strict'

const VUECLI = Symbol('Application#VUECLI')

module.exports = {
  get vuecliConfigs() {
    if (!this[VUECLI]) {
      this[VUECLI] = {}
    }
    return this[VUECLI]
  },
}
