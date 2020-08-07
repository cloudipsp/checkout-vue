import Vue from 'vue'
import { BAlert } from 'bootstrap-vue'
import FButtonClose from '../../button/button-close'
import BVTransition from 'bootstrap-vue/esm/utils/bv-transition'

export default Vue.extend({
  extends: BAlert,
  render(h) {
    let $alert // undefined
    if (this.localShow) {
      let $dismissBtn = h()
      if (this.dismissible) {
        // Add dismiss button
        $dismissBtn = h(
          FButtonClose,
          {
            attrs: { 'aria-label': this.dismissLabel },
            on: { click: this.dismiss },
          },
          [this.normalizeSlot('dismiss')]
        )
      }
      $alert = h(
        'div',
        {
          key: this._uid,
          staticClass: 'f-alert',
          class: {
            'f-alert-dismissible': this.dismissible,
            [`f-alert-${this.variant}`]: this.variant,
          },
          attrs: {
            role: 'alert',
            'aria-live': 'polite',
            'aria-atomic': true,
          },
        },
        [$dismissBtn, this.normalizeSlot('default')]
      )
      $alert = [$alert]
    }
    return h(BVTransition, { props: { noFade: !this.fade } }, $alert)
  },
})
