<template>
  <div v-if="show" class="f-sidebar">
    <f-scrollbar-vertical wrap-class="f-sidebar-wrap">
      <div class="f-sidebar-content f-container-sm">
        <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
        <f-info />
        <f-button-pay-wallet position="sidebar" />
        <f-menu />
        <f-fast-access />
        <f-security class="f-sidebar-security" />
      </div>
    </f-scrollbar-vertical>
  </div>
</template>

<script>
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'
import Resize from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFastAccess,
    FMenu,
  },
  mixins: [Resize],
  computed: {
    ...mapState(['isOnlyCard', 'is_only_wallets']),
    ...mapState('options', ['full_screen']),
    show() {
      return !this.hide
    },
    hide() {
      return (
        this.$route.name === 'success' ||
        (this.isBreakpointMd && this.isOnlyCard) ||
        this.is_only_wallets
      )
    },
  },
}
</script>
