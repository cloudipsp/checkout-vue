<template>
  <div class="f-sepa">
    <div class="f-block f-title2" v-t="'sepa_t'"></div>
    <div class="f-block">
      <div class="f-block-sm">
        <input-text name="sender_name" validate="required|alpha"></input-text>
        <input-text name="sender_familyName" validate="required|alpha"></input-text>
        <div class="f-row">
          <div class="f-col-xs-6">
            <input-text name="bic" validate="required" placement="bottom"></input-text>
          </div>
          <div class="f-col-xs-6">
            <input-text name="iban" validate="required"></input-text>
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
