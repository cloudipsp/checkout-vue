<template>
  <div class="f-container-sm">
    <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
    <f-info />
    <f-button-pay-wallet show-title />
    <f-menu />
    <f-fast-access />
  </div>
</template>

<script>
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFastAccess,
    FMenu,
  },
  computed: {
    ...mapState('options', ['full_screen']),
  },
}
</script>
