import { Transition } from '@/utils/transition'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  inheritAttrs: false,
  model: {
    prop: 'show',
    event: 'input',
  },
  props: {
    variant: makeProp(PROP_TYPE_STRING, 'info'),
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      // If initially shown, we need to set these for SSR
      localShow: this.show,
    }
  },
  watch: {
    show(newVal) {
      this.localShow = newVal
    },
  },
  created() {
    this.localShow = this.show
  },
  mounted() {
    this.localShow = this.show
  },
  render(h) {
    let $alert // undefined
    if (this.localShow) {
      $alert = h(
        'div',
        {
          key: this._uid,
          staticClass: 'f-alert',
          class: [`f-alert-${this.variant}`],
          attrs: {
            role: 'alert',
            'aria-live': 'polite',
            'aria-atomic': true,
          },
        },
        [this.$slots.default]
      )
      $alert = [$alert]
    }
    return h(Transition, {}, $alert)
  },
}
