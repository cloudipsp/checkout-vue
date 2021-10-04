<template>
  <div ref="button-pay-wallet" />
</template>

<script>
export default {
  mounted() {
    this.store.mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
  destroyed() {
    this.store.destroyedButtonPayWallet()
  },
}
</script>
