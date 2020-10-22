<template>
  <f-button
    v-if="show"
    class="f-button-pay"
    variant="success"
    :disabled="disabled"
    size="lg"
    block
    @click="click"
  >
    <span v-t="'pay'" />
    <span v-if="showAmount">
      <b> {{ fullAmount }}</b> {{ $t(currency) }}
    </span>
  </f-button>
</template>

<script>
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  inject: ['$validator', 'submit'],
  computed: {
    ...mapState(['verification_type', 'isSubmit']),
    ...mapState('options', { show: 'button' }),
    ...mapState('options', ['show_button_amount']),
    ...mapState('params', ['amount', 'amount_with_fee', 'currency']),
    disabled() {
      return !!this.errors.items.length && this.isSubmit
    },
    fullAmount() {
      return (this.amount_with_fee || this.amount) / 100
    },
    showAmount() {
      return this.verification_type !== 'amount' && this.show_button_amount
    },
  },
  methods: {
    click() {
      this.submit()
        .then(model => {
          this.$emit('success', model)
        })
        .catch(errorHandler)
    },
  },
}
</script>
