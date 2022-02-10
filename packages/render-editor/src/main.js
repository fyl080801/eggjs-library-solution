import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import App from './App.vue'
import { Box, ScrollerBox } from './components'
import { createRouter } from './router'
import 'virtual:windi.css'

Vue.use(VueCompositionAPI)
Vue.use(JRender)
Vue.component('box', Box)
Vue.component('scroller-box', ScrollerBox)

useGlobalRender(JRenderExtends)

new Vue({
  router: createRouter(),
  render: (h) => h(App),
}).$mount('#app')
