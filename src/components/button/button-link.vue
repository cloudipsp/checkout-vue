<template>
  <button v-bind="$attrs" :class="className" type="button" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    block: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'secondary'].includes(value),
    },
  },
  computed: {
    className() {
      return [
        'f-btn',
        'f-btn-link',
        `f-btn-link-${this.variant}`,
        { 'f-btn-block': this.block },
      ]
    },
  },
}
</script>
