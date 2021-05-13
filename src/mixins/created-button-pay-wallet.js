import { createdButtonPayWallet } from '@/components/button-pay-wallet'

// @vue/component
export const createdButtonPayWalletMixin = {
  inject: ['formRequest', '$_veeObserver'],
  created() {
    createdButtonPayWallet(this.store, this.formRequest, this.$_veeObserver)
  },
}
