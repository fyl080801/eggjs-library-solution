<template>
  <div
    class="absolute top-0 left-0 bottom-0 right-0 flex flex-col justify-between"
  >
    <div class="px-4">
      <div>container</div>
    </div>
    <div class="flex-1 flex items-stretch bg-gray-100">
      <scroller-box class="w-1/12 bg-red-100"> tools </scroller-box>
      <scroller-box class="w-1/8 bg-blue-100"> tree </scroller-box>
      <scroller-box class="flex-1"> content </scroller-box>
      <scroller-box class="w-1/8 bg-blue-100"> props </scroller-box>
    </div>
  </div>
</template>
