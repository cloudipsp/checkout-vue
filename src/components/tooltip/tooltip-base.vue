<template>
  <tooltip v-bind="attrs" v-on="$listeners">
    <slot />
  </tooltip>
</template>

<script>
import Tooltip from './helpers/tooltip'

export default {
  components: {
    Tooltip,
  },
  inheritAttrs: false,
  props: {
    underSticky: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    customClass() {
      return [
        this.$attrs['custom-class'],
        this.underSticky ? 'f-tooltip-under-sticky' : '',
      ].join(' ')
    },
    attrs() {
      return {
        ...this.$attrs,
        'custom-class': this.customClass,
      }
    },
  },
}
</script>
