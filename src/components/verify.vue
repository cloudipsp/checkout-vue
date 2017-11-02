<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group" :class="{'has-error': errors.has('verification_code')}">
          <label for="verification_code">Проверочный код</label>
          <tooltip :text="errors.first('verification_code')" :enable="errors.has('verification_code')">
          <input
            name="verification_code"
            v-validate="'required|digits:4'"
            v-model="form.verification_code"
            data-vv-as="Проверочный код"
            type="tel"
            class="form-control"
            id="verification_code"
            maxlength="4"
          >
          </tooltip>
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
    },
    created: function () {
      this.form.verification_code = ''
    }
  }
</script>

<style lang="less">

</style>
