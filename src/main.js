// TODO свайп
// TODO config fields payment systems
// TODO create color template param
// TODO support material
// TODO field input v-if add identical :key

// TODO $emit setParams затирает стейт параметрами notSet.params
// TODO в fail приходят cards, их отображать?
// vuepress
// css class

import Vue from 'vue'
import Checkout from '@/checkout'
import i18n from '@/i18n/index'
import { isString, isPlainObject } from '@/utils/typeof'
import components from '@/components/index'
import svg from '@/svg/index'
import store from '@/store/index'
import validate from '@/validate/index'

const install = function(Vue) {
  let instance

  Vue.config.productionTip = false

  Vue.use(components)
  Vue.use(svg)
  Vue.use(validate)

  window.fondy = function(el, optionsUser) {
    optionsUser = optionsUser || {}
    if (!isString(el)) return console.error('Selector not a string')
    if (!isPlainObject(optionsUser))
      return console.error('Options not an object')
    let node = document.querySelector(el)
    if (!node) return console.error(['Selector', el, 'not found'].join(' '))

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
