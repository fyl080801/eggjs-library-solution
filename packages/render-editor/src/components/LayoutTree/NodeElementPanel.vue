<script setup>
// import { useDesigner } from '../../views/Designer/mixins'
import { useDocumentTree } from './mixins'
import NodeElement from './NodeElement.vue'
import Dropzone from './Dropzone.vue'

const props = defineProps({
  nodeId: String,
  slotName: { type: String, default: 'default' },
  nodes: { type: Array, default: () => [] },
})

const { state } = useDocumentTree()
</script>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NodeElementPanel',
})
</script>

<template>
  <box>
    <!--  新成员拖入这个 dropzone 后：放到此节点所在列表的第一个位置 -->
    <div v-if="state.dragging" class="absolute h-4 z-1 h-4">
      <Dropzone class="c-3" :nodeId="nodeId" :slotName="slotName" />
    </div>
    <!--  节点内容 -->
    <box>
      <NodeElement
        v-for="(item, index) in nodes"
        :key="item.nodeId || index"
        :nodeId="item.nodeId"
        :parentId="nodeId"
        :index="index"
        :slotName="slotName"
      />
    </box>
  </box>
</template>
