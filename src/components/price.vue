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
        <table v-if="card_type_fee" class="f-table">
          <tr>
            <td class="f-pr-3" v-text="$t('total_amount')" />
            <td><f-amount :value="amount" /></td>
          </tr>
          <tr>
            <td class="f-pr-3" v-text="labelCardTypeFee" />
            <td><f-amount :value="card_type_fee" /></td>
          </tr>
        </table>
        <table v-else-if="showFeeAmount" class="f-table">
          <tr>
            <td class="f-pr-3" v-text="$t('total_amount')" />
            <td><f-amount :value="amount" /></td>
          </tr>
          <tr>
            <td class="f-pr-3" v-text="$t('fee')" />
            <td><f-amount :value="feeAmount" /></td>
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
              + <f-amount :value="feeAmount" />
            </label>
          </template>
        </input-amount>
      </template>
    </f-preloader>
  </div>
</template>

<script>
import FPreloader from '@/components/preloader'
import FAmount from '@/components/base/amount'
import { InputAmount } from '@/import'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FPreloader,
    FAmount,
    InputAmount,
  },
  props: {
    readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      cacheAmount: 0,
      left: 0,
    }
  },
  computed: {
    ...mapState([
      'amount_readonly',
      'amount_with_fee',
      'card_type_fee',
      'actual_amount',
    ]),
    ...mapState('options', { showFee: 'fee' }),
    ...mapState('params', ['currency', 'amount', 'fee', 'verification_type']),
    showFeeAmount() {
      return (
        this.showFee && this.amount && this.amount_with_fee && this.feeAmount
      )
    },
    showAmountReadOnly() {
      return this.amount_readonly || this.readonly
    },
    showAmount() {
      return this.amount || !this.amount_readonly
    },
    totalAmount() {
      return this.amount / 100
    },
    feeAmount() {
      return this.amount_with_fee - this.cacheAmount
    },
    valueAmount() {
      return this.actual_amount || this.amount_with_fee || this.amount
    },
    sizePreloader() {
      return this.amount_readonly ? 'sm' : null
    },
    style() {
      return {
        left: `${this.left}px`,
      }
    },
    labelCardTypeFee() {
      return this.card_type_fee < 0 ? this.$t('discount') : this.$t('fee')
    },
    show() {
      return this.verification_type !== 'amount'
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
