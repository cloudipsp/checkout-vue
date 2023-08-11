<template>
  <div />
</template>

<script>
import ButtonPayWalletList from '@/components/button-pay-wallet-list'
import { mapState, mapStateGetSet } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  inject: ['formRequest', '$_veeObserver'],
  props: {
    onlyInit: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapStateGetSet(['init_wallets', 'vm_wallets']),
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
      if (this.onlyInit) return
      if (!this.show) return
      this.vm_wallets.load = false
      this.$el.appendChild(this.vm_wallets.$el)
    },
  },
}
</script>
