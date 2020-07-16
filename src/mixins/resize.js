import { mapState } from '@/utils/store'

function init() {
  let width = window.innerWidth

  // let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  this.isMobile = this.full_screen ? width < 768 : true
  this.isTablet = this.full_screen ? width < 992 : true
}

function resize() {
  init.apply(this)
  this.resize()
}

let resizeBind

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
    resizeBind = resize.bind(this)
    window.addEventListener('resize', resizeBind)
    init.apply(this)
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', resizeBind)
  },
  methods: {
    resize() {},
  },
}
