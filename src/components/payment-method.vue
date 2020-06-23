<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <f-button-pay-wallet
      class="f-block-hr f-block"
      position="top"
      :tab="method"
    />
    <f-fields />
    <transition name="fade">
      <f-icons class="f-block f-block-hr f-text-center" :list="icons" />
    </transition>
    <transition name="fade">
      <!--card emoney ibank trustly cash sepa-->
      <component :is="method" :key="method" :payment-systems="paymentSystems" />
    </transition>
  </div>
</template>

<script>
import Card from '@/components/card'
import Emoney from '@/components/emoney'
import Ibank from '@/components/ibank'
import Trustly from '@/components/trustly'
import Cash from '@/components/cash'
import Sepa from '@/components/sepa'
import Wallets from '@/components/wallets'
import FFields from '@/components/fields'
import FIcons from '@/components/icons'
import { mapState } from '@/utils/store'

export default {
  components: {
    Card,
    Emoney,
    Ibank,
    Trustly,
    Cash,
    Sepa,
    Wallets,
    FFields,
    FIcons,
  },
  computed: {
    ...mapState('router', ['method']),
    ...mapState(['options']),
    icons() {
      return this.options[this.method + '_icons']
    },
    paymentSystems() {
      return this.options[this.method]
    },
  },
}
</script>
