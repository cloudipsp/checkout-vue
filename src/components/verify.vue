<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group" :class="{'has-error': errors.has('verification_code')}">
          <label for="verification_code">Проверочный код</label>
          <tooltip :text="errors.first('verification_code')" :enable="errors.has('verification_code')">
          <input
            name="verification_code"
            v-validate="{ rules: { required: true, digits: /EURT/.test(form.code) ? false : '4'} }"
            v-model="form.code"
            data-vv-as="Проверочный код"
            type="tel"
            class="form-control"
            id="verification_code"
            maxlength="4"
          >
          </tooltip>
        </div>
        <div class="form-group">
          <button @click="onSubmit()" type="button" class="btn btn-success btn-lg btn-block" :disabled="!valid">Продолжить</button>
        </div>
        <div class="form-group">
          <button @click="back()" type="button" class="btn btn-default btn-lg btn-block" >Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Tooltip from '@/components/tooltip'

  export default {
    inject: ['$validator'],
    props: ['onSubmit', 'valid'],
    data () {
      return {
        options: store.state.options,
        form: store.state.form,
        router: store.state.router
      }
    },
    created: function () {
      this.form.code = ''
    },
    components: {
      Tooltip
    },
    methods: {
      back: function () {
        this.router.page = 'payment-method'
        this.router.method = 'card'
      }
    }
  }
</script>
