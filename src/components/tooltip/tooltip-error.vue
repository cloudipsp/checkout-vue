<template>
  <f-tooltip-base v-bind="attrs" v-on="$listeners">
    <slot />
  </f-tooltip-base>
</template>

<script>
import FTooltipBase from '@/components/tooltip/tooltip-base'

export default {
  components: {
    FTooltipBase,
  },
  inheritAttrs: false,
  computed: {
    attrs() {
      return {
        triggers: 'focus',
        placement: 'top',
        'custom-class': 'f-tooltip-error',
        variant: 'secondary',
        ...this.$attrs,
      }
    },
  },
}
</script>
