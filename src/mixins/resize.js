import { mapState } from '@/utils/store'

function init() {
  let width = window.innerWidth

  this.isBreakpointMd = this.full_screen ? width < 992 : true
  this.isWidthSm = width < 768
  this.isWidthLg = width < 1200
}

function resize() {
  init.apply(this)
  this.resize()
}

let resizeBind

export default {
  data() {
    return {
      isBreakpointMd: false,
      isWidthSm: false,
      isWidthLg: false,
    }
  },
  computed: {
    ...mapState('options', ['full_screen']),
  },
  created: function() {
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
