import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import App from './App.vue'
import './components'
import { createRouter } from './router'
import { createPinia, PiniaVuePlugin } from 'pinia'
import 'virtual:windi.css'

Vue.use(VueCompositionAPI)
Vue.use(PiniaVuePlugin)
Vue.use(JRender)

useGlobalRender(JRenderExtends)

new Vue({
  pinia: createPinia(),
  router: createRouter(),
  render: (h) => h(App),
}).$mount('#app')
