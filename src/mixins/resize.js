import { mapState } from '@/utils/store'

export default {
  data() {
    return {
      isMobile: true,
      isTablet: false,
    }
  },
  computed: {
    ...mapState('options', ['full_screen']),
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
      let width = window.innerWidth

      this.isMobile = this.full_screen ? width < 768 : true
      this.isTablet = this.full_screen ? width < 992 : true

      this.resize()
    },
    resize() {},
  },
}
