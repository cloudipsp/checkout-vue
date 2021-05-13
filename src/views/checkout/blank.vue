<template>
  <router-view />
</template>

<script>
import { createdButtonPayWalletMixin } from '@/mixins/created-button-pay-wallet'

export default {
  mixins: [createdButtonPayWalletMixin],
}
</script>
