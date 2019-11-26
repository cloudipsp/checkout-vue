<template>
  <div v-if="show" class="f-methods" :class="openClass">
    <f-button-pay-wallet
      class="f-block-hr f-block"
      position="top"
      tab="menu"
    ></f-button-pay-wallet>
    <f-menu></f-menu>
    <f-fast-access></f-fast-access>
    <f-button-pay-wallet
      class="f-block"
      position="bottom"
      tab="menu"
    ></f-button-pay-wallet>
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
      return { 'f-open': this.store.state.showModalMethods }
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
