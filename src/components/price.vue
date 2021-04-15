<template>
  <div v-if="show" class="f-price">
    <f-preloader :condition="showAmount" :size="sizePreloader">
      <template v-if="showAmountReadOnly">
        <f-amount
          :value="valueAmount"
          :currency="currency"
          amount-class="f-amount"
          currency-class="f-currency"
          sup
        />
        <table v-if="showFeeAmount" class="f-table">
          <tr>
            <td class="f-pr-3" v-text="$t('total_amount')" />
            <td>{{ totalAmount }}</td>
          </tr>
          <tr>
            <td class="f-pr-3" v-text="$t('fee')" />
            <td>{{ feeAmount }}</td>
          </tr>
        </table>
      </template>
      <template v-else>
        <input-amount name="amount" label="amount">
          <template #default="{ id }">
            <div ref="amount" class="f-form-control f-hidden">
              {{ totalAmount }}
            </div>
            <label v-if="showFeeAmount" :for="id" class="f-fee" :style="style">
              + {{ feeAmount }}
            </label>
          </template>
        </input-amount>
      </template>
    </f-preloader>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  data() {
    return {
      cacheAmount: 0,
      left: 0,
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
      return (
        this.showFee && this.amount && this.amount_with_fee && this.feeAmount
      )
    },
    showAmountReadOnly() {
      return this.amount_readonly || this.$route.name === 'success'
    },
    showAmount() {
      return this.amount || !this.amount_readonly
    },
    totalAmount() {
      return this.amount / 100
    },
    feeAmount() {
      return (this.amount_with_fee - this.cacheAmount) / 100
    },
    valueAmount() {
      return this.amount_with_fee || this.amount
    },
    sizePreloader() {
      return this.amount_readonly ? 'sm' : null
    },
    style() {
      return {
        left: `${this.left}px`,
      }
    },
  },
  watch: {
    fee: 'getAmountWithFee',
    amount: 'getAmountWithFee',
  },
  created() {
    this.getAmountWithFee()
  },
  mounted() {
    this.setCacheAmount()
  },
  methods: {
    setCacheAmount() {
      this.left = this.$refs.amount?.offsetWidth + 5
      this.cacheAmount = this.amount
    },
    getAmountWithFee() {
      this.store
        .getAmountWithFee()
        .then(this.setCacheAmount)
        .catch(errorHandler)
    },
  },
}
</script>
