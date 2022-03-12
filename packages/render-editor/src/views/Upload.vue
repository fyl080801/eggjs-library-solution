<script>
import { computed } from '@vue/composition-api'
import { prefix } from '../utils/app'

export default {
  setup() {
    const actionUrl = computed(() => {
      return `${prefix}/upload`
    })

    return {
      actionUrl,
    }
  },
}
</script>

<template>
  <div>
    <h1>上传配置</h1>
    <form :action="actionUrl" method="post" enctype="multipart/form-data">
      <input type="file" name="package" />
      <div>
        <button class="border px-4 py-2">上传</button>
      </div>
    </form>
  </div>
</template>
