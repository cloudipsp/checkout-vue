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
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-html="$t('pay', args)" />
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
    ...mapState('params', ['amount', 'amount_with_fee', 'currency']),
    disabled() {
      return !!this.errors.items.length && this.isSubmit
    },
    fullAmount() {
      return (this.amount_with_fee || this.amount) / 100
    },
    args() {
      if (this.verification_type === 'amount') return []

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
