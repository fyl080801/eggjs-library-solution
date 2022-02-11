import { inject, provide } from '@vue/composition-api'

const documentTreeToken = Symbol('documentTreeToken')

const noop = () => {}

export const useDocumentTree = (root) => {
  if (!root) {
    return inject(documentTreeToken)
  }

  // config
  const config = {}

  root.emit('setup', {
    setIsSelect: (handler) => {
      config.isSelect = handler || noop
    },
    setIsLeaf: (handler) => {
      config.isLeaf = handler || noop
    },
    setIsSlots: (handler) => {
      config.isSlots = handler || noop
    },
    setIsOpened: (handler) => {
      config.isOpened = handler || noop
    },
    setChildrenGetter: (getter) => {
      config.getChildren = getter || noop
    },
    setNodeGetter: (getter) => {
      config.getNode = getter || noop
    },
    setTextGetter: (getter) => {
      config.getText = getter || noop
    },
  })

  // action
  const to = (payload) => {
    root.emit('drop-to', payload)
  }

  const click = (nodeId) => {
    root.emit('node-click', nodeId)
  }

  const toggleExpand = (nodeId) => {
    root.emit('toggle-expand', nodeId)
  }

  const remove = (nodeId) => {
    root.emit('node-remove', nodeId)
  }

  provide(documentTreeToken, { state: root.state, config, to, click, remove, toggleExpand })
}
