<template>
  <div>
    <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
    <f-info />
    <f-price />
    <div ref="button-pay-wallet" />
    <div
      v-if="showTitle"
      class="f-wallet-pay-title"
      v-text="$t('other_payment_method')"
    />
    <f-menu />
  </div>
</template>

<script>
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FMenu from '@/components/menu'
import { mapState } from '@/utils/store'

export default {
  components: {
    FInfo,
    FPrice,
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

      this.store.destroyedButtonPayWallet()
    },
  },
  mounted() {
    if (this.has_fields) return

    this.store.mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
  destroyed() {
    if (this.has_fields) return

    this.store.destroyedButtonPayWallet()
  },
}
</script>
