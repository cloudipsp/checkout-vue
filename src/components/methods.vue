<template>
  <div
    v-if="show"
    class="f-methods"
    :class="{ 'f-open': store.state.showChangeMethods }"
  >
    <f-wallet-pay-button position="top" tab="menu"></f-wallet-pay-button>
    <f-menu @on-change-method="changeMethod"></f-menu>
    <f-fast-access @on-change-method="changeMethod"></f-fast-access>
    <f-wallet-pay-button position="bottom" tab="menu"></f-wallet-pay-button>
  </div>
</template>

<script>
import EventBus from '@/event-bus'

export default {
  props: {
    inProgress: {
      type: Boolean,
    },
  },
  data() {
    return {}
  },
  computed: {
    show: function() {
      let min =
        (this.options.methods.length === 1 &&
          this.options.methods[0] === 'card') ||
        this.inProgress
      EventBus.$emit('checkout-min', min)
      return !min
    },
  },
  methods: {
    changeMethod: function(method, system) {
      this.store.location('f-payment-method', method, system)
    },
  },
}
</script>
