import checkout from '@/checkout'

const install = function (Vue) {
  Vue.component(checkout.name, checkout)
}

if ((typeof window !== 'undefined') && window.Vue && window.VeeValidate && window.VueTheMask) {
  install(window.Vue)
}
