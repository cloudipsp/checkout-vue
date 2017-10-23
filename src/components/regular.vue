<template>
  <div class="f-regular">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="text-center">
          <input type="checkbox" v-model="checked" class="f-checkbox-swipe" id="x12" />
          <label for="x12">Регулярный платеж</label>
        </div>
      </div>
    </div>
    <div class="f-block" v-if="checked">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="x9">Периодичность</label>
          <select class="form-control" id="x9">
            <option>1 месяц</option>
            <option>2 месяц</option>
            <option>3 месяц</option>
          </select>
        </div>
        <div class="form-group">
          <label for="x10">Сумма к оплате</label>
          <div class="input-group">
            <input type="text" class="form-control" id="x10">
            <span class="input-group-addon">UAH</span>
          </div>
        </div>
        <div class="form-group">
          <label for="x11">Начать с</label>
          <input type="date" class="form-control" id="x11">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        checked: false
      }
    }
  }
</script>

<style lang="less">

</style>
