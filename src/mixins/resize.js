import { listenOnWindowMixin } from '@/mixins/listen-on-window'
import { mapState } from '@/utils/store'
import { isFunction } from '@/utils/inspect'
import { windowWidth } from '@/utils/helpers'

function init() {
  let width = windowWidth()

  this.isBreakpointMd = this.full_screen ? width < 992 : true
  this.isWidthSm = width < 768
}

function resize() {
  init.apply(this)
  if (isFunction(this.resize)) {
    this.resize()
  }
}

// @vue/component
export const resizeMixin = {
  mixins: [listenOnWindowMixin],
  data() {
    return {
      isBreakpointMd: false,
      isWidthSm: false,
    }
  },
  computed: {
    ...mapState('options', ['full_screen']),
  },
  created() {
    let handler = resize.bind(this)
    this.listenOnWindow('resize', handler)
    this.listenOnWindow('orientationchange', handler)
    init.apply(this)
  },
}
