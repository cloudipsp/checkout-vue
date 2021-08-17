<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointMd">
      <f-info v-if="isOnlyCard" />
      <f-price />
      <div ref="button-pay-wallet" />
      <f-icons
        v-if="isOnlyCard"
        class="f-mb-3"
        title="pay_with_card"
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
import { resizeMixin } from '@/mixins/resize'
import {
  mountedButtonPayWallet,
  destroyedButtonPayWallet,
} from '@/components/button-pay-wallet'

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
  watch: {
    isBreakpointMd(value) {
      if (!value) return

      this.$nextTick(() => {
        mountedButtonPayWallet(this.$refs['button-pay-wallet'])
      })

      // TODO need else destroyedButtonPayWallet()
    },
  },
  mounted() {
    if (!this.isBreakpointMd) return

    mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
  destroyed() {
    if (!this.isBreakpointMd) return

    destroyedButtonPayWallet()
  },
}
</script>
