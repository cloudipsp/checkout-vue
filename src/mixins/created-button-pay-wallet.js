// @vue/component
export const createdButtonPayWalletMixin = {
  inject: ['formRequest', '$_veeObserver'],
  created() {
    this.store.createdButtonPayWallet(this.formRequest, this.$_veeObserver)
  },
}
