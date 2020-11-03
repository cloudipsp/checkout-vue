<template>
  <div v-if="show" class="f-subscription">
    <f-form-group
      v-if="show_switch"
      v-model="enabled_switch"
      class="f-mb-1"
      component="checkbox"
      switch
    >
      <span v-t="'subscription'" />
    </f-form-group>
    <div v-else v-t="'subscription'" class="f-form-group" />
    <transition name="collapse">
      <div v-show="enabled_switch" class="f-subscription-wrapper">
        <input-amount
          class="f-subscription-amount"
          name="subscription_amount"
          field="amount"
          recurring
          :disabled="readonly"
        />
        <f-form-group
          v-if="showTrial"
          key="trial"
          :value="trial"
          label="trial_period"
          :disabled="true"
        />
        <div v-if="showQuantity" class="f-row">
          <f-form-group
            v-if="unlimited"
            key="checked_unlimited"
            value="∞"
            class="f-col-7"
            label="number_of_payments"
            :disabled="true"
          />
          <f-form-group
            v-else
            key="quantity"
            v-model.number="quantity"
            class="f-col-7"
            label="number_of_payments"
            rules="required|numeric|one"
            type="tel"
            inputmode="numeric"
            :disabled="readonly"
          />
          <f-form-group
            key="unlimited"
            v-model="unlimited"
            component="checkbox"
            class="f-col-5 f-subscription-unlimited"
            :disabled="readonly"
          >
            <span v-t="'unlimited'" />
          </f-form-group>
        </div>
        <div class="f-input-group">
          <f-form-group
            v-model.number="every"
            class="f-col-3"
            label="subscription_every"
            rules="required|numeric|one"
            type="tel"
            inputmode="numeric"
            :disabled="readonly"
            :hide-error="true"
            :input-class="'f-form-control-every'"
            @show-error="onShowError"
          />
          <f-form-group
            v-model="period"
            component="select"
            class="f-col-9"
            :options="list"
            label="subscription_period"
            rules="required"
            :disabled="readonly"
            :hide-error="true"
            :input-class="'f-form-control-period'"
            @show-error="onShowError"
          />
        </div>
        <div class="f-form-group">
          <transition name="slide-fade">
            <div v-if="error" class="f-error">
              {{ error }}
            </div>
          </transition>
        </div>
        <f-form-group
          v-if="showStartTime"
          v-model="start_time"
          component="date"
          label="subscription_start_time"
          rules="required"
          type="date"
          :disabled="readonly"
          :input-class="'f-form-control-start-time'"
        />
        <f-form-group
          v-if="showEndTime"
          key="end_time"
          v-model="end_time"
          component="date"
          label="subscription_end_time"
          rules="required"
          type="date"
          :disabled="readonly"
          :input-class="'f-form-control-start-time'"
        />
        <div
          v-if="showVerificationDesc"
          v-t="'verification_desc'"
          class="f-verification-desc"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import { parseSelect } from '@/utils/sort'

export default {
  data() {
    return {
      error: '',
      quantity_: 0,
      trial_period_: '',
      trial_quantity_: 0,
      start_time_: '',
      end_time_: '',
    }
  },
  computed: {
    ...mapState('options.subscription', {
      showQuantity: 'quantity',
      optionTrial: 'trial',
    }),
    ...mapState('options.subscription', ['periods']),
    ...mapStateGetSet('options.subscription', ['unlimited']),
    ...mapState('subscription', ['show', 'show_switch']),
    ...mapStateGetSet('subscription', ['enabled', 'enabled_switch']),
    ...mapStateGetSet('params', ['recurring']),
    ...mapState('params.recurring_data', ['readonly']),
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
    showStartTime() {
      return this.unlimited || this.start_time
    },
    showEndTime() {
      return this.unlimited || this.end_time
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
    enabled: {
      handler(value) {
        this.recurring = value ? 'y' : 'n'
      },
      immediate: true,
    },
    enabled_switch(value) {
      this.enabled = value
    },
    unlimited(value) {
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
  },
  created() {
    this.end_time = this.recurringEndTime()
    this.start_time = this.recurringStartTime()

    if (!this.optionTrial) {
      this.clearTrial()
    }

    if (!this.showQuantity || this.unlimited) {
      this.clearQuantity()
    }

    this.saveTime()
    this.saveQuantity()
    this.saveTrial()
  },
  methods: {
    getDate(date) {
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return date
    },
    getDateFormat(d) {
      return (
        d.getFullYear() +
        '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + d.getDate()).slice(-2)
      )
    },
    recurringTime(field) {
      let date = this[field]
      let value = this.getDate(new Date(date))
      let now = this.getDate(new Date())
      if (now > value) value = now
      return this.getDateFormat(value)
    },
    recurringStartTime() {
      if (this.start_time) {
        return this.recurringTime('start_time')
      }
    },
    recurringEndTime() {
      if (this.end_time) {
        return this.recurringTime('end_time')
      }
    },
    onShowError(show, error) {
      this.error = show && error
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
