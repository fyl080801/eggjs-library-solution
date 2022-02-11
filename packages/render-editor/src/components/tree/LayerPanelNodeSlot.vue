<script setup>
import { computed, defineProps, reactive } from '@vue/runtime-core'
import LayerPanelNode from './LayerPanelNode.vue'

const props = defineProps({ element: Object, slotName: { type: String, default: 'default' } })

const node = reactive({
  isDragging: false,
  dragover: false,
})

const children = computed(() => {
  return (
    props.element?.children?.filter((child) => (child.slot || 'default') === props.slotName) || []
  )
})

const onSlotDragover = (event) => {
  event.preventDefault()
  node.dragover = true
}

const onSlotDrop = () => {}
</script>

<template>
  <div
    class="prop-self c-3 padding-x-8 padding-y-4 bold r-1"
    @dragover="onSlotDragover"
    @dragleave="node.dragover = false"
    @drop="onSlotDrop"
    :class="{ dragover: node.dragover }"
  >
    {{ slotName }}
  </div>
  <div class="node-list stack y">
    <LayerPanelNode :current="element" :nodes="children" :slotName="slotName" />
  </div>
</template>

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
</style>
