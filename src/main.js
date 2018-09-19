// TODO свайп
// TODO config fields payment systems
// TODO create color template param
// TODO ? f-fields create root div
// TODO support material
// TODO field input v-if add identical :key
// TODO create component type="checkbox" f-offer

import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Checkout from '@/checkout'
import { i18n } from '@/i18n'
import { isString, isObject } from '@/utils/object'
import store from '@/store'
import Store from '@/mixins/store'
import Validator from '@/mixins/validator'
import { iframeCreate } from '@/utils/helpers'

const install = function (Vue, VeeValidate) {
  Vue.config.productionTip = false

  Vue.use(VeeValidate, { inject: false })
  Vue.use(Store)
  Vue.use(Validator)

  window.fondy = function (el, optionsUser) {
    optionsUser = optionsUser || {}
    if (!isString(el)) return console.error('Selector not a string')
    if (!isObject(optionsUser)) return console.error('Options not an object')
    if (!document.querySelector(el)) return console.error(['Selector', el, 'not found'].join(' '))

    // iframeCreate(optionsUser.options.api_domain || optionsUser.options.apiDomain)

    return new Vue({
      i18n,
      el: el,
      store,
      data: {
        optionsUser: optionsUser
      },
      template: '<checkout :optionsUser="optionsUser"/>',
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
