<template>
  <div v-if="show" class="f-sidebar">
    <div class="f-sidebar-content">
      <f-info />
      <f-button-pay-wallet title />
      <f-menu />
      <f-fast-access />
      <f-security />
    </div>
  </div>
</template>

<script>
import EventBus from '@/event-bus'
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'
import FSecurity from '@/components/security'
import FInfo from '@/components/info'
import { mapState } from '@/utils/store'

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
  computed: {
    ...mapState('options', ['methods']),
    onlyCard() {
      return this.methods.length === 1 && this.methods[0] === 'card'
    },
    show() {
      let min = this.onlyCard || this.inProgress
      EventBus.$emit('checkout-min', min)
      return !min
    },
  },
}
</script>
