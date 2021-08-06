<template>
  <div class="f-container-sm">
    <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
    <f-info />
    <div ref="button-pay-wallet" />
    <div
      v-if="showTitle"
      class="f-wallet-pay-title"
      v-text="$t('other_payment_method')"
    />
    <f-menu />
    <f-fast-access />
  </div>
</template>

<script>
import FInfo from '@/components/info'
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'
import { mapState } from '@/utils/store'
import {
  mountedButtonPayWallet,
  destroyedButtonPayWallet,
} from '@/components/button-pay-wallet'

export default {
  components: {
    FInfo,
    FFastAccess,
    FMenu,
  },
  computed: {
    ...mapState('options', ['full_screen']),
    ...mapState(['has_fields', 'can_make_payment']),
    showTitle() {
      return this.can_make_payment && !this.has_fields
    },
  },
  watch: {
    has_fields(value) {
      if (!value) return

      destroyedButtonPayWallet()
    },
  },
  mounted() {
    if (this.has_fields) return

    mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
  destroyed() {
    if (this.has_fields) return

    destroyedButtonPayWallet()
  },
}
</script>
