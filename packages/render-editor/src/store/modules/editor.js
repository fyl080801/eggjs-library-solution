import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const state = reactive({
    map: {
      aaaaa: { nodeId: 'aaaaa', component: 'div', index: 0 },
      bbbbb: { nodeId: 'bbbbb', component: 'div', index: 1 },
      ccc: {
        nodeId: 'ccc',
        parentId: 'aaaaa',
        component: 'p',
        index: 1,
        domProps: {
          innerText: 'aaaaaaa',
        },
      },
    },
    selects: [],
  })

  const layout = computed(() => {
    return Object.values(state.map)
      .filter((item) => !item.parentId)
      .sort((a, b) => (a.index || 0) - (b.index || 0))
  })

  const load = () => {}

  return {
    state,
    layout,
    load,
  }
})
