// TODO свайп
// TODO config fields payment systems
// TODO create color template param
// TODO support material
// TODO field input v-if add identical :key

// TODO $emit setParams затирает стейт параметрами notSet.params
// TODO в fail приходят cards, их отображать?

import Vue from 'vue'
import Checkout from '@/checkout'
import { i18n } from '@/i18n'
import { isString, isObject } from '@/utils/object'
import components from '@/components'
import store from '@/store'
import Store from '@/mixins/store'
import Validator from '@/mixins/validator'
import { iframeCreate } from '@/utils/helpers'
import optionsDefault from '@/config/options-default'

const install = function(Vue) {
  let instance

  Vue.config.productionTip = false

  Vue.use(components)
  Vue.use(Store)
  Vue.use(Validator)

  window.fondy = function(el, optionsUser) {
    optionsUser = optionsUser || {}
    if (!isString(el)) return console.error('Selector not a string')
    if (!isObject(optionsUser)) return console.error('Options not an object')
    let node = document.querySelector(el)
    if (!node) return console.error(['Selector', el, 'not found'].join(' '))

    iframeCreate(
      (optionsUser.options &&
        (optionsUser.options.api_domain || optionsUser.options.apiDomain)) ||
        optionsDefault.options.api_domain
    )

    if (instance) instance.$destroy()
    store.setStateDefault()

    instance = new Vue({
      i18n,
      store,
      components: { Checkout },
      data: {
        optionsUser: optionsUser,
      },
      methods: {
        submit: function() {
          this.$emit('submit')
          return this
        },
        location: function(method, system) {
          this.$emit('location', method, system)
          return this
        },
        setParams: function(params) {
          this.$emit('setParams', params)
          return this
        },
      },
      template: '<checkout :optionsUser="optionsUser"/>',
      $_veeValidate: {
        validator: 'new',
      },
    }).$mount()

    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
    node.appendChild(instance.$el)
    return instance
  }
}

if (typeof window !== 'undefined') {
  install(Vue)
}
