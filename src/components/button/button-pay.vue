<template>
  <f-button
    v-if="show"
    class="f-button-pay"
    variant="success"
    :disabled="disabled"
    size="lg"
    block
    :text="{ path: 'pay', args: args }"
    @click="click"
  />
</template>

<script>
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  inject: ['$validator', 'submit'],
  computed: {
    ...mapState(['verification_type']),
    ...mapState({ isSubmit: 'submit' }),
    ...mapState('options', { show: 'button' }),
    ...mapState('params', ['amount', 'amount_with_fee', 'currency']),
    disabled() {
      return !!this.errors.items.length && this.isSubmit
    },
    fullAmount() {
      if (!this.amount) {
        return false
      }
      return (this.amount_with_fee || this.amount) / 100
    },
    args() {
      if (this.verification_type === 'amount') return []

      if (!this.fullAmount) return []

      return [this.fullAmount, this.$t(this.currency)]
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
