// @vue/component
export const removeAddEventListenerMixin = {
  mounted() {
    this.$nextTick().then(() => {
      const input = this.$refs.input.$el || this.$refs.input
      input.addEventListener = () => {}
    })
  },
}
