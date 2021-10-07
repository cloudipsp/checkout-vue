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
        ref: 'tooltip',
        triggers: 'focus',
        placement: 'bottom',
        'custom-class': 'f-tooltip-autocomplete',
        variant: 'secondary',
        ...this.$attrs,
      }
    },
  },
  methods: {
    open() {
      this.$refs.tooltip.$emit('open')
    },
    close() {
      this.$refs.tooltip.$emit('close')
    },
  },
}
</script>
