// @vue/component
export const isMountedMixin = {
  data() {
    return {
      isMounted: false,
    }
  },
  mounted() {
    this.isMounted = true
  },
}
