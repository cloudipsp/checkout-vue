import FButtonPayWallet from '@/components/button-pay-wallet-wrapper'

let vm
let init

export const createdButtonPayWallet = (store, formRequest, parent) => {
  if (init) return
  init = true

  vm = new FButtonPayWallet({
    store,
    provide() {
      return { formRequest }
    },
    parent,
  }).$mount()
}

export const mountedButtonPayWallet = el => {
  el.appendChild(vm.$el)
}

export const destroyedButtonPayWallet = () => {
  if (!vm.show) return
  if (!vm.$el.parentNode) return

  vm.$refs.inner.load = false
  vm.$el.parentNode.removeChild(vm.$el)
}
