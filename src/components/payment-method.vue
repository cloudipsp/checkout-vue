<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <f-info />
    <f-button-pay-wallet />
    <transition name="fade">
      <f-icons
        class="f-mb-3"
        title="Or pay with card"
        :type="method"
        :count="5"
      />
    </transition>
    <transition name="fade">
      <!--card trustly sepa-->
      <component :is="method" :key="method" :payment-systems="paymentSystems" />
    </transition>
  </div>
</template>

<script>
import Card from '@/components/card'
import Trustly from '@/components/trustly'
import Sepa from '@/components/sepa'
import FIcons from '@/components/icons'
import { mapState } from '@/utils/store'
import FInfo from '@/components/info'

export default {
  components: {
    Card,
    Trustly,
    Sepa,
    FIcons,
    FInfo,
  },
  computed: {
    ...mapState('router', ['method']),
    ...mapState(['options']),
    paymentSystems() {
      return this.options[this.method]
    },
  },
}
</script>
