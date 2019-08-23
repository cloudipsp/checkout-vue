<template>
  <div class="f-methods" :class="{ 'f-open': store.state.showChangeMethods }">
    <f-menu @on-change-method="changeMethod"></f-menu>
    <f-fast-access @on-change-method="changeMethod"></f-fast-access>
  </div>
</template>

<script>
import configPaymentSystems from '@/config/payment-systems'

export default {
  data() {
    return {
      configPaymentSystems: configPaymentSystems,
    }
  },
  computed: {},
  methods: {
    changeMethod: function(method, system) {
      this.store.location('payment-method', method, system)
      this.store.state.showChangeMethods = false
    },
  },
}
</script>
