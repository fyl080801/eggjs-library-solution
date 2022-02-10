import { reactive, nextTick } from '@vue/composition-api'
import { request } from '../../utils/request'

export const LibExtends = ({ addDataSource, onBeforeBind }) => {
  addDataSource('axios', (getOptions) => {
    const { autoLoad } = getOptions() || {}

    const instance = reactive({
      request: async () => {
        const options = getOptions()

        try {
          instance.loading = true

          const response = await request(options.config)

          instance.data = options.defaultData || []

          nextTick(() => {
            instance.data = response.data
            instance.loading = false
          })
        } catch {
          instance.data = options.defaultData || []
          instance.loading = false
        }
      },
      clear: () => {
        instance.data = getOptions()?.defaultData || []
      },
      loading: false,
      data: getOptions()?.defaultData || [],
    })

    if (autoLoad) {
      nextTick(() => {
        instance.request()
      })
    }

    return instance
  })

  onBeforeBind(() => (field, next) => {
    if (field.component !== 'template') {
      return next(field)
    } else if (!field.path) {
      return
    }

    request
      .get(`/api/v1/render`, { params: { path: field.path } })
      .then((response) => {
        next({
          ...field,
          component: 'j-render',
          props: response.data,
          children: field.children,
        })
      })
  })
}
