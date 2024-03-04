<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointDownLg">
      <f-info v-if="isOnlyCard" />
      <f-price />
      <f-button-wallet-el />
      <f-icons
        v-if="isOnlyCard"
        class="f-mb-16"
        :title="$t('pay_with_card')"
        :count="5"
      />
    </template>
    <router-view />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FIcons from '@/components/icons'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FInfo,
    FPrice,
    FIcons,
    FButtonWalletEl,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState(['isOnlyCard']),
  },
}
</script>
