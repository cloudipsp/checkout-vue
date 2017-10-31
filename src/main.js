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
  // Validator.extend('custom', {
  //   getMessage: field => '',
  //   validate: value => {
  //     return false
  //   }
  // })
  Vue.use(VeeValidate, {
    locale: 'ru',
    inject: false
    // dictionary: {
    //   ru: {
    //     messages: {
    //       required: function (n) {
    //         return 'Поле ' + n + ' обязательно для заполнения.'
    //       },
    //       custom: function (n) {
    //         return 'custom'
    //       }
    //     }
    //   }
    // }
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
