<script setup>
import { computed, ref } from 'vue'
import { useDocumentTree } from './mixins'

const props = defineProps({
  nodeId: String,
  index: { type: Number, default: 0 },
  slotName: { type: String, default: 'default' },
})

const { to } = useDocumentTree()

const dragoverHighlight = ref(false)

const dropzoneClass = computed(() => {
  return { 'dragover-highlight': dragoverHighlight.value }
})

const onDragover = (event) => {
  event.preventDefault()
  dragoverHighlight.value = true
}

const onDragleave = () => {
  dragoverHighlight.value = false
}

const onDrop = (event) => {
  event.preventDefault()
  dragoverHighlight.value = false

  to({
    parentId: props.nodeId,
    index: props.index,
    slot: props.slotName,
  })
}
</script>

<template>
  <div
    class="w-full h-full"
    :class="dropzoneClass"
    @dragover="onDragover"
    @dragleave="onDragleave"
    @drop="onDrop"
  >
    <slot />
  </div>
</template>

<style scoped>
.dragover-highlight::after {
  opacity: 1;
}
</style>
