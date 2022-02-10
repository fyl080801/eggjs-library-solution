import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import { LibExtends, RouteExtends } from './components'
import { system } from './utils/app'
import App from './App'
import 'systemjs'

window.Vue = Vue
window.VueCompositionAPI = VueCompositionAPI
window.JRender = {
  useGlobalRender,
}

const config = system ? JSON.parse(system) : []

Promise.all(config.map((item) => window.System.import(item))).then(() => {
  Vue.use(VueCompositionAPI)
  Vue.use(JRender)

  useGlobalRender(JRenderExtends)
  useGlobalRender(LibExtends)
  useGlobalRender(RouteExtends)

  new Vue({
    render: (h) => h(App),
  }).$mount('#app')
})
