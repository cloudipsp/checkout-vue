<template>
  <div ref="button-pay-wallet" />
</template>

<script>
import {
  mountedButtonPayWallet,
  destroyedButtonPayWallet,
} from '@/components/button-pay-wallet'

export default {
  mounted() {
    mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
  destroyed() {
    destroyedButtonPayWallet()
  },
}
</script>
