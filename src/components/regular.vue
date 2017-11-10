<template>
  <div class="f-regular">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="text-center">
          <input type="checkbox" v-model="options.open" class="f-checkbox-swipe" id="f-regular-swipe" />
          <label for="f-regular-swipe">Регулярный платеж</label>
        </div>
      </div>
    </div>
    <div class="f-block" v-if="options.open">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="f-regular-every">Периодичность</label>
          <div class="row">
            <div class="col-xs-6" :class="{'has-error': errors.has('every')}">
              <tooltip :text="errors.first('every')" :enable="errors.has('every')" placement="bottom">
              <input
                name="every"
                v-validate="'required|numeric'"
                v-model="form.every"
                type="tel"
                class="form-control"
                id="f-regular-every"
              >
              <!--<div v-if="errors.has('every')" class="f-error">{{ errors.first('every') }}</div>-->
              </tooltip>
            </div>
            <div class="col-xs-6" :class="{'has-error': errors.has('period')}">
              <tooltip :text="errors.first('period')" :enable="errors.has('period')">
              <select
                name="period"
                v-validate="'required'"
                v-model="form.period"
                class="form-control"
                id="f-regular-period"
              >
                <option value="" selected="selected" disabled="disabled">---</option>
                <option value="day">День</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="year">Год</option>
              </select>
              <!--<div v-if="errors.has('period')" class="f-error">{{ errors.first('period') }}</div>-->
              </tooltip>
            </div>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('amount')}">
          <label for="f-regular-amount">Сумма к оплате</label>
          <div class="input-group">
            <tooltip :text="errors.first('amount')" :enable="errors.has('amount')">
            <input
              name="amount"
              v-validate="'required|decimal:2'"
              v-model="form.amount"
              data-vv-as="Сумма к оплате"
              type="tel"
              class="form-control"
              id="f-regular-amount"
            >
            <!--<div v-if="errors.has('amount')" class="f-error">{{ errors.first('amount') }}</div>-->
            </tooltip>
            <span class="input-group-addon">UAH</span>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('start_time')}">
          <label for="f-regular-start-time">Начать с</label>
          <tooltip :text="errors.first('start_time')" :enable="errors.has('start_time')">
          <input
            name="start_time"
            v-validate="'required'"
            v-model="form.start_time"
            data-vv-as="Начать с"
            type="date"
            class="form-control"
            id="f-regular-start-time"
          >
          <!--<div v-if="errors.has('start_time')" class="f-error">{{ errors.first('start_time') }}</div>-->
          </tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    props: ['options'],
    inject: ['$validator'],
    data () {
      return {
        form: store.state.form.recurring_data
      }
    }
  }
</script>
