<template>
  <div />
</template>

<script>
import ButtonPayWalletInner from '@/components/button-pay-wallet-inner'
import { mapState } from '@/utils/store'
let init
let vm

export default {
  inject: ['formRequest', '$_veeObserver'],
  computed: {
    ...mapState('options', ['methods_disabled']),
    show() {
      return !this.methods_disabled.includes('wallets')
    },
  },
  created() {
    this.init()
  },
  mounted() {
    this.append()
  },
  methods: {
    init() {
      if (!this.show) return
      if (init) return

      init = true

      vm = new ButtonPayWalletInner({
        store: this.store,
        provide() {
          return { formRequest: this.formRequest }
        },
        parent: this.$_veeObserver,
      }).$mount()

      this.$root.$on('click-wallet', this.click)
    },
    append() {
      if (!this.show) return
      vm.load = false
      this.$el.appendChild(vm.$el)
    },
    click() {
      vm.click()
    },
  },
}
</script>
