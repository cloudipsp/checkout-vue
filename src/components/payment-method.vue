<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <f-price v-if="isTablet" />
    <f-button-pay-wallet position="center" />
    <transition name="fade">
      <f-icons
        class="f-mb-3"
        title="or_pay_with_card"
        :type="method"
        :count="5"
        under-sticky
        position="center"
      />
    </transition>
    <transition name="fade">
      <!--card banklinks_eu sepa receipt -->
      <component :is="method" :key="method" />
    </transition>
  </div>
</template>

<script>
import Card from '@/components/card'
import Banklinks_eu from '@/components/banklinks_eu'
import Sepa from '@/components/sepa'
import Receipt from '@/components/receipt'
import FIcons from '@/components/icons'
import { mapState } from '@/utils/store'
import FPrice from '@/components/price'
import Resize from '@/mixins/resize'

export default {
  components: {
    Card,
    Banklinks_eu,
    Sepa,
    Receipt,
    FIcons,
    FPrice,
  },
  mixins: [Resize],
  computed: {
    ...mapState('router', ['method']),
  },
}
</script>
