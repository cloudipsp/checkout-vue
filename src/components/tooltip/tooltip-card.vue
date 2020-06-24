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
        triggers: 'click focus blur',
        placement: 'bottom',
        variant: 'card',
        ...this.$attrs,
      }
    },
  },
}
</script>
