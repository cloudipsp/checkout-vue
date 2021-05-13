<template>
  <button-pay-wallet-inner v-if="show" />
</template>

<script>
import Vue from 'vue'
import { mapState } from '@/utils/store'
import ButtonPayWalletInner from '@/components/button-pay-wallet-inner'

export default Vue.extend({
  components: {
    ButtonPayWalletInner,
  },
  computed: {
    ...mapState('options', ['methods_disabled']),
    show() {
      return !this.methods_disabled.includes('wallets')
    },
  },
})
</script>
