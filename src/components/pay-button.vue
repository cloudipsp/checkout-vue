<template>
  <div class="f-pay-button f-block">
    <div class="f-block-sm">
      <f-button-pay></f-button-pay>
      <f-wallet-pay-button
        position="bottom"
        :tab="method"
      ></f-wallet-pay-button>
      <f-button-cancel></f-button-cancel>
      <div class="f-hidden-desktop">
        <i class="f-icon f-icon-block f-i-security" />
      </div>
    </div>
  </div>
</template>

<script>
import FButtonPay from '@/components/button-pay'
import FButtonCancel from '@/components/button-cancel'

export default {
  components: {
    FButtonPay,
    FButtonCancel,
  },
  computed: {
    method: function() {
      return this.router.method
    },
  },
}
</script>
