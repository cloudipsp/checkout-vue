<template>
  <div class="f-sidebar">
    <div class="f-sidebar-content">
      <f-info position="sidebar" />
      <f-button-pay-wallet position="sidebar" />
      <f-menu />
      <f-fast-access />
      <f-security />
    </div>
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
  props: {
    inProgress: {
      type: Boolean,
    },
  },
}
</script>
