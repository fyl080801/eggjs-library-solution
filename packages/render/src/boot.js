import 'systemjs'
import { external } from './utils/app'
import Vue from 'vue'
import * as VueCompositionAPI from '@vue/composition-api'
import * as JRender from '@jrender-legacy/core'

const config = external ? JSON.parse(external) : []

window.Vue = Vue
window.VueCompositionAPI = VueCompositionAPI
window.JRender = JRender

export const boot = async () => {
  await Promise.all(config.map((item) => System.import(item)))
}
