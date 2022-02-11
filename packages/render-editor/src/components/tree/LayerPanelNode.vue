<!-- 
Node:{ label: "", icon: isHover: false // 节点被 hover(和预览区联动) isSelected: false, // 节点被选中
isDragging: false, // 节点正在被拖动 dragover: false, // .node-self 被拖入元素时高亮 hasError: "", props:
Prop[] // 节点拥有的 slotprop 接口 open: false// 是否展开 } Prop:{ label: "", nodes: Node[] , dragover: false,
// .prop-self 被拖入元素时高亮 } [ ] 所有 dropzone 只在用户拖动节点时显示。 
-->

<template>
  <!--  不要修改元素顺序，会产生预期之外的布局样式和层级错乱 -->
  <div class="stack y">
    <!--  新成员拖入这个 dropzone 后：放到此节点所在列表的第一个位置 -->
    <Dropzone
      v-if="context.state.draging"
      class="abs z-1 c-3"
      style="width: 100%"
      :nodeId="current?.nodeId"
      :slotName="slotName"
    ></Dropzone>
    <!--  节点内容 -->
    <div class="stack y">
      <LayerPanelNodeElement
        v-for="(node, index) in nodes"
        :element="node"
        :parent="current"
        :index="index"
        :slotName="slotName"
        :key="node.nodeId"
      />
    </div>
  </div>
</template>

<script>
import { useDocumentTree } from './document'
import Dropzone from './LayerPanelDropzone.vue'
import LayerPanelNodeElement from './LayerPanelNodeElement.vue'

export default {
  name: 'LayerPanelNode',
  components: {
    Dropzone,
    LayerPanelNodeElement,
  },
  props: {
    current: Object,
    slotName: { type: String, default: 'default' },
    nodes: Array,
  },
  setup() {
    const context = useDocumentTree()
    return { context }
  },
  methods: {
    selectNode() {
      alert('select this node')
    },
    // dragover() {
    //   this.dragoverHighlight = true
    // },
    // dragleave() {
    //   this.dragoverHighlight = false
    // },
    mouseover() {
      // 鼠标 hover 到节点时，节点获得 hover 效果，和预览区联动
    },
    mouseleave() {
      // 鼠标移出节点时，节点失去 hover 效果，和预览区联动
    },
  },
}
</script>

<style scoped>
*:not(.z-1) {
  z-index: unset;
}
.z-1 {
  z-index: 1;
}
</style>
