import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import { LibExtends, RouteExtends } from './components'
import App from './App'
import { boot } from './boot'

boot().then(() => {
  Vue.use(VueCompositionAPI)
  Vue.use(JRender)

  useGlobalRender(JRenderExtends)
  useGlobalRender(LibExtends)
  useGlobalRender(RouteExtends)

  new Vue({
    render: (h) => h(App),
  }).$mount('#app')
})
