<script>
import { defineComponent } from 'vue'
import { request } from '../utils/request'

export default defineComponent({
  setup() {
    return {
      mocktest() {
        request({ url: '/testmock/aaaa/test1' })
      },
    }
  },
})
</script>

<template>
  <div>
    <router-link to="workspace">to editor</router-link>
    <button @click="mocktest">mocktest</button>
  </div>
</template>
