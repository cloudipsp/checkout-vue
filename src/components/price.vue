<template>
  <div v-if="show" class="f-price">
    <div v-if="amount_readonly">
      <span class="f-amount"
        >{{ integerAmount }}<sup>{{ fractionalAmount }}</sup></span
      >
      <span v-t="currency" class="f-currency" />
    </div>
    <input-amount v-else name="amount" />
    <div v-if="showFeeAmount">
      <div class="f-row">
        <div v-t="'total_amount'" class="f-col f-fee-key" />
        <div class="f-col">{{ totalAmount }}</div>
      </div>
      <div class="f-row">
        <div v-t="'fee'" class="f-col f-fee-key" />
        <div class="f-col">{{ feeAmount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

let cacheFeeAmount = 0

export default {
  data() {
    return {
      separator: '.',
    }
  },
  computed: {
    ...mapState(['verification_type', 'amount_readonly']),
    ...mapState('options', { showFee: 'fee' }),
    ...mapState('params', ['currency', 'amount', 'fee', 'amount_with_fee']),
    show() {
      return this.verification_type !== 'amount'
    },
    showFeeAmount() {
      return this.showFee && this.amount && this.amount_with_fee
    },
    fullAmount() {
      let amount = this.amount_with_fee || this.amount
      let result = amount / 100
      try {
        result = new Intl.NumberFormat().format(result)
        // eslint-disable-next-line no-empty
      } catch (e) {}

      if (amount % 100 === 0) {
        result = result + this.separator + '00'
      } else if (amount % 10 === 0) {
        result = result + '0'
      }

      return result
    },
    integerAmount() {
      return String(this.fullAmount).slice(0, -2)
    },
    fractionalAmount() {
      return String(this.fullAmount).slice(-2)
    },
    totalAmount() {
      return this.amount / 100
    },
    feeAmount() {
      if (this.amount_with_fee - this.amount < 0) return cacheFeeAmount

      return (cacheFeeAmount = (this.amount_with_fee - this.amount) / 100)
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
  created() {
    try {
      this.separator = new Intl.NumberFormat().format(0.1)[1]
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },
}
</script>
