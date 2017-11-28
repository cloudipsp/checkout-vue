<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <input-text name="verification-code" field="code" label="Проверочный код" :validate="validCode" type="tel" :maxlength="4"></input-text>
        <div class="f-form-group">
          <button @click="onSubmit()" type="button" class="f-btn f-btn-success f-btn-lg f-btn-block" :disabled="!valid">Продолжить</button>
        </div>
        <div class="f-form-group">
          <button @click="back()" type="button" class="f-btn f-btn-default f-btn-lg f-btn-block" >Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import InputText from '@/components/input-text'

  export default {
    inject: ['$validator'],
    props: ['onSubmit', 'valid'],
    data () {
      return {
        form: store.state.form,
        router: store.state.router
      }
    },
    computed: {
      validCode: function () {
        return {
          rules: {
            required: true,
            digits: /EURT/.test(this.form.code) ? false : '4'
          }
        }
      }
    },
    created: function () {
      this.form.code = ''
    },
    components: {
      InputText
    },
    methods: {
      back: function () {
        this.router.page = 'payment-method'
        this.router.method = 'card'
      }
    }
  }
</script>
