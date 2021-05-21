<template>
  <tooltip ref="tooltip" v-bind="attrs" v-on="$listeners">
    <slot />
  </tooltip>
</template>

<script>
import Tooltip from '@/components/tooltip/helpers/tooltip'

export default {
  components: {
    Tooltip,
  },
  inheritAttrs: false,
  computed: {
    attrs() {
      return {
        container: this.$root,
        ...this.$attrs,
      }
    },
  },
  methods: {
    close() {
      this.$refs.tooltip.$emit('close')
    },
  },
}
</script>
