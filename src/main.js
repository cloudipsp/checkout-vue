import Vue from 'vue'
import Router from 'vue-router'
import VeeValidate, { Validator } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import router from './router'
import checkout from './checkout'

const install = function (Vue, Router, VeeValidate) {
  Vue.config.productionTip = false
  Vue.use(Router)
  Validator.localize('ru', ru)
  Vue.use(VeeValidate, {
    locale: 'ru'
  })
  checkout.router = new Router(router)
  Vue.component(checkout.name, checkout)
}

if (typeof window !== 'undefined') {
  window.Vue = Vue
  window.Router = Router
  window.VeeValidate = VeeValidate
  install(window.Vue, window.Router, window.VeeValidate)
}
