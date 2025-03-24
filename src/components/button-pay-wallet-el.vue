<template>
  <div />
</template>

<script>
import ButtonPayWalletList from '@/components/button-pay-wallet-list'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  inject: ['formRequest', '$_veeObserver'],
  computed: {
    ...mapStateGetSet(['init_wallets', 'vm_wallets']),
    ...mapState('options', ['disable_request', 'methods_disabled']),
    show() {
      return !this.disable_request && !this.methods_disabled.includes('wallets')
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
      if (this.init_wallets) return

      this.init_wallets = true

      this.vm_wallets = new ButtonPayWalletList({
        store: this.store,
        provide() {
          return { formRequest: this.formRequest }
        },
        parent: this.$_veeObserver,
      }).$mount()
    },
    append() {
      if (!this.show) return
      this.vm_wallets.load = false
      this.$el.appendChild(this.vm_wallets.$el)
    },
  },
}
</script>
