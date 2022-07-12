<template>
  <div />
</template>

<script>
import FButtonPayWallet from '@/components/button-pay-wallet-wrapper'
let init
let vm

export default {
  inject: ['formRequest', '$_veeObserver'],
  created() {
    if (init) return

    init = true

    vm = new FButtonPayWallet({
      store: this.store,
      provide() {
        return { formRequest: this.formRequest }
      },
      parent: this.$_veeObserver,
    }).$mount()
  },
  mounted() {
    vm.$refs.inner.load = false
    this.$el.appendChild(vm.$el)
  },
}
</script>
