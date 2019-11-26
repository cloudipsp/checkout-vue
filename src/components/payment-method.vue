<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <f-wallet-pay-button position="top" :tab="method"></f-wallet-pay-button>
    <f-payment-fields />
    <transition name="fade">
      <!--card emoney ibank trustly cash sepa-->
      <component
        :is="method"
        :key="method"
        :icons="icons"
        :payment-systems="paymentSystems"
      />
    </transition>
    <f-regular />
    <f-offer />
    <div class="f-block">
      <div class="f-block-sm">
        <f-button-pay></f-button-pay>
        <f-wallet-pay-button
          position="bottom"
          :tab="method"
        ></f-wallet-pay-button>
        <f-button-cancel></f-button-cancel>
        <i class="f-icon f-icon-block f-i-security f-hidden-desktop" />
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/card'
import Emoney from '@/components/emoney'
import Ibank from '@/components/ibank'
import Trustly from '@/components/trustly'
import Cash from '@/components/cash'
import Sepa from '@/components/sepa'
import FPaymentFields from '@/components/payment-fields'
import FButtonPay from '@/components/button-pay'
import FButtonCancel from '@/components/button-cancel'

export default {
  components: {
    Card,
    Emoney,
    Ibank,
    Trustly,
    Cash,
    Sepa,
    FPaymentFields,
    FButtonPay,
    FButtonCancel,
  },
  data() {
    return {}
  },
  computed: {
    method() {
      return this.store.state.router.method
    },
    icons() {
      return this.store.state.options[this.method + '_icons']
    },
    paymentSystems() {
      return this.store.state.options[this.method]
    },
  },
}
</script>
