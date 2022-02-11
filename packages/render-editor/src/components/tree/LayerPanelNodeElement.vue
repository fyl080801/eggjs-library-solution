<script setup>
import { useComponentStore, useCustomStore, useDesignerStore } from '@/store'
import { depthFilter } from '@/functions/tree'
import { computed, reactive, ref } from '@vue/reactivity'
import { defineProps, watch } from '@vue/runtime-core'
import { useDocumentTree } from './document'
import Dropzone from './LayerPanelDropzone.vue'
import LayerPanelNode from './LayerPanelNode.vue'
import LayerPanelNodeSlot from './LayerPanelNodeSlot.vue'

const props = defineProps({
  parent: Object,
  element: Object,
  index: Number,
  slotName: { type: String, default: 'default' },
})
const componentStore = useComponentStore()
const customStore = useCustomStore()
const designerStore = useDesignerStore()
const context = useDocumentTree()

const node = reactive({
  isDragging: false,
  dragover: false,
})

const children = ref([])

const isSelected = computed(() => {
  return designerStore.state.actived === props.element?.nodeId
})

const opened = computed(() => {
  return props.element?.opened
})

const isLeaf = computed(() => {
  const item = componentStore.state.components.get(props.element?.component)

  if (item?.type === 'container') {
    return false
  }

  if (item.component === 'custom') {
    const custom = customStore.state.components.get(props.element?.props?.componentId)
    const slots = depthFilter(custom?.config?.fields, (item) => item.component === 'slot').map(
      (item) => item.name || 'default'
    )
    // custom?.filter((item) => item.component === 'slot').map((item) => item.name || 'default')
    if (slots?.length > 0) {
      return false
    }
  }

  return true
})

const nodeText = computed(() => {
  if (props.element?.title) {
    return props.element?.title
  }

  if (props.element?.component === 'span' && props.element?.props?.innerText) {
    return props.element?.props?.innerText
  }

  const custom = customStore.state.components.get(props.element?.props?.componentId)

  if (custom?.name) {
    return custom.name
  }

  const item = componentStore.state.components.get(props.element?.component)

  if (item?.name) {
    return item.name
  }

  return props.element?.component
})

const nodeSlotLength = computed(() => {
  if (props.element?.component !== 'custom') {
    return false
  }

  const custom = customStore.state.components.get(props.element?.props?.componentId)

  if (!custom) {
    return false
  }

  const slots = depthFilter(custom?.config?.fields, (item) => item.component === 'slot').map(
    (item) => item.name || 'default'
  )

  return Array.from(new Set(slots)).length
})

const isSlots = computed(() => {
  return nodeSlotLength.value > 1
})

const elementSlots = computed(() => {
  const custom = customStore.state.components.get(props.element?.props?.componentId)

  if (!custom) {
    return []
  }

  return depthFilter(custom?.config?.fields, (item) => item.component === 'slot').map(
    (item) => item.name || 'default'
  )
})

const selectNode = () => {
  props.element && designerStore.toggleActive(props.element.nodeId)
}

const onToggleExpand = () => {
  props.element && designerStore.toggleOpen(props.element.nodeId)
}

const onDragStart = (event) => {
  const cloned = event.target.cloneNode(true)
  cloned.style.display = 'none'
  event.dataTransfer.setDragImage(cloned, 0, 0)

  context.state.draging = true
  node.isDragging = true
  event.dataTransfer.setData('nodeId', props.parent?.nodeId || '')
  event.dataTransfer.setData('fromIndex', props.index)
  event.dataTransfer.setData('slot', props.slotName)
}

const oDragEnd = () => {
  context.state.draging = false
  node.isDragging = false
}

const onNodeDragOver = (event) => {
  if (!isLeaf.value) {
    event.preventDefault()
    node.dragover = true
  }
}

const onNodeDragleave = () => {
  node.dragover = false
}

const onNodeDrop = (event) => {
  node.dragover = false
  const added = event.dataTransfer.getData('added')
  if (!added) {
    designerStore.changeNode(
      {
        nodeId: event.dataTransfer.getData('nodeId'),
        index: +event.dataTransfer.getData('fromIndex'),
        slot: event.dataTransfer.getData('slot'),
      },
      {
        nodeId: props.element?.nodeId || '',
        index: props.element?.children?.length || 0,
        slot: props.slotName,
      }
    )
  } else {
    designerStore.addNode({
      item: JSON.parse(added),
      nodeId: props.element?.nodeId || '',
      index: props.element?.children?.length || 0,
      slot: props.slotName,
    })
  }
}

const onDeleteNode = () => {
  designerStore.removeNode(props.element.nodeId)
}

watch(
  () => props.element.children,
  (value) => {
    children.value = value?.map((item) => ({ element: item })) || []
  },
  { immediate: true }
)
</script>

