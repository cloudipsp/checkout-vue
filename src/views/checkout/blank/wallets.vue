<template>
  <div ref="button-pay-wallet" />
</template>

<script>
import { mountedButtonPayWallet } from '@/components/button-pay-wallet'

export default {
  mounted() {
    mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
}
</script>
