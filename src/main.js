// TODO import config icon f-fast-access
// TODO directive/component params
// TODO мультиязычность
// TODO свайп

import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import VueTheMask from 'vue-the-mask'
import Checkout from '@/checkout'

const install = function (Vue, VeeValidate, VueTheMask) {
  Vue.config.productionTip = false
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
  window.fondy = function (el, options) {
    return new Vue({
      el: el,
      data: {
        options: options
      },
      template: '<checkout :options="options"/>',
      components: { Checkout },
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
  install(Vue, VeeValidate, VueTheMask)
}
