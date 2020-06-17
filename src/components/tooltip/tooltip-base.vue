<template>
  <tooltip v-bind="attrs" v-on="$listeners">
    <slot />
  </tooltip>
</template>

<script>
import Tooltip from './tooltip'

export default {
  components: {
    Tooltip,
  },
  inheritAttrs: false,
  computed: {
    attrs() {
      return {
        ...this.$attrs,
      }
    },
  },
}
</script>
