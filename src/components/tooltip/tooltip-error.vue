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
        placement: 'top',
        'custom-class': 'f-tooltip-error',
        variant: 'light',
        ...this.$attrs,
      }
    },
  },
}
</script>
