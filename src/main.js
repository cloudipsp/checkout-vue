import Vue from 'vue'
import Router from 'vue-router'
import router from './router'
import checkout from './checkout'

const install = function (Vue, Router) {
  Vue.config.productionTip = false
  Vue.use(Router)
  checkout.router = new Router(router)
  Vue.component(checkout.name, checkout)
}

if (typeof window !== 'undefined') {
  window.Vue = Vue
  window.Router = Router
  install(window.Vue, window.Router)
}
