<template>
  <div v-if="show" class="f-methods" :class="openClass">
    <f-button-pay-wallet class="f-block-hr f-block" position="top" tab="menu" />
    <f-menu />
    <f-fast-access />
    <f-button-pay-wallet class="f-block" position="bottom" tab="menu" />
  </div>
</template>

<script>
import EventBus from '@/event-bus'
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFastAccess,
    FMenu,
  },
  props: {
    inProgress: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState(['showModalMethods']),
    ...mapState('options', ['methods']),
    openClass() {
      return { 'f-open': this.showModalMethods }
    },
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
