<template>
  <div :class="className">
    <div :class="classNameBackdrop" />
    <div v-if="showCustom" class="f-loading-custom" :style="style" />
    <div v-else class="f-loading-loader" />
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
    classNameBackdrop() {
      return {
        'f-loading-backdrop': this.backdrop,
      }
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
