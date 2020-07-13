<template>
  <div v-if="show" class="f-regular">
    <input-switch v-model="open" label="regular" />
    <transition name="collapse">
      <div v-if="open" class="f-regular-wrapper">
        <input-amount
          class="f-regular-amount"
          name="regular_amount"
          field="amount"
          recurring
          :readonly="readonly"
        />
        <div class="f-row f-regular-row">
          <input-text
            class="f-col f-regular-col"
            name="regular_every"
            field="every"
            validate="required|numeric"
            placement="bottom"
            type="tel"
            inputmode="numeric"
            recurring
            :readonly="readonly"
            :hide-error="true"
            :input-class="'f-form-control-every'"
            @show-error="onShowError"
          />

          <input-select
            class="f-col f-regular-col"
            :list="periods"
            name="regular_period"
            field="period"
            validate="required"
            recurring
            :readonly="readonly"
            :hide-error="true"
            :input-class="'f-form-control-period'"
            @show-error="onShowError"
          />
          <input-text
            class="f-col f-regular-col"
            name="regular_start_time"
            field="start_time"
            validate="required"
            type="date"
            recurring
            :readonly="readonly"
            :hide-error="true"
            :input-class="'f-form-control-start-time'"
            @show-error="onShowError"
          />
        </div>
        <transition name="slide-fade">
          <div v-if="error" class="f-error">
            {{ error }}
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  data() {
    return {
      error: '',
    }
  },
  computed: {
    ...mapState('regular', {
      periods: 'period',
      show: 'insert',
    }),
    ...mapStateGetSet('regular', ['open']),
    ...mapStateGetSet('params', ['recurring']),
    ...mapState('params.recurring_data', ['period', 'every', 'readonly']),
    ...mapStateGetSet('params.recurring_data', ['start_time', 'end_time']),
  },
  watch: {
    open: {
      handler(value) {
        this.recurring = value ? 'y' : 'n'
      },
      immediate: true,
    },
  },
  created() {
    this.end_time = this.recurringEndTime()
    this.start_time = this.recurringStartTime()
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
      } else {
        return this.getFuturePeriod(this.period, this.every)
      }
    },
    recurringEndTime() {
      if (this.end_time) {
        return this.recurringTime('end_time')
      } else {
        return this.getDefaultEndDate()
      }
    },
    getFuturePeriod(period, every) {
      let d = new Date()
      switch (period) {
        case 'day':
          d.setDate(d.getDate() + 1 * every)
          break
        case 'week':
          d.setDate(d.getDate() + 7 * every)
          break
        case 'month':
          d.setMonth(d.getMonth() + 1 * every)
          break
        case 'year':
          d.setFullYear(d.getFullYear() + 1 * every)
          break
      }
      return this.getDateFormat(d)
    },
    getDefaultEndDate() {
      let d = new Date()
      d.setFullYear(d.getFullYear() + 5)
      return this.getDateFormat(d)
    },
    onShowError(show, error) {
      this.error = show && error
    },
  },
}
</script>
