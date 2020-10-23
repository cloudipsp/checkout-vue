export default {
  inject: ['$validator', '$_veeObserver'],
  computed: {
    errors() {
      return Object.entries(this.$_veeObserver.ctx.errors).filter(
        ([, value]) => value.length
      )
    },
    isError() {
      return !!this.deprecatedErrors.items.length || !!this.errors.length
    },
  },
}
