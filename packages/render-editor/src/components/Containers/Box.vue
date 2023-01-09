<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    direction: {
      type: String,
      default: 'col',
      validator: () => {
        return ['col', 'row']
      },
    },
  },
})
</script>

<template>
  <div
    class="inline-flex items-stretch justify-items-stretch"
    :class="[`flex-${direction}`]"
  >
    <slot></slot>
  </div>
</template>
