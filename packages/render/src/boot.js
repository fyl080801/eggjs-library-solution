import 'systemjs'
import { external } from './utils/app'
import Vue from 'vue'
import * as VueCompositionAPI from '@vue/composition-api'
import * as JRender from '@jrender-legacy/core'

const config = external ? JSON.parse(external) : []

const styles = []

const existingImport = System.constructor.prototype.import

window.Vue = Vue
window.VueCompositionAPI = VueCompositionAPI
window.JRender = JRender

System.constructor.prototype.import = async function (args) {
  const result = await Promise.resolve(existingImport.call(this, args))

  if (result.default && result.default.type === 'text/css') {
    styles.push(result.default)
  }
}

export const boot = async () => {
  await Promise.all(config.map((item) => System.import(item))).then(() => {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles]
  })
}
