<template>
  <f-tooltip-base v-bind="attrs" v-on="$listeners">
    <slot />
  </f-tooltip-base>
</template>

<script>
export default {
  inheritAttrs: false,
  computed: {
    attrs() {
      return {
        triggers: 'click clickout keydown',
        placement: 'bottom',
        'custom-class': 'f-tooltip-select',
        variant: 'secondary',
        ...this.$attrs,
      }
    },
  },
}
</script>
