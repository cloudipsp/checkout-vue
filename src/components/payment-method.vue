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
        under-sticky
      />
    </transition>
    <transition name="fade">
      <!--card banklinks_eu sepa-->
      <component :is="method" :key="method" />
    </transition>
  </div>
</template>

<script>
import Card from '@/components/card'
import Banklinks_eu from '@/components/banklinks_eu'
import Sepa from '@/components/sepa'
import FIcons from '@/components/icons'
import { mapState } from '@/utils/store'

export default {
  components: {
    Card,
    Banklinks_eu,
    Sepa,
    FIcons,
  },
  computed: {
    ...mapState('router', ['method']),
  },
}
</script>
