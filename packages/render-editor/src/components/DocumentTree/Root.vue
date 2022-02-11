<script setup>
import { reactive, watch } from '@vue/composition-api'
import NodeElementPanel from './NodeElementPanel.vue'
import Dragzone from './Dropzone.vue'
import { useDocumentTree } from './mixins'

const props = defineProps({
  data: { type: Array, default: () => [] },
  selected: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'drop-to',
  'setup',
  'node-click',
  'toggle-expand',
  'node-remove',
])

const state = reactive({
  dragging: false,
  selected: props.selected,
})

watch(
  () => props.selected,
  (value) => {
    state.selected = value
  },
)

useDocumentTree({ state, emit })
</script>

<template>
  <box v-if="data.length" class="w-full">
    <NodeElementPanel :nodes="data" />
  </box>
  <div class="w-full h-full" v-else>
    <Dragzone>
      <div class="w-full h-full flex flex-col justify-center items-center">
        <div>这是图层面板</div>
        <div>从工具栏拖入新元素。</div>
      </div>
    </Dragzone>
  </div>
</template>
