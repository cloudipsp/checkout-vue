<template>
  <div>
    <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
    <f-info />
    <f-price />
    <f-button-wallet-el v-if="!has_fields" />
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
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FMenu from '@/components/menu'
import { mapState } from '@/utils/store'

export default {
  components: {
    FInfo,
    FPrice,
    FButtonWalletEl,
    FMenu,
  },
  computed: {
    ...mapState('options', ['full_screen']),
    ...mapState(['has_fields', 'can_make_payment']),
    showTitle() {
      return this.can_make_payment && !this.has_fields
    },
  },
}
</script>
