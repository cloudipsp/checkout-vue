<template>
  <div class="f-menu">
    <div v-t="'methods'" class="f-block-hr f-title f-hidden-mobile" />
    <div v-t="'methods_m'" class="f-block f-title3 f-visible-mobile" />
    <div class="f-block-hr">
      <div
        v-for="item in options.methods"
        :key="item"
        v-t="item"
        class="f-item"
        :class="['f-i-' + item, { active: router.method === item }]"
        @click="$emit('on-change-method', item)"
      />
    </div>
  </div>
</template>
