export default {
  mounted: function() {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {},
  },
}
