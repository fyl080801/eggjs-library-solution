<script>
import { defineComponent } from '@vue/composition-api';
import Hello from './components/Hello.vue';

export default defineComponent({
  components: {
    Hello,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div>
    aaa
    <hello />
    <testCmp />
  </div>
</template>
