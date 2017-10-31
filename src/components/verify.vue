<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group" :class="{'has-error': errors.has('verification_code')}">
          <label for="verification_code">Проверочный код</label>
          <input name="verification_code" v-validate="'required|digits:4'" type="text" class="form-control" id="verification_code">
        </div>
        <div class="form-group">
          <button @click="onSubmit()" type="button" class="btn btn-success btn-block" :disabled="!valid">Продолжить</button>
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
    inject: ['$validator'],
    props: ['options', 'onSubmit', 'form', 'valid'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">

</style>
