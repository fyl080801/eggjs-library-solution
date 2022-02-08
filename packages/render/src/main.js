import Vue from 'vue'
import VueCompositionAPI, {
  h,
  nextTick,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api'
import JRender, { useGlobalRender } from '@jrender-legacy/core'
import JRenderExtends from '@jrender-legacy/extends'
import { LibExtends } from './components'
import { request } from './utils/request'

Vue.use(VueCompositionAPI)
Vue.use(JRender)

useGlobalRender(JRenderExtends)
useGlobalRender(LibExtends)

new Vue({
  setup() {
    const config = ref({})

    const updating = ref(false)

    const load = (path) => {
      request({ url: '/api/v1/render', params: { path } }).then((response) => {
        config.value = response.data
      })
    }

    const buildStateEvent = (type) => {
      const historyEvent = history[type]

      return function () {
        const handler = historyEvent.apply(this, arguments)
        window.dispatchEvent(new Event('statechanged'))
        return handler
      }
    }

    const update = () => {
      load(window.location.pathname)
    }

    history.pushState = buildStateEvent('pushState')

    history.replaceState = buildStateEvent('replaceState')

    window.addEventListener('statechanged', update, false)

    window.addEventListener('popstate', update, false)

    watch(
      () => config.value,
      () => {
        updating.value = true

        nextTick(() => {
          updating.value = false
        })
      },
    )

    onMounted(() => {
      load(window.location.pathname)
    })

    return () =>
      !updating.value &&
      h(JRender, {
        props: config.value,
        on: {
          setup: ({ addFunction }) => {
            addFunction('TO', (path, replace) => {
              !replace
                ? history.pushState({}, null, path)
                : history.replaceState({}, null, path)
            })

            addFunction('BACK', () => {
              history.back()
            })
          },
        },
      })
  },
}).$mount('#app')
