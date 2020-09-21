<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <transition name="fade-enter">
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
import { mapState } from '@/utils/store'

export default {
  components: {
    Card,
    Banklinks_eu,
    Sepa,
    Receipt,
  },
  computed: {
    ...mapState('router', ['method']),
  },
}
</script>
