<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="x6">Проверочный код</label>
          <input type="text" class="form-control" id="x6">
        </div>
        <div class="form-group">
          <button @click="onSubmit()" type="button" class="btn btn-success btn-block" :disabled="!valid">Продолжить</button>
        </div>
        <div class="form-group">
          <button @click="onBack('card')" type="button" class="btn btn-default btn-block" >Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['valid', 'onSubmit', 'onBack'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">

</style>
