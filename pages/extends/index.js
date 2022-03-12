import { useGlobalRender } from '@jrender-legacy/core'

useGlobalRender(({ onBeforeBind }) => {
  onBeforeBind(() => (field, next) => {
    console.log('render field')
    next(field)
  })
})