<template>
  <div
    draggable="true"
    class="node b-layer r-1"
    :class="{ 'is-dragging': node.isDragging }"
    @dragstart.self="onDragStart"
    @dragend="oDragEnd"
  >
    <!--  新成员拖入 .node-self 后：放到此节点第一个 prop 的最后一个位置 -->
    <div
      class="node-self hover stack x cross-center r-1 clip"
      :class="[
        { dragover: node.dragover },
        { 'bg-primary-r selected': isSelected && !context.state.draging },
      ]"
      @dragover="onNodeDragOver"
      @dragleave="onNodeDragleave"
      @click="selectNode"
      @drop="onNodeDrop"
    >
      <!-- icon -->
      <div class="b-layer">
        <!-- 容器节点 -->
        <template v-if="!isLeaf">
          <div class="padding-8 pointer" @click.stop="onToggleExpand">
            <div
              style="width: 16px; height: 16px"
              class="stack main-center cross-center bg-2 fz-p2"
            >
              {{ opened ? '-' : '+' }}
            </div>
          </div>
        </template>
        <!-- 非容器节点 todo，需要补充各类基础类型节点 icon -->
        <template v-else>
          <div class="padding-8">
            <div style="width: 16px; height: 16px" class="stack main-center cross-center fz-p2">
              ❖
            </div>
          </div>
        </template>
      </div>
      <!-- label -->
      <span class="item-flex padding-y-4 b-layer">
        <div class="ellipsis" style="width: 100%">{{ nodeText }}</div>
        <!-- <template v-if="isSlots">
          <span class="c-3"> ({{ nodeSlotLength }} slot)</span>
        </template> -->
      </span>
      <span class="bg-fail-r" v-show="node.hasError">err</span>

      <!-- <span class="bg-primary-r fz-p2" v-show="isSelected">已选</span> 样式已转移-->
      <!--  展开收起按钮，显示条件：(有至少 2 个 slotprop) 或 (有 1 个 slotprop 且其中有子 layer) -> 功能已被 icon 替代 -->
      <!-- <span class="fz-p2 pointer padding-x-2" @click.stop="onToggleExpand" v-show="!isLeaf">
        [ {{ opened ? '-' : '+' }} ]
      </span> -->
      <div
        class="padding-8 pointer"
        @click.stop="onDeleteNode"
        v-show="isSelected && !context.state.draging"
      >
        <div style="width: 16px; height: 16px" class="stack main-center cross-center c-3">×</div>
      </div>
    </div>
    <!--  Dopzone --><!--  新成员拖入这个 dropzone 后：放到此节点的弟弟位置  -->
    <Dropzone
      v-if="context.state.draging"
      class="abs z-1 c-3"
      style="width: 100%; bottom: 0px"
      :nodeId="parent?.nodeId"
      :index="index + 1"
      :slotName="slotName"
    ></Dropzone>
    <!--  子内容。显示条件：有 props && 处于展开模式下 -->
    <template v-if="opened">
      <div class="b-layer">
        <!--  sub node list (此节点只有 1 个 prop 时显示) -->
        <template v-if="!isSlots">
          <div class="node-list stack y indent">
            <LayerPanelNode :current="element" :nodes="element.children" />
          </div>
        </template>
        <!--  prop list (此节点有多个 prop 时显示) -->
        <template v-else>
          <div class="prop-list stack y indent">
            <LayerPanelNodeSlot
              v-for="slot in elementSlots"
              :key="slot"
              :element="element"
              :slotName="slot"
            />
            <!--  新成员拖入 .prop-self 后：放到此 prop 的节点列表的最后一个位置 -->
            <!--  --已废弃-- 新成员拖入后：放到此节点第一个 prop 的第一个位置 --><!--  --已废弃-- Dropzone.abs.z-1(style="width: 100%; top: 0px") 「{{ node.label }}」 1st son -->
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
*:not(.z-1) {
  z-index: unset;
}
.z-1 {
  z-index: 1;
}

.hover:not(.selected):hover {
  background: var(--color-basic-bg-2);
  /* background: var(--color-basic-bg-2); */
}
/* .node.is-selected > .node-self {
      background: var(--color-basic-bg-3);
      border-radius: 0;
    } */
/* .node.is-selected {
      background: var(--color-basic-bg-2);
    } */
.node.is-dragging {
  background: var(--color-basic-bg-2);
  /* overflow: hidden; */
}
.node.is-dragging > * {
  opacity: 0.25;
  pointer-events: none;
}
/* .node:not(.is-selected) > .node-self:hover{ */
.indent {
  padding-left: 16px;
}
.dragover {
  /* transition: all 0.1s ease-in-out; */
  box-shadow: inset 0 0 0 2px var(--color-basic-content-2);
  /* background: var(--color-primary-bg-2); */
}

.has-error {
  color: red;
}
</style>
