<template>
  <div class="f-sepa">
    <div class="f-block f-title2">Надо какой–то текст</div>
    <div class="f-block">
      <div class="f-block-sm">
        <input-text name="sender-name" field="sender_name" label="Имя" validate="required|alpha"></input-text>
        <input-text name="sender-family-name" field="sender_familyName" label="Фамилия" validate="required|alpha"></input-text>
        <div class="f-row">
          <div class="f-col-xs-6">
            <input-text name="bic" label="BIC" validate="required" placement="bottom"></input-text>
          </div>
          <div class="f-col-xs-6">
            <input-text name="iban" label="IBAN" validate="required"></input-text>
          </div>
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
    data () {
      return {
        form: store.state.form
      }
    },
    components: {
      InputText
    }
  }
</script>
