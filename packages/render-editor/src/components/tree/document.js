import { inject, provide, reactive } from '@vue/runtime-core'

const documentToken = Symbol('documentToken')

export const useDocumentRoot = (params) => {
  provide(documentToken, { state: reactive(params) })
}

export const useDocumentTree = () => {
  return inject(documentToken)
}
