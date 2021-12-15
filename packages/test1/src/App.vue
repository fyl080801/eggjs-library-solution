<script>
import { defineComponent } from '@vue/composition-api';
import Hello from './components/Hello.vue';
import { getService } from '@egglib/di';

export default defineComponent({
  components: {
    Hello,
  },
  setup() {
    const cons = getService('main.console');

    return {
      ontest() {
        cons();
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
