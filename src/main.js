// TODO свайп
// TODO config fields payment systems
// TODO create color template param
// TODO ? f-fields create root div
// TODO support material

import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import Checkout from '@/checkout'
import { i18n } from '@/i18n'
import { isString, isObject } from '@/utils/object'

const install = function (Vue, VeeValidate) {
  Vue.config.productionTip = false
  Validator.extend('customer_field', {
    getMessage: (field) => `The ${field} field format is invalid.`,
    validate: value => /^(?!\s)[0-9A-Za-z-\/\s\.,]+(?!\s)$/.test(value)
  })
  Validator.extend('phone', {
    getMessage: (field) => `The ${field} field format is invalid.`,
    validate: value => /^\+?\d{7,14}$/.test(value)
  })
  Vue.use(VeeValidate, { inject: false })
  window.fondy = function (el, options) {
    options = options || {}
    if (isString(el) && isObject(options)) {
      let selected = document.querySelector(el);
      if (!selected) {
        return console.error('error run')
      }
    } else {
      return console.error('error run')
    }
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
