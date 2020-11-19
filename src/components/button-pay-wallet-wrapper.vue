<template>
  <button-pay-wallet-inner v-if="show" v-bind="$attrs">
    <template #default="scope">
      <slot v-bind="scope" />
    </template>
  </button-pay-wallet-inner>
</template>

<script>
import { mapState } from '@/utils/store'
import ButtonPayWalletInner from '@/components/button-pay-wallet-inner'

export default {
  components: {
    ButtonPayWalletInner,
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('params', ['token']),
    show() {
      return this.token ? this.ready : true
    },
  },
}
</script>
