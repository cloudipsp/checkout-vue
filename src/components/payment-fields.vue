<template>
  <div class="f-fields">
    <div class="f-block f-block-hr">
      <div class="form-group">
        <label for="x3">Фио</label>
        <input type="text" class="form-control" id="x3">
      </div>
      <div class="row">
        <div class="form-group col-xs-6">
          <label for="x4">Email</label>
          <input type="text" class="form-control" id="x4">
        </div>
        <div class="form-group col-xs-6">
          <label for="x5">Телефон</label>
          <input type="text" class="form-control" id="x5">
        </div>
      </div>
    </div>
    <div class="f-block f-block-hr">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="x1">Сума к оплате</label>
          <input type="text" class="form-control" id="x1">
        </div>
        <div class="form-group">
          <label for="x2">Номер договора</label>
          <div class="input-group">
            <input type="text" class="form-control" id="x2">
            <span class="input-group-addon">UAH</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="less">
  .payment-fields{

  }
</style>
