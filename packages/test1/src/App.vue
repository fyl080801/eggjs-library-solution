<script>
import { defineComponent } from '@vue/composition-api';
import Hello from './components/Hello.vue';

export default defineComponent({
  components: {
    Hello,
  },
  setup() {
    // const cons = getService('main.console');

    return {
      ontest() {
        // cons();
      },
    };
  },
});
</script>

<template>
  <div>
    aaa
    <button @click="ontest">test</button>
    <hello />
    <testCmp />
  </div>
</template>
