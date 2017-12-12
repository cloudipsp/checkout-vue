// TODO свайп
// TODO config fields payment systems
// TODO сделать дебаг сборку -4kB gzip

import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Checkout from '@/checkout'
import { i18n } from '@/i18n'

const install = function (Vue, VeeValidate) {
  Vue.config.productionTip = false
  Vue.use(VeeValidate, { inject: false })
  window.fondy = function (el, options) {
    return new Vue({
      i18n,
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
  install(Vue, VeeValidate)
}
