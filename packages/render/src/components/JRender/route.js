import { prefix } from '../../utils/app'
import { defineRenderSetup } from '@jrender-legacy/core'

export const RouteExtends = defineRenderSetup(({ addFunction }) => {
  const buildStateEvent = (type) => {
    const historyEvent = history[type]

    return function () {
      const handler = historyEvent.apply(this, arguments)
      window.dispatchEvent(new Event('statechanged'))
      return handler
    }
  }

  history.pushState = buildStateEvent('pushState')

  history.replaceState = buildStateEvent('replaceState')

  addFunction('TO', (path, replace) => {
    const normalPath =
      '/' +
      `${prefix}${path}`
        .split('/')
        .filter((item) => item)
        .join('/')

    !replace
      ? history.pushState({}, null, normalPath)
      : history.replaceState({}, null, normalPath)
  })

  addFunction('BACK', () => {
    history.back()
  })
})
