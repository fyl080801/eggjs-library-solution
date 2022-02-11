import { reactive } from '@vue/composition-api'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const state = reactive({})

  const load = () => {}

  return {
    state,
    load,
  }
})
