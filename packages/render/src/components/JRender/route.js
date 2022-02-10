export const RouteExtends = ({ addFunction }) => {
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
    !replace
      ? history.pushState({}, null, path)
      : history.replaceState({}, null, path)
  })

  addFunction('BACK', () => {
    history.back()
  })
}
