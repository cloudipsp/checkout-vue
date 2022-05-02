<template>
  <div v-if="show" class="f-subscription">
    <f-form-group
      v-if="show_switch"
      v-model="enabled_switch"
      name="switch"
      class="f-mb-1"
      component="checkbox"
      switch
    >
      <span v-text="$t('subscription')" />
    </f-form-group>
    <div v-else class="f-form-group" v-text="$t('subscription')" />
    <transition name="f-collapse">
      <div v-if="enabled_switch" class="f-subscription-wrapper">
        <input-amount
          class="f-form-group"
          name="amount"
          label="subscription_amount"
          subscription
          :disabled="readonly"
        />
        <f-form-group
          v-if="showTrial"
          key="trial"
          :value="trial"
          name="trial_period"
          :disabled="true"
        />
        <div v-if="showQuantity" class="f-row f-align-items-center f-quantity">
          <f-form-group
            v-if="unlimited"
            key="checked_unlimited"
            value="∞"
            class="f-col-12 f-col-ss-7"
            name="number_of_payments"
            :disabled="true"
          />
          <f-form-group
            v-else
            key="quantity"
            v-model.number="quantity"
            class="f-col-12 f-col-ss-7"
            name="number_of_payments"
            rules="required|numeric|one"
            type="tel"
            inputmode="numeric"
            :disabled="readonly"
          />
          <f-form-group
            v-if="showUnlimited"
            key="unlimited"
            v-model="unlimited"
            name="unlimited"
            component="checkbox"
            class="f-col"
            :disabled="readonly"
            size="sm"
          >
            <span v-text="$t('unlimited')" />
          </f-form-group>
        </div>
        <div class="f-input-group">
          <f-form-group
            v-model.number="every"
            class="f-col-4 f-col-ss-3"
            name="subscription_every"
            rules="required|numeric|one"
            type="tel"
            inputmode="numeric"
            :disabled="readonly"
            :hide-error="true"
            @show-error="onShowError"
          />
          <f-form-group
            v-model="period"
            component="select"
            class="f-col"
            :options="list"
            name="subscription_period"
            rules="required"
            :disabled="readonly"
            :hide-error="true"
            @show-error="onShowError"
          />
        </div>
        <div class="f-form-group">
          <transition name="f-slide-fade">
            <div v-if="error" class="f-error">
              {{ error }}
            </div>
          </transition>
        </div>
        <f-form-group
          v-if="showStartTime"
          v-model="start_time"
          component="date"
          name="subscription_start_time"
          rules="required"
          type="date"
          :disabled="readonly"
          :input-class="'f-form-control-start-time'"
          min="now"
        />
        <f-form-group
          v-if="showEndTime"
          key="end_time"
          v-model="end_time"
          component="date"
          name="subscription_end_time"
          rules="required"
          type="date"
          :disabled="readonly"
          :input-class="'f-form-control-start-time'"
          min="now"
        />
        <div
          v-if="showVerificationDesc"
          class="f-verification-desc"
          v-text="$t('verification_desc')"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { InputAmount } from '@/import'
import { mapState, mapStateGetSet } from '@/utils/store'
import { parseSelect } from '@/utils/sort'
import { createDate, formatYYYYMMDD } from '@/utils/date'

export default {
  components: {
    InputAmount,
  },
  data() {
    return {
      error: '',
      quantity_: 0,
      trial_period_: '',
      trial_quantity_: 0,
      start_time_: '',
      end_time_: '',
      start_time_created: '',
    }
  },
  computed: {
    ...mapState('options.subscription', {
      showQuantity: 'quantity',
      optionTrial: 'trial',
    }),
    ...mapState('options.subscription', ['periods', 'readonly']),
    ...mapStateGetSet('options.subscription', ['unlimited']),
    ...mapState('subscription', ['show', 'show_switch']),
    ...mapStateGetSet('subscription', ['enabled_switch']),
    ...mapStateGetSet('params', ['recurring']),
    ...mapStateGetSet('params.recurring_data', [
      'every',
      'start_time',
      'end_time',
      'quantity',
      'trial_period',
      'trial_quantity',
      'period',
    ]),
    ...mapState('params', ['amount']),
    ...mapState(['amount_readonly']),
    showTrial() {
      return this.optionTrial && !this.unlimited
    },
    showUnlimited() {
      return !this.readonly
    },
    showStartTime() {
      return this.unlimited || this.start_time
    },
    showEndTime() {
      return (
        (this.unlimited && !this.start_time_created && !this.readonly) ||
        this.end_time
      )
    },
    showVerificationDesc() {
      return this.showTrial && this.amount <= 100 && this.amount_readonly
    },
    trial() {
      return this.trial_quantity + ' ' + this.trial_period
    },
    list() {
      return this.periods.map(parseSelect)
    },
  },
  watch: {
    enabled_switch: 'watchEnable',
    unlimited: 'watchUnlimited',
  },
  created() {
    this.start_time_created = this.start_time
    this.setStartTime()

    if (!this.optionTrial) {
      this.clearTrial()
    }

    if (!this.showQuantity || this.unlimited) {
      this.clearQuantity()
    }

    this.saveTime()
    this.saveQuantity()
    this.saveTrial()
    this.watchUnlimited(this.unlimited)
  },
  methods: {
    setStartTime() {
      if (
        this.start_time ||
        (!this.start_time && this.unlimited && !this.optionTrial)
      ) {
        let value = createDate(this.start_time || createDate())
        let now = createDate()

        if (now > value) value = now

        this.start_time = formatYYYYMMDD(value)
      }
    },
    onShowError(show, error) {
      this.error = show && error
    },
    watchEnable(value) {
      this.recurring = value ? 'y' : 'n'
    },
    watchUnlimited(value) {
      if (value) {
        this.saveQuantity()
        this.saveTrial()
        this.clearQuantity()
        this.clearTrial()
        this.setTime()
      } else {
        this.saveTime()
        this.clearTime()
        this.setQuantity()
        this.setTrial()
      }
    },
    setTime() {
      this.start_time = this.start_time_
      this.end_time = this.end_time_
    },
    setQuantity() {
      this.quantity = this.quantity_
    },
    setTrial() {
      this.trial_period = this.trial_period_
      this.trial_quantity = this.trial_quantity_
    },
    saveTime() {
      this.start_time_ = this.start_time
      this.end_time_ = this.end_time
    },
    saveQuantity() {
      this.quantity_ = this.quantity
    },
    saveTrial() {
      this.trial_period_ = this.trial_period
      this.trial_quantity_ = this.trial_quantity
    },
    clearTime() {
      this.start_time = ''
      this.end_time = ''
    },
    clearQuantity() {
      this.quantity = 0
    },
    clearTrial() {
      this.trial_period = ''
      this.trial_quantity = 0
    },
  },
}
</script>
