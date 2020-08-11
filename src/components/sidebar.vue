<template>
  <div class="f-sidebar">
    <f-scrollbar-vertical wrap-class="f-sidebar-wrap">
      <div class="f-sidebar-content f-container-sm">
        <div class="f-top">&nbsp;</div>
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
import FSecurity from '@/components/security'
import FInfo from '@/components/info'

export default {
  components: {
    FFastAccess,
    FMenu,
    FSecurity,
    FInfo,
  },
}
</script>
