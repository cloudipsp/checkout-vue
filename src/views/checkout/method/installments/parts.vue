<template>
  <f-form-group v-bind="attrs" v-on="$listeners" @input="input" />
</template>

<script>
import FFormGroup from '@/components/form/group.vue'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FFormGroup,
  },
  props: {
    paymentId: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    ...mapState('params', [
      'amount',
      'currency',
      'token',
      'landing_token',
      'button',
      'merchant_id',
      'promocode',
    ]),
    attrs() {
      return {
        ...this.$attrs,
        component: 'select2',
        name: 'payments',
        label: this.$t('Payments'),
      }
    },
  },
  watch: {
    amount: 'calc',
    currency: 'calc',
    promocode: 'calc',
  },
  methods: {
    input(value) {
      this.store
        .sendRequest(
          'api.checkout.partial',
          'calc',
          {
            payment_id: this.paymentId,
            payment_parts: value,
            amount: this.amount,
            currency: this.currency,
            token: this.token,
            landing_token: this.landing_token,
            button: this.button,
            merchant_id: this.merchant_id,
            promocode: this.promocode,
          },
          { cached: true }
        )
        .then(model => {
          this.$emit('amount', model.attr('amount_partial'))
        })
    },
    calc() {
      this.input(this.$attrs.value)
    },
  },
}
</script>
