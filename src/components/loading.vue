<template>
  <div :class="className">
    <div v-if="backdrop" class="f-loading-backdrop" />
    <div v-if="showCustom" class="f-loading-custom" :style="style" />
    <div v-else class="f-loading-loader">
      <f-svg name="sota" class="f-loading-item" />
      <f-svg name="sota" class="f-loading-item" />
      <f-svg name="sota" class="f-loading-item" />
    </div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    backdrop: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('options', ['loading']),
    className() {
      return [
        'f-loading',
        {
          'f-loading-wrapper': this.backdrop,
        },
      ]
    },
    showCustom() {
      return this.loading
    },
    style() {
      return {
        'background-image': `url("${this.loading.replace(/"/g, "'")}")`,
      }
    },
  },
}
</script>
