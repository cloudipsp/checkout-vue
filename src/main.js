// TODO $emit setParams затирает стейт параметрами notSet.params
// vuepress
// css class
// vue-i18n-extensions

import '@/scss/style.scss'

import Vue from 'vue'
import Checkout from '@/checkout'
import router from '@/router/index'
import i18n from '@/i18n/index'
import { isString, isPlainObject } from '@/utils/inspect'
import sentry from '@/sentry'
import components from '@/components/index'
import store from '@/store/index'
import validate from '@/validate/index'
import { initApi } from '@/utils/api'
import optionsDefault from '@/config/options-default'
import { loadCheckout, loadAsyncValidator } from '@/import'
loadCheckout()
loadAsyncValidator()

const install = function (Vue) {
  let instance = {}

  Vue.config.productionTip = false

  Vue.use(sentry)
  Vue.use(components)
  Vue.use(validate)

  window.fondy = function (el, optionsUser = {}) {
    if (!isString(el)) return console.error('Selector not a string')
    if (!isPlainObject(optionsUser))
      return console.error('Options not an object')
    let node = document.querySelector(el)
    if (!node) return console.error(['Selector', el, 'not found'].join(' '))

    if (instance[el]) instance[el].$destroy()

    let instanceStore = store(el)
    let origin =
      'https://' +
      (optionsUser.options?.api_domain ||
        optionsUser.options?.apiDomain ||
        optionsUser.button?.host ||
        optionsDefault.options.api_domain)
    let endpoint =
      optionsUser.options?.endpoint || optionsDefault.options.endpoint
    initApi(
      {
        origin,
        endpoint,
      },
      () => {
        instanceStore.formLoading(false)
      }
    )

    instance[el] = new Vue({
      router: router(el),
      i18n,
      store: instanceStore,
      data: {
        optionsUser: optionsUser,
      },
      methods: {
        submit() {
          this.$emit('submit')
          return this
        },
        location(method, system) {
          if (system) {
            this.$router
              .push({ name: 'system', params: { method, system } })
              .catch(() => {})
          } else {
            this.$router.push({ name: method }).catch(() => {})
          }
          return this
        },
        setParams(params) {
          this.store.setParams(params)
          return this
        },
      },
      render(h) {
        return h(Checkout, {
          props: {
            optionsUser,
          },
        })
      },
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
