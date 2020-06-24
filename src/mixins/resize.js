export default {
  data() {
    return {
      isMobile: false,
    }
  },
  mounted: function() {
    window.addEventListener('resize', this.afterResize)
    this.afterResize()
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.afterResize)
  },
  methods: {
    afterResize() {
      let width = document.documentElement.clientWidth

      this.isMobile = width < 768

      this.resize()
    },
    resize() {},
  },
}
