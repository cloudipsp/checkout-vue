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
        triggers: 'focus',
        placement: 'bottom',
        variant: 'error',
        ...this.$attrs,
      }
    },
  },
}
</script>
