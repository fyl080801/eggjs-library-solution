<script setup>
import { computed, reactive } from '@vue/composition-api'
import NodeElementPanel from './NodeElementPanel.vue'
import Dropzone from './Dropzone.vue'
import { useDocumentTree } from './mixins'

const props = defineProps({
  parentId: String,
  nodeId: String,
  index: Number,
  slotName: { type: String, default: 'default' },
})

const { state, config, click, remove, toggleExpand } = useDocumentTree()

const status = reactive({
  isDragging: false,
  dragover: false,
})

const node = computed(() => {
  return config.getNode || config.getNode(props.nodeId)
})

const parent = computed(() => {
  return config.getNode || config.getNode(props.parentId)
})

const nodeText = computed(() => {
  return (config.getText && config.getText(props.nodeId)) || props.nodeId
})

const children = computed(() => {
  return config.getChildren && config.getChildren(props.nodeId)
})

const isSelected = computed(() => {
  return config.isSelected && config.isSelected(props.nodeId)
})

const isLeaf = computed(() => {
  return config.isLeaf ? config.isLeaf(props.nodeId) : true
})

const isSlots = computed(() => {
  return (config.isSlots && config.isSlots(props.nodeId)) || false
})

const isOpened = computed(() => {
  return config.isOpened && config.isOpened(props.nodeId)
})

const onToggleExpand = () => {
  toggleExpand(props.nodeId)
}

const onNodeClick = () => {
  click(props.nodeId)
}

const onDeleteNode = () => {
  remove(props.nodeId)
}

// 拖动
const onDragStart = (event) => {
  const cloned = event.target.cloneNode(true)
  cloned.style.display = 'none'
  event.dataTransfer.setDragImage(cloned, 0, 0)

  status.isDragging = true
}

const oDragEnd = () => {
  status.isDragging = false
}

const onDragOver = (event) => {
  if (!isLeaf.value) {
    event.preventDefault()
    status.dragover = true
  }
}

const onDragleave = () => {
  status.dragover = false
}

const onDrop = () => {
  status.dragover = false
}
</script>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'NodeElement',
})
</script>

<template>
  <div
    draggable="true"
    class="relative inline-grid b-layer r-1"
    :class="{ 'bg-gray-400': status.isDragging }"
    @dragstart.self="onDragStart"
    @dragend="oDragEnd"
  >
    <div
      class="inline-flex items-stretch justify-items-stretch overflow-hidden items-center border border-transparent hover:bg-gray-100"
      :class="[
        { '!border-gray-500': status.dragover },
        // { 'bg-primary-r selected': isSelected && !zone.state.dragging },
      ]"
      @dragover="onDragOver"
      @dragleave="onDragleave"
      @drop="onDrop"
      @click="onNodeClick"
    >
      <!-- 展开图标 -->
      <div class="inline-grid place-content-stretch">
        <template v-if="!isLeaf">
          <div class="p-2 cursor-pointer" @click.stop="onToggleExpand">
            <box class="justify-center items-center w-4 h-4">
              {{ isOpened ? '-' : '+' }}
            </box>
          </div>
        </template>
        <template v-else>
          <div class="p-2 cursor-pointer">
            <box class="justify-center items-center w-4 h-4"> ❖ </box>
          </div>
        </template>
      </div>

      <!-- label -->
      <span class="inline-grid flex-auto py-2">
        <div class="overflow-ellipsis w-full">{{ nodeText }}</div>
      </span>

      <!-- 删除按钮 -->
      <div
        class="p-2 cursor-pointer"
        @click.stop="onDeleteNode"
        v-show="isSelected && !state.dragging"
      >
        <box class="justify-center items-center w-4 h-4"> × </box>
      </div>
    </div>
    <!-- 拖放区域 -->
    <div v-if="state.dragging" class="absolute h-4 z-1 w-full bottom-0">
      <Dropzone
        :nodeId="parent.nodeId"
        :index="index + 1"
        :slotName="slotName"
      />
    </div>
    <!-- 子元素 -->
    <div v-if="isOpened" class="inline-grid place-content-stretch">
      <template v-if="!isSlots">
        <div
          class="inline-flex items-stretch justify-items-stretch flex-col pl-4"
        >
          <component
            :is="NodeElementPanel"
            :nodeId="node.nodeId"
            :nodes="children"
          />
        </div>
      </template>
      <!-- <template v-else>
          <div class="prop-list stack y indent"> pl-4
            <LayerPanelNodeSlot
              v-for="slot in elementSlots"
              :key="slot"
              :element="element"
              :slotName="slot"
            />
          </div>
        </template> -->
    </div>
  </div>
</template>
