<template>
  <div v-if="show" class="f-methods" :class="openClass">
    <f-wallet-pay-button position="top" tab="menu"></f-wallet-pay-button>
    <f-menu></f-menu>
    <f-fast-access></f-fast-access>
    <f-wallet-pay-button position="bottom" tab="menu"></f-wallet-pay-button>
  </div>
</template>

<script>
import EventBus from '@/event-bus'
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'

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
  data() {
    return {}
  },
  computed: {
    openClass() {
      return { 'f-open': this.store.state.showChangeMethods }
    },
    onlyCard() {
      return (
        this.store.state.options.methods.length === 1 &&
        this.store.state.options.methods[0] === 'card'
      )
    },
    show() {
      let min = this.onlyCard || this.inProgress
      EventBus.$emit('checkout-min', min)
      return !min
    },
  },
}
</script>
