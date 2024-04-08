<template>
  <div class="f-sepa">
    <div v-text="$t('sepa_t')" />

    <f-form-group v-model="params[name]" :name="name" rules="required|alpha" />
    <f-form-group
      v-model="params[surmane]"
      :name="surmane"
      rules="required|alpha"
    />
    <div class="f-row">
      <div class="f-col">
        <f-form-group v-model="params[bic]" :name="bic" rules="required" />
      </div>
      <div class="f-col">
        <f-form-group v-model="params[iban]" :name="iban" rules="required" />
      </div>
    </div>

    <f-offer />
    <f-button-pay />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FOffer,
    FButtonPay,
    FButtonCancelWrapper,
  },
  data() {
    return {
      name: 'sender_name',
      surmane: 'sender_familyName',
      bic: 'bic',
      iban: 'iban',
    }
  },
  computed: {
    ...mapState(['params']),
  },
}
</script>
