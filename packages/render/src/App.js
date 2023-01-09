import {
  defineComponent,
  h,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { request } from './utils/request'
import { prefix } from './utils/app'

export default defineComponent({
  setup() {
    const config = ref({})

    const updating = ref(false)

    const load = (path) => {
      request({
        url: '/api/v1/render',
        params: { path: path.replace(prefix, '') },
      }).then((response) => {
        config.value = response.data
      })
    }

    const update = () => {
      load(window.location.pathname)
    }

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

      window.addEventListener('statechanged', update, false)
      window.addEventListener('popstate', update, false)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('statechanged', update)
      window.removeEventListener('popstate', update)
    })

    return () => !updating.value && h('j-render', { props: config.value })
  },
})
