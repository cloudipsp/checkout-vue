<template>
  <div :class="['f-payment-method', 'f-payment-method-' + method]">
    <fields v-if="options.fields && !store.state.need_verify_code" />
    <transition name="fade">
      <component
        :is="method"
        :key="method"
        :icons="options[method + '_icons']"
        :payment-systems="options[method]"
      />
    </transition>
    <f-regular />
    <f-offer />
    <f-pay-button />
  </div>
</template>

<script>
import Card from '@/components/card'
import Emoney from '@/components/emoney'
import Ibank from '@/components/ibank'
import Trustly from '@/components/trustly'
import Cash from '@/components/cash'
import Sepa from '@/components/sepa'
import Fields from '@/components/payment-fields'

export default {
  components: {
    Card,
    Emoney,
    Ibank,
    Trustly,
    Cash,
    Sepa,
    Fields,
  },
  data() {
    return {}
  },
  computed: {
    method: function() {
      return this.router.method
    },
  },
}
</script>
