<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="x6">Проверочный код</label>
          <input type="text" class="form-control" id="x6">
        </div>
        <div class="form-group">
          <button @click="onSubmit()" type="button" class="btn btn-success btn-block" :disabled="!options.valid">Продолжить</button>
        </div>
        <div class="form-group">
          <router-link :to="{ name: 'method', params: { method: 'card' }}" type="button" class="btn btn-default btn-block" >Отменить</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['options', 'onSubmit'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">

</style>
