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
        triggers: 'hover focus',
        placement: 'topright',
        variant: 'default',
        ...this.$attrs,
      }
    },
  },
}
</script>
