<template>
  <div v-if="show" class="f-fee">
    <div>{{ amountString }}</div>
    <div v-if="feeAmount">{{ feeString }}</div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

let cacheFeeAmount = 0

export default {
  computed: {
    ...mapState('options', { show: 'fee' }),
    ...mapState('params', ['currency', 'amount', 'fee', 'amount_with_fee']),
    amountString() {
      return [
        this.$t('amount'),
        this.amount / 100,
        this.currencyTranslate,
      ].join(' ')
    },
    feeAmount() {
      if (!this.amount) return
      if (!this.amount_with_fee) return
      if (this.amount_with_fee - this.amount < 0) return cacheFeeAmount

      return (cacheFeeAmount = (this.amount_with_fee - this.amount) / 100)
    },
    feePercent() {
      return parseFloat(String(this.fee * 100)).toFixed(2)
    },
    feeString() {
      return [
        this.$t('fee'),
        this.feeAmount,
        this.currencyTranslate,
        '(' + this.feePercent + '%)',
      ].join(' ')
    },
    currencyTranslate() {
      return this.$t(this.currency)
    },
  },
  watch: {
    fee() {
      this.store.getAmountWithFee()
    },
    amount() {
      this.store.getAmountWithFee()
    },
  },
}
</script>
