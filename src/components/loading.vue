<template>
  <div :class="className">
    <div :class="classNameBackdrop" />
    <div class="f-loading-loader" />
  </div>
</template>

<script>
export default {
  props: {
    backdrop: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
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
  },
}
</script>
