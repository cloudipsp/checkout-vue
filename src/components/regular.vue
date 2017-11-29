<template>
  <div class="f-regular" :style="{ display: options.hide ? 'none' : 'block' }">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="f-text-center">
          <input type="checkbox" v-model="options.open" class="f-checkbox-swipe" id="f-regular-swipe" />
          <label :class="[css.cl]" for="f-regular-swipe">Регулярный платеж</label>
        </div>
      </div>
    </div>
    <div class="f-block" v-if="options.open">
      <div class="f-block-sm">
        <div class="f-row">
          <div class="f-col-xs-6">
            <input-text name="regular-every" field="every" label="Периодичность" validate="required|numeric" placement="bottom" type="tel" :form="form"></input-text>
          </div>
          <div class="f-col-xs-6">
            <input-select :options="options.period" name="regular-period" field="period" validate="required" :form="form"></input-select>
          </div>
        </div>
        <input-amount name="regular-amount" field="amount" label="Сума к оплате" :form="form"></input-amount>
        <input-text name="regular-start-time" field="start_time" label="Начать с" validate="required" type="date" :form="form"></input-text>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import InputAmount from '@/components/input-amount'
  import InputText from '@/components/input-text'
  import InputSelect from '@/components/input-select'

  export default {
    inject: ['$validator'],
    data () {
      return {
        options: store.state.regular,
        form: store.state.form.recurring_data,
        css: store.state.css
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
      InputText,
      InputSelect
    }
  }
</script>
