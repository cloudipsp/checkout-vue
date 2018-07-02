<template>
  <div class="f-verify">
    <div class="f-block">
      <div class="f-block-sm">
        <input-text name="code" :validate="validCode" type="tel" :maxlength="4"></input-text>
        <div class="f-form-group">
          <button @click="onSubmit()" type="button" :class="[$css.btn, $css.bs, $css.btnLg, 'f-btn-block']" :disabled="disabled" v-t="'continue'"></button>
        </div>
        <div class="f-form-group">
          <button @click="back()" type="button" :class="[$css.btn, $css.bd, $css.btnLg, 'f-btn-block']" v-t="'cancel'"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InputText from '@/components/input-text'

  export default {
    inject: ['$validator'],
    props: ['onSubmit', 'disabled'],
    data () {
      return {
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
