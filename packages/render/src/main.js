import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import { LibExtends, RouteExtends } from './components'
import { external } from './utils/app'
import App from './App'
import 'systemjs'

window.Vue = Vue
window.VueCompositionAPI = VueCompositionAPI
window.JRender = {
  useGlobalRender,
}

const config = external ? JSON.parse(external) : []

const styles = []

const existingImport = System.constructor.prototype.import

System.constructor.prototype.import = function (args) {
  return Promise.resolve(existingImport.call(this, args)).then((result) => {
    if (result.default && result.default.type === 'text/css') {
      styles.push(result.default)
    }
  })
}

Promise.all(config.map((item) => System.import(item))).then(() => {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles]

  Vue.use(VueCompositionAPI)
  Vue.use(JRender)

  useGlobalRender(JRenderExtends)
  useGlobalRender(LibExtends)
  useGlobalRender(RouteExtends)

  new Vue({
    render: (h) => h(App),
  }).$mount('#app')
})
