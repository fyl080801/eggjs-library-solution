<script>
import { defineComponent, set } from 'vue'
import { useEditorStore } from '../store'

export default defineComponent({
  setup() {
    const { state, layout } = useEditorStore()

    const onTreeSetup = ({
      setIsSelect,
      setIsLeaf,
      setIsSlots,
      setIsOpened,
      setChildrenGetter,
      setNodeGetter,
      setTextGetter,
    }) => {
      setIsSelect((nodeId) => {
        return state.selects.includes(nodeId)
      })

      setIsLeaf((nodeId) => {
        return !['div'].includes(state.map[nodeId]?.component)
      })

      setIsSlots((nodeId) => {
        return false
      })

      setIsOpened((nodeId) => {
        return !!state.map[nodeId]?.opened
      })

      setChildrenGetter((nodeId) => {
        return Object.values(state.map)
          .filter((item) => item.parentId === nodeId)
          .sort((a, b) => (a.index || 0) - (b.index || 0))
      })

      setNodeGetter((nodeId) => {
        return state.map[nodeId]
      })

      setTextGetter((nodeId) => {
        return state.map[nodeId]?.component || nodeId
      })
    }

    const onToggleExpand = (nodeId) => {
      if (state.map[nodeId].opened === undefined) {
        set(state.map[nodeId], 'opened', !state.map[nodeId].opened)
      } else {
        state.map[nodeId].opened = !state.map[nodeId].opened
      }
    }

    const onNodeClick = (nodeId) => {
      const index = state.selects.indexOf(nodeId)
      if (index >= 0) {
        state.selects.splice(index, 1)
      } else {
        state.selects.push(nodeId)
      }
    }

    return {
      layout,
      onTreeSetup,
      onToggleExpand,
      onNodeClick,
    }
  },
})
</script>

<template>
  <div
    class="absolute top-0 left-0 bottom-0 right-0 flex flex-col justify-between"
  >
    <div class="px-4">
      <div>container</div>
    </div>
    <div class="flex-1 flex items-stretch bg-gray-100">
      <scroller-box class="w-1/12 bg-red-100"> tools </scroller-box>
      <scroller-box class="w-1/8 bg-blue-100">
        <layout-tree
          :data="layout"
          @setup="onTreeSetup"
          @toggle-expand="onToggleExpand"
          @node-click="onNodeClick"
        ></layout-tree>
      </scroller-box>
      <scroller-box class="flex-1"> content </scroller-box>
      <scroller-box class="w-1/8 bg-blue-100"> props </scroller-box>
    </div>
  </div>
</template>
