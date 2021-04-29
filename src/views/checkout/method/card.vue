<template>
  <div>
    <template v-if="isBreakpointMd">
      <div>
        <f-info v-if="isOnlyCard" />
        <f-price v-else />
      </div>
      <f-button-pay-wallet />
      <f-icons
        v-if="isOnlyCard"
        class="f-mb-3"
        title="pay_with_card"
        :count="5"
        under-sticky
        position="center"
      />
    </template>
    <router-view />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FButtonPayWallet from '@/components/button-pay-wallet-wrapper'
import FIcons from '@/components/icons'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FInfo,
    FPrice,
    FButtonPayWallet,
    FIcons,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState(['isOnlyCard']),
  },
}
</script>
