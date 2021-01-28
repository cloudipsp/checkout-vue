// TODO $emit setParams затирает стейт параметрами notSet.params
// TODO в fail приходят cards, их отображать?
// vuepress
// css class
// vue-i18n-extensions

// eslint-disable-next-line no-unused-vars
import fonts from '@/scss/fonts.scss'
// eslint-disable-next-line no-unused-vars
import css from '@/scss/style.scss'
// eslint-disable-next-line no-unused-vars
import ss from '@/scss/style-adaptive-ss.scss'
// eslint-disable-next-line no-unused-vars
import sm from '@/scss/style-adaptive-sm.scss'

import Vue from 'vue'
import Checkout from '@/checkout'
import i18n from '@/i18n/index'
import { isString, isPlainObject } from '@/utils/typeof'
import components from '@/components/index'
import svg from '@/svg/index'
import store from '@/store/index'
import validate from '@/validate/index'

const install = function (Vue) {
  let instance = {}

  Vue.config.productionTip = false

  Vue.use(components)
  Vue.use(svg)
  Vue.use(validate)

  window.fondy = function (el, optionsUser) {
    optionsUser = optionsUser || {}
    if (!isString(el)) return console.error('Selector not a string')
    if (!isPlainObject(optionsUser))
      return console.error('Options not an object')
    let node = document.querySelector(el)
    if (!node) return console.error(['Selector', el, 'not found'].join(' '))

    if (instance[el]) instance[el].$destroy()

    instance[el] = new Vue({
      i18n,
      store: store(el),
      components: { Checkout },
      data: {
        optionsUser: optionsUser,
      },
      methods: {
        submit() {
          this.$emit('submit')
          return this
        },
        location(method, system) {
          this.store.location('payment-method', method, system)
          return this
        },
        setParams(params) {
          this.store.setParams(params)
          return this
        },
      },
      template: '<checkout :optionsUser="optionsUser"/>',
    }).$mount()

    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
    node.appendChild(instance[el].$el)
    return instance[el]
  }
}

if (typeof window !== 'undefined') {
  install(Vue)
}
