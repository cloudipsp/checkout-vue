import router from '@/router'
import checkout from '@/checkout'

const install = function (Vue, VueRouter) {
  checkout.router = new VueRouter(router)
  Vue.component(checkout.name, checkout)
}

if ((typeof window !== 'undefined') && window.Vue && window.VueRouter && window.VeeValidate && window.VueTheMask) {
  install(window.Vue, window.VueRouter)
}
