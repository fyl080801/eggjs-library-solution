<template>
  <div class="scroll-y hide-bar r-2 bg-basic">
    <template v-if="fields?.length">
      <div class="layer-panel stack y padding-8">
        <LayerPanelNode :nodes="fields" />
      </div>
    </template>
    <!-- 👇🏻 此元素接收拖入事件 -->
    <div
      v-else
      class="gap-8 stack y main-center cross-center c-3 r-2"
      style="height: 100%"
      :class="{ dragover: dragover }"
      @dragover="onDragover"
      @dragleave="dragover = false"
      @drop="onDrop"
    >
      <div>这是图层面板，</div>
      <div>从工具栏拖入新元素。</div>
    </div>
  </div>
</template>

<script>
import { useDesignerStore } from '@/store'
import LayerPanelNode from './LayerPanelNode.vue'

export default {
  name: 'LayerPanel',
  components: {
    LayerPanelNode,
  },
  setup() {
    const designerStore = useDesignerStore()
    return { designerStore }
  },
  data() {
    return {
      dragover: false,
      nodes: [
        { label: 'text', hasError: true, isSelected: true },
        {
          label: 'Box',
          props: [
            {
              label: 'prop',
              nodes: [
                { label: 'Comp' },
                { label: 'Text' },
                { label: 'Box', props: [{ label: 'Prop' }] },
                {
                  label: 'Slot',
                  props: [{ label: 'Prop', nodes: [{ label: 'Text' }, { label: 'Text' }] }],
                },
                {
                  label: 'Comp',
                  props: [
                    { label: 'prop 1', nodes: [{ label: 'Text' }, { label: 'Text' }] },
                    { label: 'prop 2', nodes: [] },
                  ],
                },
                { label: 'text' },
                {
                  label: 'Comp',
                  props: [
                    { label: 'prop 1', nodes: [{ label: 'Text' }, { label: 'Text' }] },
                    { label: 'prop 2', nodes: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  },
  computed: {
    fields() {
      return this.designerStore.state.config.fields
    },
  },
  methods: {
    onDragover(event) {
      event.preventDefault()
      this.dragover = true
    },
    onDrop(event) {
      this.dragover = false
      const added = event.dataTransfer.getData('added')
      if (added) {
        this.designerStore.addNode({
          item: JSON.parse(added),
          nodeId: '',
          index: 0,
          slot: 'default',
        })
      }
    },
  },
}
</script>

<style scoped>
.dragover {
  box-shadow: inset 0 0 0 2px var(--color-primary-reverse-bg);
  background: var(--color-primary-bg);
  /* border: var(--color-primary-reverse-bg) 4px solid; */
}
</style>
