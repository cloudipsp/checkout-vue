// TODO вынести зависимости с index / две зборки с либами и без
// TODO import config icon f-fast-access
// TODO delete bootstrap
// TODO directive/component params
// TODO разделить респонс дизайн
// TODO мультиязычность
// TODO свайп
// TODO decimal amount

import Vue from 'vue'
import Router from 'vue-router'
import VeeValidate, { Validator } from 'vee-validate'
import { Tooltip, Popover, Dropdown } from 'uiv'
import { TheMask } from 'vue-the-mask'
import ru from 'vee-validate/dist/locale/ru'
import router from './router'
import checkout from './checkout'
import InputAmount from '@/components/input-amount'
import InputText from '@/components/input-text'

const install = function (Vue, Router, VeeValidate, TheMask) {
  Vue.config.productionTip = false
  Vue.use(Router)
  Validator.localize('ru', ru)
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
}

if (typeof window !== 'undefined') {
  window.Vue = Vue
  window.Router = Router
  window.VeeValidate = VeeValidate
  window.TheMask = TheMask
  install(window.Vue, window.Router, window.VeeValidate, window.TheMask)
}
