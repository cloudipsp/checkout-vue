<template>
  <div class="f-sepa">
    <div class="f-block f-title2">Надо какой–то текст</div>
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group" :class="{'has-error': errors.has('sender_name')}">
          <label for="f-sender-name">Имя</label>
          <tooltip :text="errors.first('sender_name')" :enable="errors.has('sender_name')">
            <input
              name="sender_name"
              v-validate="'required|alpha'"
              v-model="form.sender_name"
              data-vv-as="Имя"
              type="text"
              class="form-control"
              id="f-sender-name"
            >
          </tooltip>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('sender_familyName')}">
          <label for="f-sender-family-name">Фамилия</label>
          <tooltip :text="errors.first('sender_familyName')" :enable="errors.has('sender_familyName')">
            <input
              name="sender_familyName"
              v-validate="'required|alpha'"
              v-model="form.sender_familyName"
              data-vv-as="Фамилия"
              type="text"
              class="form-control"
              id="f-sender-family-name"
            >
          </tooltip>
        </div>
        <div class="row">
          <div class="form-group col-xs-6" :class="{'has-error': errors.has('bic')}">
            <label for="f-bic">BIC</label>
            <tooltip :text="errors.first('bic')" :enable="errors.has('bic')" placement="bottom">
              <input
                name="bic"
                v-validate="'required'"
                v-model="form.bic"
                data-vv-as="BIC"
                type="text"
                class="form-control"
                id="f-bic"
              >
            </tooltip>
          </div>
          <div class="form-group col-xs-6" :class="{'has-error': errors.has('iban')}">
            <label for="f-iban">IBAN</label>
            <tooltip :text="errors.first('iban')" :enable="errors.has('iban')">
              <input
                name="iban"
                v-validate="'required'"
                v-model="form.iban"
                data-vv-as="IBAN"
                type="text"
                class="form-control"
                id="f-iban"
              >
            </tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    inject: ['$validator'],
    props: ['form'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">

</style>
