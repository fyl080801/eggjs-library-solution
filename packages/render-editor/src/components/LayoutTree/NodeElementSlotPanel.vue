<script setup>
import { computed, reactive } from '@vue/composition-api'
import { useDocumentTree } from './mixins'
import NodeElementPanel from './NodeElementPanel.vue'

const props = defineProps({
  nodeId: String,
  slotName: { type: String, default: 'default' },
})

const { config } = useDocumentTree()

const node = reactive({
  dragover: false,
})

const children = computed(() => {
  return config.getChildren(props.nodeId, props.slotName)
  //   return Object.values(designerStore.state.fields || {})
  //     .filter((item) => item.parentId === props.element.nodeId && item.slot === props.slotName)
  //     .sort((a, b) => {
  //       return (a.index || 0) - (b.index || 0)
  //     })
})

const onSlotDragover = (event) => {
  event.preventDefault()
  node.dragover = true
}

const onSlotDrop = () => {}
</script>

<template>
  <div class="inline-flex items-stretch justify-items-stretch flex-col">
    <div
      class="px-2 py-1"
      @dragover="onSlotDragover"
      @dragleave="node.dragover = false"
      @drop="onSlotDrop"
      :class="{ dragover: node.dragover }"
    >
      {{ slotName }}
    </div>
    <div class="inline-flex items-stretch justify-items-stretch flex-col">
      <NodeElementPanel
        :nodeId="nodeId"
        :nodes="children"
        :slotName="slotName"
      />
    </div>
  </div>
</template>
<!-- 
<style scoped>
*:not(.z-1) {
  z-index: unset;
}
.z-1 {
  z-index: 1;
}

.node.is-dragging {
  background: var(--color-basic-bg-2);
  /* overflow: hidden; */
}
.node.is-dragging > * {
  opacity: 0.25;
  pointer-events: none;
}

.dragover {
  box-shadow: inset 0 0 0 2px var(--color-basic-content-2);

  /* box-shadow: inset 0 0 0 2px var(--color-primary-reverse-bg); */
  /* background: var(--color-primary-bg); */
}

.has-error {
  color: red;
}
</style> -->
