// TODO свайп
// TODO config fields payment systems
// TODO create color template param
// TODO ? f-fields create root div
// TODO support material

// TODO field input v-if add identical :key
// TODO mixin global store

import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import Checkout from '@/checkout'
import { i18n } from '@/i18n'
import { isString, isObject } from '@/utils/object'
import store from '@/store'

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
    if (!isString(el)) return console.error('Selector not a string')
    if (!isObject(options)) return console.error('Options not an object')
    if (!document.querySelector(el)) return console.error(['Selector', el, 'not found'].join(' '))

    Vue.mixin({
      beforeCreate(){
        const options = this.$options
        // store injection
        if (options.store) {
          this.store = options.store
        } else if (options.parent && options.parent.store) {
          this.store = options.parent.store
        }

        // alias
        // this.state = this.store.state
        this.options = this.store.state.options
        this.regular = this.store.state.regular
        this.form = this.store.state.form
        this.error = this.store.state.error
        this.router = this.store.state.router
        this.$css = this.store.state.css
      },
      data () {
        return {
          store: this.store, // store make reactive
        }
      },
    })

    return new Vue({
      i18n,
      el: el,
      store,
      data: {
        options: options
      },
      template: '<checkout :options2="options"/>',
      components: { Checkout },
      $_veeValidate: {
        validator: 'new'
      },
      methods: {
        submit: function (cb) {
          this.$emit('submit', cb)
        },
        location: function (method, system) {
          this.$emit('location', method, system)
        },
        setParams: function (params) {
          this.$emit('setParams', params)
        }
      }
    })
  }
}

if (typeof window !== 'undefined') {
  install(Vue, VeeValidate)
}
