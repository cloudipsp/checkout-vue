<template>
  <div class="f-sepa">
    <div class="f-block f-title2" v-t="'sepa_t'"></div>
    <div class="f-block">
      <div class="f-block-sm">
        <input-text name="sender_name" validate="required|alpha" placeholder="sender_name_p"></input-text>
        <input-text name="sender_familyName" validate="required|alpha" placeholder="sender_familyName_p"></input-text>
        <div class="f-row">
          <div class="f-col-xs-6">
            <input-text name="bic" validate="required" placement="bottom" placeholder="bic_p"></input-text>
          </div>
          <div class="f-col-xs-6">
            <input-text name="iban" validate="required" placeholder="iban_p"></input-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InputText from '@/components/input-text'

  export default {
    inject: ['$validator'],
    data () {
      return {
      }
    },
    components: {
      InputText
    }
  }
</script>
