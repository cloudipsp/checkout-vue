export default {
  mounted() {
    this.$nextTick().then(() => {
      const input = this.$refs.input.$el || this.$refs.input
      input.addEventListener = () => {}
    })
  },
}
