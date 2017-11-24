import Checkout from '@/checkout'

const install = function (Vue) {
  Vue.component(Checkout.name, Checkout)
}

if ((typeof window !== 'undefined') && window.Vue && window.VeeValidate && window.VueTheMask) {
  install(window.Vue)
}
