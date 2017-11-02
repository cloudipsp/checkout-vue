import Vue from 'vue'
import Router from 'vue-router'
import VeeValidate, { Validator } from 'vee-validate'
import { Tooltip, Popover } from 'uiv'
import { TheMask } from 'vue-the-mask'
import ru from 'vee-validate/dist/locale/ru'
import router from './router'
import checkout from './checkout'
// import utils from 'uiv/src/utils/domUtils'

const install = function (Vue, Router, VeeValidate, TheMask) {
  Vue.config.productionTip = false
  Vue.use(Router)
  Validator.localize('ru', ru)
  // Validator.extend('custom', {
  //   getMessage: field => '',
  //   validate: value => {
  //     return false
  //   }
  // })
  Vue.use(VeeValidate, {
    locale: 'ru',
    inject: false
    // dictionary: {
    //   ru: {
    //     messages: {
    //       required: function (n) {
    //         return 'Поле ' + n + ' обязательно для заполнения.'
    //       },
    //       custom: function (n) {
    //         return 'custom'
    //       }
    //     }
    //   }
    // }
  })
  checkout.router = new Router(router)
  Vue.component(checkout.name, checkout)
  Vue.component('Tooltip', {
    extends: Tooltip,
    render (h) {
      return h(
        this.tag,
        [
          this.$slots.default,
          h('div',
            {
              ref: 'tooltip',
              attrs: {
                role: 'tooltip',
                'data-theme': this.theme
              },
              on: {
                mouseenter: this.showOnHover,
                mouseleave: this.hideOnLeave
              }
            },
            [
              h('div', {'class': 'tooltip-arrow'}),
              h('div', {
                'class': 'tooltip-inner',
                domProps: {innerHTML: this.text}
              })
            ]
          )
        ]
      )
    },
    props: {
      theme: {
        type: String,
        default: 'error'
      },
      trigger: {
        type: String,
        default: 'focus'
      },
      placement: {
        type: String,
        default: 'right'
      },
      transitionDuration: {
        type: Number,
        default: 0
      }
    },
    watch: {
      enable (v) {
        if (v && this.handleAuto()) {
          this.show()
        }
        if (!v) {
          this.hide()
        }
      }
      // text (v) {
        // if (!v) {
        //   this.hide()
        // }
        // console.log(1, this.triggerEl.matches(':hover, :focus'))
        // if (v && this.triggerEl.matches(':hover, :focus')) {
        //   utils.setTooltipPosition(tooltip, this.triggerEl, this.placement, this.autoPlacement, this.appendTo)
        // }
      // }
    }
  })
  Vue.component('Popover', {
    extends: Popover,
    props: {
      placement: {
        type: String,
        default: 'right'
      },
      transitionDuration: {
        type: Number,
        default: 0
      }
    }
  })
  Vue.component('the-mask', TheMask)
}

if (typeof window !== 'undefined') {
  window.Vue = Vue
  window.Router = Router
  window.VeeValidate = VeeValidate
  window.TheMask = TheMask
  install(window.Vue, window.Router, window.VeeValidate, window.TheMask)
}
