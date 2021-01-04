<template>
  <div v-if="show" class="f-price">
    <f-preloader :condition="amount" size="sm">
      <f-amount
        v-if="showAmountReadOnly"
        :value="valueAmount"
        :currency="currency"
        amount-class="f-amount"
        currency-class="f-currency"
        sup
      />
      <input-amount v-else name="amount" />
      <table v-if="showFeeAmount" class="f-table">
        <tr v-if="showTotal">
          <td class="f-pr-3" v-text="$t('total_amount')" />
          <td>{{ totalAmount }}</td>
        </tr>
        <tr>
          <td class="f-pr-3" v-text="$t('fee')" />
          <td>{{ feeAmount }}</td>
        </tr>
      </table>
    </f-preloader>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

let cacheFeeAmount = 0

export default {
  computed: {
    ...mapState(['verification_type', 'amount_readonly']),
    ...mapState('options', { showFee: 'fee' }),
    ...mapState('params', ['currency', 'amount', 'fee', 'amount_with_fee']),
    ...mapState('router', ['page']),
    show() {
      return this.verification_type !== 'amount'
    },
    showFeeAmount() {
      return this.showFee && this.amount && this.amount_with_fee
    },
    showAmountReadOnly() {
      return this.amount_readonly || this.page === 'success'
    },
    showTotal() {
      return this.amount_readonly
    },
    totalAmount() {
      return this.amount / 100
    },
    feeAmount() {
      if (this.amount_with_fee - this.amount < 0) return cacheFeeAmount

      return (cacheFeeAmount = (this.amount_with_fee - this.amount) / 100)
    },
    valueAmount() {
      return this.amount_with_fee || this.amount
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
