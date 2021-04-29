// @vue/component
export const validatorMixin = {
  inject: ['$_veeObserver'],
  computed: {
    errors() {
      return Object.entries(this.$_veeObserver.errors).filter(
        ([, value]) => value.length
      )
    },
    isError() {
      return !!this.errors.length
    },
  },
}
