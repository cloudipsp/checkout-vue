// TODO import config icon f-fast-access
// TODO delete bootstrap
// TODO directive/component params
// TODO разделить респонс дизайн
// TODO мультиязычность
// TODO свайп

import Vue from 'vue'
import VueRouter from 'vue-router'
import VeeValidate, { Validator } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import VueTheMask from 'vue-the-mask'

import router from '@/router'
import checkout from '@/checkout'

const install = function (Vue, VueRouter, VeeValidate, VueTheMask) {
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
  Vue.use(VueTheMask)
  checkout.router = new VueRouter(router)
  Vue.component(checkout.name, checkout)
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

if (typeof window !== 'undefined') {
  Validator.localize('ru', ru)
  install(Vue, VueRouter, VeeValidate, VueTheMask)
}
