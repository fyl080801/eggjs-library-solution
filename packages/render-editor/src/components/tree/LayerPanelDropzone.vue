<template>
  <!-- 实例高度可以为 0，使得释放区域不占用空间 -->
  <div>
    <div
      class="dropzone"
      @dragover="dragover"
      @dragleave="dragleave()"
      @drop="onNodeDrop"
      :class="{ 'dragover-highlight': dragoverHighlight }"
    >
      <!-- <slot></slot> -->
    </div>
  </div>
</template>

<script>
import { useDesignerStore } from '@/store'

export default {
  name: 'Dropzone',
  props: {
    nodeId: String,
    index: { type: Number, default: 0 },
    slotName: { type: String, default: 'default' },
  },
  setup() {
    const designerStore = useDesignerStore()
    return { designerStore }
  },
  data() {
    return {
      dragoverHighlight: false,
    }
  },
  methods: {
    dragover(event) {
      event.preventDefault()
      this.dragoverHighlight = true
    },
    dragleave() {
      this.dragoverHighlight = false
    },
    onNodeDrop(event) {
      event.preventDefault()
      this.dragoverHighlight = false
      const added = event.dataTransfer.getData('added')

      if (!added) {
        this.designerStore.changeNode(
          {
            nodeId: event.dataTransfer.getData('nodeId'),
            index: +event.dataTransfer.getData('fromIndex'),
            slot: event.dataTransfer.getData('slot'),
          },
          {
            nodeId: this.nodeId || '',
            index: this.index,
            slot: this.slotName,
          }
        )
      } else {
        this.designerStore.addNode({
          item: JSON.parse(added),
          nodeId: this.nodeId || '',
          index: this.index,
          slot: this.slotName,
        })
      }
    },
  },
}
</script>

<style scoped>
.dropzone {
  /* tmp start */
  /* background: rgba(3, 101, 248, 0.144); */
  /* tmp end */
  height: 16px;
  margin-top: -8px;
  margin-bottom: -8px;
  /* opacity: 0; */
}

.dropzone::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  left: 4px;
  right: 4px;
  background: var(--color-basic-content-2);
  /* transition: opacity 0.1s ease-in-out; */
  opacity: 0;
}

.dragover-highlight.dropzone::after {
  opacity: 1;
}
</style>
