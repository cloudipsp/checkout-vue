<template>
  <div v-if="show" class="f-price">
    <f-preloader :condition="showAmount" :size="sizePreloader">
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
        <template v-if="showAmountReadOnly">
          <f-amount
            :value="total_amount"
            :currency="currency"
            amount-class="f-amount"
            currency-class="f-currency"
            sup
          />
        </template>
        <template v-else>
          <input-amount name="amount" label="amount">
            <template #default="{ id }">
              <div ref="amount" class="f-form-control f-hidden">
                {{ totalAmount }}
              </div>
              <label
                v-if="showFeeAmount"
                :for="id"
                class="f-fee"
                :style="style"
              >
                + <f-amount :value="fee_amount" />
              </label>
            </template>
          </input-amount>
        </template>
        <table v-if="showFee" class="f-table">
          <tr>
            <td class="f-pr-16" v-text="$t('amount')" />
            <td><f-amount :value="actualAmount" no-bold /></td>
          </tr>
          <tr v-if="showDiscount">
            <td class="f-pr-16" v-text="$t('discount')" />
            <td>
              <span v-if="discount_percent">{{ discountPercent }}</span>
              <span v-if="discount_percent && discount_amount"> + </span>
              <f-amount
                v-if="discount_amount"
                :value="discount_amount"
                no-bold
              />
            </td>
          </tr>
          <tr v-if="fee_amount">
            <td class="f-pr-16" v-text="$t('fee')" />
            <td><f-amount :value="fee_amount" no-bold /></td>
          </tr>
          <tr>
            <td class="f-pr-16" v-text="$t('total_amount')" />
            <td><f-amount :value="total_amount" no-bold /></td>
          </tr>
        </table>
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
      actualAmount: 0,
      left: 0,
      loading: false,
    }
  },
  computed: {
    ...mapState([
      'ready',
      'discount_percent',
      'discount_amount',
      'fee_amount',
      'total_amount',
    ]),
    ...mapState('options', ['amount_readonly', 'fee']),
    ...mapState('params', [
      'currency',
      'amount',
      'verification_type',
      'recurring',
    ]),
    ...mapState('options.subscription', ['trial', 'unlimited']),
    ...mapState('params.recurring_data', [
      'trial_period',
      'trial_quantity',
      'start_time',
    ]),
    showFee() {
      return this.fee && (this.showDiscount || this.fee_amount)
    },
    showFeeAmount() {
      return this.showFee && this.actualAmount === this.amount
    },
    showAmountReadOnly() {
      return this.amount_readonly || this.readonly
    },
    showAmount() {
      return this.ready || !this.amount_readonly
    },
    showDiscount() {
      return this.discount_percent || this.discount_amount
    },
    totalAmount() {
      return this.amount / 100
    },
    sizePreloader() {
      return this.amount_readonly ? '38' : null
    },
    style() {
      return {
        left: `${this.left}px`,
      }
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
      return (
        this.amount_readonly &&
        !this.total_amount &&
        this.isSubscription &&
        this.isTrial
      )
    },
    isFirstPayment() {
      return (
        this.amount_readonly &&
        !this.total_amount &&
        this.isSubscription &&
        !this.isTrial
      )
    },
    discountPercent() {
      return parseFloat(this.discount_percent * 100).toFixed(2) * 1 + '%'
    },
  },
  watch: {
    amount: 'feeCalc',
    ready: 'setLeft',
  },
  mounted() {
    this.setLeft()
  },
  methods: {
    feeCalc() {
      if (!this.ready) return

      this.timeout('request', 300)
    },
    request() {
      if (this.loading) return
      this.loading = true

      this.store
        .feeCalc()
        .then(this.setLeft)
        .finally(() => {
          this.loading = false
        })
        .catch(errorHandler)
    },
    setLeft() {
      this.actualAmount = this.amount
      this.left = this.$refs.amount?.offsetWidth + 5
    },
  },
}
</script>
