<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <f-info />
    <f-button-pay-wallet />
    <transition name="fade">
      <f-icons class="f-mb-3" :list="icons" title />
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
import FIcons from '@/components/icons'
import { mapState } from '@/utils/store'
import FInfo from '@/components/info'

export default {
  components: {
    Card,
    Emoney,
    Ibank,
    Trustly,
    Cash,
    Sepa,
    FIcons,
    FInfo,
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
