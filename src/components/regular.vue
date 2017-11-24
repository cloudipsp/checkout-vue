<template>
  <div class="f-regular" :style="{ display: options.hide ? 'none' : 'block' }">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="f-text-center">
          <input type="checkbox" v-model="options.open" class="f-checkbox-swipe" id="f-regular-swipe" />
          <label for="f-regular-swipe">Регулярный платеж</label>
        </div>
      </div>
    </div>
    <div class="f-block" v-if="options.open">
      <div class="f-block-sm">
        <div class="f-form-group">
          <label for="f-regular-every">Периодичность</label>
          <div class="f-row">
            <div class="f-col-xs-6" :class="{'f-has-error': errors.has('f-regular-every')}">
              <tooltip :text="errors.first('f-regular-every')" :enable="errors.has('f-regular-every')" placement="bottom">
              <input
                name="f-regular-every"
                v-validate="'required|numeric'"
                v-model="form.every"
                type="tel"
                class="f-form-control"
                id="f-regular-every"
              >
              </tooltip>
            </div>
            <div class="f-col-xs-6" :class="{'f-has-error': errors.has('f-regular-period')}">
              <tooltip :text="errors.first('f-regular-period')" :enable="errors.has('f-regular-period')">
              <select
                name="f-regular-period"
                v-validate="'required'"
                v-model="form.period"
                class="f-form-control"
                id="f-regular-period"
              >
                <option value="" selected="selected" disabled="disabled">---</option>
                <option value="day">День</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="year">Год</option>
              </select>
              </tooltip>
            </div>
          </div>
        </div>
        <input-amount class="f-form-group" name="f-regular-amount" field="amount" label="Сума к оплате" :form="form"></input-amount>
        <div class="f-form-group" :class="{'f-has-error': errors.has('f-regular-start-time')}">
          <label for="f-regular-start-time">Начать с</label>
          <tooltip :text="errors.first('f-regular-start-time')" :enable="errors.has('f-regular-start-time')">
          <input
            name="f-regular-start-time"
            v-validate="'required'"
            v-model="form.start_time"
            data-vv-as="Начать с"
            type="date"
            class="f-form-control"
            id="f-regular-start-time"
          >
          </tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import InputAmount from '@/components/input-amount'
  import Tooltip from '@/components/tooltip'

  export default {
    inject: ['$validator'],
    data () {
      return {
        options: store.state.options.regular,
        form: store.state.form.recurring_data
      }
    },
    created: function () {
      this.form.end_time = this.recurringEndTime()
      this.form.start_time = this.recurringStartTime()
    },
    watch: {
      'form.period': function () {
        this.form.start_time = this.getFuturePeriod(this.form.period, this.form.every)
      },
      'form.every': function () {
        this.form.start_time = this.getFuturePeriod(this.form.period, this.form.every)
      }
    },
    methods: {
      getDate: function (date) {
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
      },
      getDateFormat: function (d) {
        return d.getFullYear() + '-' + (('0' + (d.getMonth() + 1)).slice(-2)) + '-' + (('0' + d.getDate()).slice(-2))
      },
      recurringTime: function (field) {
        let date = this.form[field] || new Date()
        let value = this.getDate(new Date(date))
        let now = this.getDate(new Date())
        if (now > value) value = now
        return this.getDateFormat(value)
      },
      recurringStartTime: function () {
        if (this.form.start_time) {
          return this.recurringTime('start_time')
        } else {
          return this.getFuturePeriod(this.form.period, this.form.every)
        }
      },
      recurringEndTime: function () {
        if (this.form.end_time) {
          return this.recurringTime('end_time')
        } else {
          return this.getDefaultEndDate()
        }
      },
      getFuturePeriod: function (period, every) {
        let d = new Date()
        switch (period) {
          case 'day':
            d.setDate(d.getDate() + (1 * every))
            break
          case 'week':
            d.setDate(d.getDate() + (7 * every))
            break
          case 'month':
            d.setMonth(d.getMonth() + (1 * every))
            break
          case 'year':
            d.setFullYear(d.getFullYear() + (1 * every))
            break
        }
        return this.getDateFormat(d)
      },
      getDefaultEndDate: function () {
        let d = new Date()
        d.setFullYear(d.getFullYear() + 5)
        return this.getDateFormat(d)
      }
//      recurringDefaultPeriod: function () {
//        let every = this.attr('recurring.every') || '1'
//        let period = this.attr('recurring.period') || 'month'
//        return [every, period].join(',')
//      }
    },
    components: {
      InputAmount,
      Tooltip
    }
  }
</script>
