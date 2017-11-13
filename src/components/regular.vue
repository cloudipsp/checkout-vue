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
            <div class="col-xs-6" :class="{'has-error': errors.has('f-regular-every')}">
              <tooltip :text="errors.first('f-regular-every')" :enable="errors.has('f-regular-every')" placement="bottom">
              <input
                name="f-regular-every"
                v-validate="'required|numeric'"
                v-model="form.every"
                type="tel"
                class="form-control"
                id="f-regular-every"
              >
              <!--<div v-if="errors.has('f-regular-every')" class="f-error">{{ errors.first('f-regular-every') }}</div>-->
              </tooltip>
            </div>
            <div class="col-xs-6" :class="{'has-error': errors.has('f-regular-period')}">
              <tooltip :text="errors.first('f-regular-period')" :enable="errors.has('f-regular-period')">
              <select
                name="f-regular-period"
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
              <!--<div v-if="errors.has('f-regular-period')" class="f-error">{{ errors.first('f-regular-period') }}</div>-->
              </tooltip>
            </div>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('f-regular-amount')}">
          <label for="f-regular-amount">Сумма к оплате</label>
          <div class="input-group">
            <tooltip :text="errors.first('f-regular-amount')" :enable="errors.has('f-regular-amount')">
            <input
              name="f-regular-amount"
              v-validate="'required|decimal:2'"
              v-model="form.amount"
              data-vv-as="Сумма к оплате"
              type="tel"
              class="form-control"
              id="f-regular-amount"
            >
            <!--<div v-if="errors.has('f-regular-amount')" class="f-error">{{ errors.first('f-regular-amount') }}</div>-->
            </tooltip>
            <span class="input-group-addon">UAH</span>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('f-regular-start-time')}">
          <label for="f-regular-start-time">Начать с</label>
          <tooltip :text="errors.first('f-regular-start-time')" :enable="errors.has('f-regular-start-time')">
          <input
            name="f-regular-start-time"
            v-validate="'required'"
            v-model="form.start_time"
            data-vv-as="Начать с"
            type="date"
            class="form-control"
            id="f-regular-start-time"
          >
          <!--<div v-if="errors.has('f-regular-start-time')" class="f-error">{{ errors.first('f-regular-start-time') }}</div>-->
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
