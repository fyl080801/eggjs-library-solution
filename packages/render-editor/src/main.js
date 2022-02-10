import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import App from './App.vue'

Vue.use(VueCompositionAPI)
Vue.use(JRender)

useGlobalRender(JRenderExtends)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
