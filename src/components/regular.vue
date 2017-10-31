<template>
  <div class="f-regular">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="text-center">
          <input type="checkbox" v-model="checked" class="f-checkbox-swipe" id="f-checkbox-swipe" />
          <label for="f-checkbox-swipe">Регулярный платеж</label>
        </div>
      </div>
    </div>
    <div class="f-block" v-if="checked">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="x9">Периодичность</label>
          <div class="row">
            <div class="col-xs-6" :class="{'has-error': errors.has('every') }">
              <input name="every" v-validate="'required'" v-model="model.every" type="tel" class="form-control" id="x13">
            </div>
            <div class="col-xs-6" :class="{'has-error': errors.has('period') }">
              <select name="period" v-validate="'required'" v-model="model.period" class="form-control" id="x9">
                <option value="" selected="selected" disabled="disabled">---</option>
                <option value="day">День</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="year">Год</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('amount') }">
          <label for="x10">Сумма к оплате</label>
          <div class="input-group">
            <input name="amount" v-validate="'required'" v-model="model.amount" type="tel" class="form-control" id="x10">
            <span class="input-group-addon">UAH</span>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('start_time') }">
          <label for="x11">Начать с</label>
          <input name="start_time" v-validate="'required'" v-model="model.start_time" type="date" class="form-control" id="x11">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ValidateChild from './validate-child'

  export default {
    name: 'recurring_data',
    mixins: [ValidateChild],
    data () {
      return {
        checked: false,
        model: {
          every: 1,
          period: 'day',
          amount: 0,
          start_time: null
        }
      }
    }
  }
</script>

<style lang="less">

</style>
