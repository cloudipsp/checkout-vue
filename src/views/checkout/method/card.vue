<template>
  <div>
    <template v-if="isBreakpointMd">
      <div>
        <f-info v-if="isOnlyCard" />
        <f-price v-else />
      </div>
      <div ref="button-pay-wallet" />
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
import FIcons from '@/components/icons'
import { resizeMixin } from '@/mixins/resize'
import { mountedButtonPayWallet } from '@/components/button-pay-wallet'

export default {
  components: {
    FInfo,
    FPrice,
    FIcons,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState(['isOnlyCard', 'has_fields']),
  },
  mounted() {
    if (this.has_fields) return
    if (!this.isBreakpointMd) return

    mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
}
</script>
