<template>
  <div class="f-sepa">
    <div v-t="'sepa_t'" class="f-block f-title2" />
    <div class="f-block">
      <div class="f-block-sm">
        <input-text
          name="sender_name"
          validate="required|alpha"
          placeholder="sender_name_p"
        />
        <input-text
          name="sender_familyName"
          validate="required|alpha"
          placeholder="sender_familyName_p"
        />
        <div class="f-row">
          <div class="f-col-xs-6">
            <input-text
              name="bic"
              validate="required"
              placement="bottom"
              placeholder="bic_p"
            />
          </div>
          <div class="f-col-xs-6">
            <input-text name="iban" validate="required" placeholder="iban_p" />
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
  components: {
    InputText,
  },
  data() {
    return {}
  },
}
</script>
