<template>
  <div v-if="show" class="f-price">
    <f-preloader :condition="showAmount" :size="sizePreloader">
      <template v-if="showAmountReadOnly">
        <template v-if="isTrialPeriod">
          <span v-text="$t('trial_period')" />: {{ trial_quantity }}
          {{ trial_period }}
        </template>
        <template v-else-if="isFirstPayment">
          <template v-if="start_time">
            <span v-text="$t('first_payment')" />:
            <f-date :value="start_time" />
          </template>
        </template>
        <template v-else>
          <f-amount
            :value="valueAmount"
            :currency="currency"
            amount-class="f-amount"
            currency-class="f-currency"
            sup
          />
          <table v-if="card_type_fee" class="f-table">
            <tr>
              <td class="f-pr-16" v-text="$t('total_amount')" />
              <td><f-amount :value="amount" /></td>
            </tr>
            <tr>
              <td class="f-pr-16" v-text="labelCardTypeFee" />
              <td><f-amount :value="card_type_fee" /></td>
            </tr>
          </table>
          <table v-else-if="showFeeAmount" class="f-table">
            <tr>
              <td class="f-pr-16" v-text="$t('total_amount')" />
              <td><f-amount :value="amount" /></td>
            </tr>
            <tr>
              <td class="f-pr-16" v-text="$t('fee')" />
              <td><f-amount :value="feeAmount" /></td>
            </tr>
          </table>
        </template>
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
import FDate from '@/components/base/date'
import { InputAmount } from '@/import'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { isNumber } from '@/utils/inspect'
import { timeoutMixin } from '@/mixins/timeout'

export default {
  components: {
    FPreloader,
    FAmount,
    InputAmount,
    FDate,
  },
  mixins: [timeoutMixin],
  props: {
    readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      cacheAmount: 0,
      left: 0,
      loading: false,
    }
  },
  computed: {
    ...mapState([
      'order',
      'amount_readonly',
      'amount_with_fee',
      'card_type_fee',
      'actual_amount',
    ]),
    ...mapState('options', { showFee: 'fee' }),
    ...mapState('params', [
      'currency',
      'amount',
      'fee',
      'verification_type',
      'recurring',
    ]),
    ...mapState('options.subscription', ['trial', 'unlimited']),
    ...mapState('params.recurring_data', [
      'trial_period',
      'trial_quantity',
      'start_time',
    ]),
    showFeeAmount() {
      return (
        this.showFee &&
        this.cacheAmount === this.amount &&
        !this.loading &&
        this.amount &&
        this.amount_with_fee &&
        this.feeAmount
      )
    },
    showAmountReadOnly() {
      return this.amount_readonly || this.readonly
    },
    showAmount() {
      return isNumber(this.amount) || !this.amount_readonly
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
      return this.amount_readonly ? '38' : null
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
      return !this.verification_type
    },
    isSubscription() {
      return this.recurring === 'y'
    },
    isTrial() {
      return this.trial && !this.unlimited
    },
    isTrialPeriod() {
      return !this.valueAmount && this.isSubscription && this.isTrial
    },
    isFirstPayment() {
      return !this.valueAmount && this.isSubscription && !this.isTrial
    },
  },
  watch: {
    fee: 'getAmountWithFee',
    amount: 'getAmountWithFee',
  },
  created() {
    this.getAmountWithFee()
  },
  methods: {
    getAmountWithFee() {
      this.timeout('request', 300)
    },
    request() {
      if (this.loading) return
      this.loading = true
      this.cacheAmount = this.amount

      this.store
        .getAmountWithFee()
        .finally(() => {
          this.loading = false
          this.left = this.$refs.amount?.offsetWidth + 5
        })
        .catch(errorHandler)
    },
  },
}
</script>
