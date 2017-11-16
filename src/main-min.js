import { Tooltip, Popover, Dropdown } from 'uiv'
import router from '@/router'
import checkout from '@/checkout'
import InputAmount from '@/components/input-amount'
import InputText from '@/components/input-text'

const install = function (Vue, VueRouter, VeeValidate, TheMask) {
  Vue.config.productionTip = false
  Vue.use(VueRouter)
  Vue.use(VeeValidate, {
    locale: 'ru',
    inject: false,
    dictionary: {
      ru: {
        messages: {
          credit_card: (field) => `Поле ${field} должно быть действительным номером карты`
        }
      }
    }
  })
  checkout.router = new VueRouter(router)
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
  Vue.component('Dropdown', Dropdown)
  Vue.component('the-mask', TheMask)
  Vue.component('inputAmount', InputAmount)
  Vue.component('inputText', InputText)
  window.fondy = function (el, options) {
    return new Vue({
      el: el,
      data: {
        options: options
      },
      $_veeValidate: {
        validator: 'new'
      },
      methods: {
        submit: function () {
          this.$emit('submit')
        },
        location: function (method, system) {
          this.$emit('location', method, system)
        }
      }
    })
  }
}

if ((typeof window !== 'undefined') && window.Vue && window.VueRouter && window.VeeValidate && window.VueTheMask) {
  install(window.Vue, window.VueRouter, window.VeeValidate, window.VueTheMask.TheMask)
}
